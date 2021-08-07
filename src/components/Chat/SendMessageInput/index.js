import { useState } from 'react'
import { uniqueId } from 'lodash'

import EmojiSVG from '../../../images/emoji.svg'
import FileSVG from '../../../images/file.svg'
import AudioSVG from '../../../images/audio.svg'

import { useUsers } from '../../../contexts/UsersContext'
import api from "../../../services/api"
import { socket } from "../../../services/socket"
import styles from './styles.module.scss'
import { useEffect } from 'react'
import { parseJwt } from '../../../utils/parseJWT'
import { getToken } from '../../../utils/handleToken'

export function SendMessageInput(){
  const { 
    selectedRoom, 
    handleAddMessageToRoom, 
    handleUpdateMessagesSent 
  } = useUsers()
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
    const messageWithAllData = {
      _id: uniqueId(),
      message: newMessage,
      assignedTo: selectedRoom._id,
      received: false,
      timestamp: new Date(),
      user: parseJwt(getToken()).id,
      viewed: false
    }

    handleAddMessageToRoom(messageWithAllData)
    setNewMessage('')
    api.post('messages/new', message).then(({ data }) => {
      socket.emit('sendMessage', 
        { messageData: data, room: selectedRoom.user[0]._id}
      )
      messageWithAllData._id = data._id
      messageWithAllData.received = true
      handleUpdateMessagesSent(messageWithAllData)
    })
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