import { useState } from 'react'

import EmojiSVG from '../../../images/emoji.svg'
import FileSVG from '../../../images/file.svg'
import AudioSVG from '../../../images/audio.svg'

import { useUsers } from '../../../contexts/UsersContext'
import api from "../../../services/api"
import { socket } from "../../../services/socket"
import styles from './styles.module.scss'
import { useEffect } from 'react'

export function SendMessageInput(){
  const { selectedRoom, handleAddMessageToRoom } = useUsers()
  const [ newMessage, setNewMessage] = useState('')
  const [ verify, setVerify ] = useState(false)

  async function sendMessage(event){
    event.preventDefault()
    if(newMessage === ''){
      return
    }

    const message = {
      message: newMessage,
      assignedTo: selectedRoom._id,
    }

    const { data } = await api.post('messages/new', message)
    socket.emit('sendMessage', 
      { messageData: data, room: selectedRoom.user[0]._id}
    )
    handleAddMessageToRoom(data)
    setNewMessage('')
  }
  
  useEffect(() => {
    if(newMessage !== '' && !verify) {
      setVerify(true)
      socket.emit('writting', { 
        to: selectedRoom.user[0]._id,
        writting: true,
        room: selectedRoom._id
      })
    } else if(newMessage === '' && verify){
      setVerify(false)
      socket.emit('writting', { 
        to: selectedRoom.user[0]._id, 
        writting: false ,
        room: selectedRoom._id
      })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[newMessage])
  
  return(
    <div className={styles.write_message}>
      <form onSubmit={sendMessage}>
        <button type="button">
          <img src={EmojiSVG} alt="Emoji"/>
        </button>
        <button type="button">
          <img src={FileSVG} alt="Anexos"/>
        </button>

        <input 
          value={newMessage} 
          type='text' 
          placeholder='Digite uma mensagem' 
          onChange={
            (event)=> { setNewMessage(event.target.value) }
          }/>
          
        <button type="button">
          <img src={AudioSVG} alt="Anexos"/>
        </button>
      </form>
    </div>
  )
}