import React, { useEffect, useState, useRef } from 'react'
import '../styles/Sidebar.css'
import { MdDonutLarge, MdSpeakerNotes, MdMoreVert, MdSearch, MdPerson } from 'react-icons/md'
import api from '../services/api.js'
import { getToken, logout } from '../services/api.js'
import { Link, useHistory } from 'react-router-dom'
import { useRoom } from '../context/roomContext.js'
import Chat from './Chat.js'
import io from "socket.io-client";

let bool = false
const connectionOptions =  {
    "force new connection" : true,
    "reconnectionAttempts": "Infinity", 
    "timeout" : 10000,                  
    "transports" : ["websocket"]
  };
export const socket = io.connect('https://chat-api-sobral.herokuapp.com/', connectionOptions);

export default function SidebarAndChat(){
    const [ open, setOpen ] = useState(bool)
    const { room, setRoom } = useRoom()
    const [ lastOnline, setLastOnline ] = useState('')
    const [ roomName, setRoomName ] = useState('')
    const [ users, setUsers ] = useState([])
    const [ userId, setUserId ] = useState('')
    const [ search, setSearch ] = useState('')
    let [ done, setDone ] = useState(true)

    const token = getToken()
    const tokenDecoded = parseJwt(token)

    const popupRef = useRef(null)
    const history = useHistory()

    useEffect(() => {
        api.get('/users').then(response => {
          setUsers(response.data)
        })
      }, []);
    
      socket.on("newUser", (user) => {
        setUsers([...users, user])
      });
      socket.on('deleteUser', (user) => {
        api.get('/users').then(response => {
          setUsers(response.data)
        })
      })


    function OutsideMe(ref){
        useEffect(() => {
            function handleClickOutside(event){
                if(ref.current && !ref.current.contains(event.target)) {
                    setOpen(false)
                }
            }
            document.addEventListener('mousedown', handleClickOutside)
            return () => {
                document.removeEventListener('mousedown', handleClickOutside)
            }
        }, [ref])
    }

    function parseJwt (token) {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
    
        return JSON.parse(jsonPayload);
    };

    function PopupMore(){
        OutsideMe(popupRef)
        return(
            <div className='popupMore' ref={popupRef}>
                <button type='button' className='popupButton'onClick={Logout}>Desconectar</button>
            </div>
        )
    }

    async function Logout(){
        await api.patch('/users/logout').then(()=>{
            logout()
            history.push('/SignIn')
        })
    }

    async function createRoom(name, lastOnline, isOnline, userId) {
        setDone(false)
        await api.post('/room', { name : `Sala privada`, user : userId})
        .then((response) => { 
            if(room === response.data._id) return setDone(true)
            socket.emit('leaveRoom', (room))
            setRoom(response.data._id)
            setRoomName(name)

            socket.emit('joinroom', (response.data._id))

            api.get(`/users/${userId}`).then((response) => {
                if(response.data.isOnline){
                    setLastOnline('Online')
                    return
                } else {
                    setLastOnline(response.data.lastOnline)
                    return
                }
            })
        }).catch( err => {
            socket.emit('leaveRoom', (room))
            setRoom(err.response.data._id)
            setRoomName(name)

            socket.emit('joinroom', (err.response.data._id))
            
            if(isOnline){
                return setLastOnline('Online')
            } else {
                return setLastOnline(lastOnline)
            }
        })
    }

    return(
        <>
        <div className='sidebar'>
            <header className='sidebar-header'>
                <div className='user-img'>  <MdPerson size={24} color="#919191"/> </div>
                <div className='options-header-container'>
                    <button type='button' className='optionButton'> <MdDonutLarge size={23} color="#919191"/> </button>
                    <button type='button' className='optionButton'> <MdSpeakerNotes size={23} color="#919191"/></button>
                    <button type='button' onClick={() => setOpen(true)} className='optionButton'> <MdMoreVert size={23} color="#919191"/></button>
                    {open &&  <PopupMore/> }
                </div>
            </header>
            <div className='search-bar'>
                <div>
                    <MdSearch size={20} color='#919191'/>
                    <input type='text' placeholder='Procurar ou começar uma nova conversa' onChange={(event) => { setSearch(event.target.value) }}/>
                </div>  
            </div>
            <div className='chats'>

                {users.filter(val =>{
                                
                    if(search === ''){
                       return val
                    }else if(val.name.toLowerCase().includes(search.toLowerCase())){
                        return val
                    }
                    return console.log("")

                }).map(user => {
                    if(user._id !== tokenDecoded.id){
                        return (
                            <Link 
                                to={'/'} 
                                className='sidebar-chat-user' 
                                key={user._id} 
                                onClick={() => { 
                                    createRoom(user.name, user.lastOnline, user.isOnline, user._id) 
                                    setUserId(user._id)
                                    }}>
                                    
                                <div className='side-bar-chat-user-img'>  <MdPerson size={30} color="#919191"/> </div>
                                <div className='container-chat'>
                                    <div className='name-and-time'>
                                        <span className='name'>{user.name}</span>
                                        <span className='time'>{}</span>
                                    </div>
    
                                    <div className='message-and-counter'>
                                        <span className='message-preview'>{}</span>
                                        {/* <div>3</div> */}
                                    </div>
                                </div>
                            </Link>
                        )
                    }
                    return console.log()
                })}
                  
            </div>
        </div>

        <Chat 
            room={room} 
            roomName={roomName} 
            lastOnline={lastOnline}
            done={done}
            setDone={setDone}
            setLastOnline={setLastOnline}
            userId={userId}/>
        </>
    )
}
