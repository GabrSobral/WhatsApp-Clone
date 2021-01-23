import React, { useEffect, useRef, useState } from 'react'
import '../styles/Chat.css'
import { MdMoreVert, MdSearch, MdDoneAll,  MdPerson, MdArrowDownward } from 'react-icons/md'
import api from '../services/api.js'
import { getToken } from '../services/api.js'
import { socket } from './Sidebar.js'
import ReactLoading from 'react-loading'

export default function Chat({ room, roomName, lastOnline, done, setDone, setLastOnline, userId }) {
    const [ newMessage, setNewMessage ] = useState('')
    const [ messages, setMessages ] = useState([])
    const scroll = useRef(null)
    const goToDown = useRef(null)
    const token = getToken()
    const tokenDecoded = parseJwt(token)
    
    
    useEffect(() => {
        if(!room) return
        api.get(`/room/messages/${room}`).then(response => {
            setMessages(response.data)
            setDone(true)
        })
    }, [room, setDone]);

    useEffect(() => {
        socket.on('newMessage', ({messageData}) => {
            setMessages(prevMessages => [...prevMessages, messageData])
            console.log(messageData)
        })

        return () => {
            socket.removeAllListeners()
        }
    }, [])

    socket.on('updateUser', (statusUser, user) => {
        if(userId === user){
          setLastOnline(statusUser)
        } 
    })

    function formatDate(date){
        if(date === true){
            return "Online"
        }
        if(date === "Online"){
            return date
        }
        if(date === ''){
            return
        }
        if(!date){
            const currentLastOnline = new Intl.DateTimeFormat('pt-BR', {
                hour: '2-digit', 
                minute: '2-digit'}).format(Date.now())

            return currentLastOnline
        }

        const parsedDate = Date.parse(date)

        const CurrentDate = new Intl.DateTimeFormat('pt-BR', {
            hour: '2-digit', 
            minute: '2-digit'}).format(parsedDate)

        return CurrentDate
    }

    const scrollToBottom = () => {
         if(!room) return
        scroll.current.scrollIntoView({behavior : 'smooth' })
    }

    useEffect(scrollToBottom, [messages, room]);

    function handleScroll(event){
        const target = event.target

        if(target.scrollHeight - target.scrollTop === target.clientHeight){
            goToDown.current.style.display = 'none'
        } else {
            goToDown.current.style.display = 'flex'
        }
    }

    async function sendMessage(event){
        event.preventDefault()

        const message = { 
            message: newMessage,
            user : tokenDecoded.id ,
            timestamp : Date.now(),
            assignedTo: room,
            received: false,
        }

        try{
            api.post('/messages/new', message).then((res)=>{
                const messageData =  res.data.messages
                socket.emit('sendMessage', ({messageData, room}))
            })
            setNewMessage('')
        } catch(err) {
            alert("erro ao enviar")
            console.log(err)
        }
        
    }
    function parseJwt (token) {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
    
        return JSON.parse(jsonPayload);
    };
       
    return (
    <>
    {!room ? (null): (
        <div className='Chat'>
            <header className='chat-header'>
                <div className='chat-img'>  <MdPerson size={24} color="#919191"/> </div>
                <div className='chat-header-name-and-users'>
                    <span className='chat-name'>{roomName}</span>
                    <span className='chat-last-online'>{formatDate(lastOnline)}</span>
                </div>
                <div className='search-and-more'>
                    <button type='button'> <MdSearch size={23} color="#919191"/></button>
                    <button type='button'> <MdMoreVert size={23} color="#919191"/></button>
                </div>
            </header>
            <div className='messages' onScroll={handleScroll}>

            {messages.map(message => {
                if(message.user !== tokenDecoded.id){
                    return (
                        <div className='message-userTwo' key={message._id}>
                            <span className="arrow-left">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 13" width="8" height="13">
                                    <path opacity=".13" fill="#fffffff" d="M1.533 3.568L8 12.193V1H2.812C1.042 1 .474 2.156 1.533 3.568z"></path>
                                    <path fill="#fff" d="M1.533 2.568L8 11.193V0H2.812C1.042 0 .474 1.156 1.533 2.568z"></path>
                                </svg>
                            </span>
                            {/* <span className='userTwo-name'>{message.user}</span> */}
                            <p className='userTwo-message'>{message.message}</p>
                            <span className='time'>{formatDate(message.timestamp)}</span>
                            
                        </div>
                    )
                } else {
                    return (
                        <div className='message-userOne' key={message._id}>

                            <span className="arrow-right">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 13" width="8" height="13">
                                    <path opacity=".13" d="M5.188 1H0v11.193l6.467-8.625C7.526 2.156 6.958 1 5.188 1z"></path>
                                    <path fill="#dcf8c6" d="M5.188 0H0v11.193l6.467-8.625C7.526 1.156 6.958 0 5.188 0z"></path>
                                </svg>
                            </span>
                            <p className='userOne-message'>{message.message}</p>
                            <div className='time-and-receiver'>
                                <span className='time'>{formatDate(message.timestamp)}</span>
                                <MdDoneAll size={23} color='#000'/>
                            </div>
                            
                        </div>
                    )
                }
                
            })}

                <div ref={scroll}></div>
                <button 
                    type='button' 
                    className='goToDown' 
                    ref={goToDown}
                    onClick={scrollToBottom}> 
                        <MdArrowDownward size={15} color="#919191"/> 
                </button>
            </div>
            <div className='write-message'>
                <form onSubmit={sendMessage}>
                    <input value={newMessage}type='text' placeholder='Digite uma mensagem' onChange={(event)=> { setNewMessage(event.target.value) }}/>
                    <button type='submit'></button>
                </form>
            
            </div>

        {!done ? ( 
            <div className='react-loading'>
                <ReactLoading type={'spin'} color={'gray'} height={50} width={50}/>
            </div> ) 
            : (null)}
        </div>   
    )}
       
    </>
    )
}