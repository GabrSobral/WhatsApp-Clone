import { useState } from "react"
import EmojiSVG from '../../images/emoji.svg'
import FileSVG from '../../images/file.svg'
import AudioSVG from '../../images/audio.svg'
import { ChatHeader } from "./ChatHeader"
import { MessagesContainer } from "./MessagesContainer"

import styles from './styles.module.scss'
import { useUsers } from "../../contexts/UsersContext"
import api from "../../services/api"
import { socket } from "../../services/socket"

export function Chat(){
  const { selectedRoom, handleAddMessageToRoom } = useUsers()
  const [ newMessage, setNewMessage] = useState('')

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

  return (
    <div className={styles.container}>
      <ChatHeader/>
      <MessagesContainer/>

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
    </div>
  )
}