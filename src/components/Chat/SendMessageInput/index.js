import { useState, useEffect } from 'react'
import { MdClose } from 'react-icons/md'
import { uniqueId } from 'lodash'

import EmojiSVG from '../../../images/emoji.svg'
import FileSVG from '../../../images/file.svg'
import AudioSVG from '../../../images/audio.svg'

import { useRooms } from '../../../contexts/RoomsContext'
import { useAuth } from '../../../contexts/AuthContext'
import { socket } from "../../../services/socket"

import styles from './styles.module.scss'

export function SendMessageInput(){
  const [ newMessage, setNewMessage ] = useState("");
  const [ verify, setVerify ] = useState(false);
  const { selectedRoom, RoomDispatch } = useRooms();
  const { myId } = useAuth();

  async function sendMessage(event){
    event.preventDefault()
    if(newMessage.trim() === '') return;

    const message = {
      _id: uniqueId(),
      public_id: `${new Date().getTime()}${myId}`,
      message: newMessage.trim(),
      assignedTo: selectedRoom._id,
      referencedTo: selectedRoom.referencedTo,
      received: false,
      timestamp: new Date(),
      user: myId,
      viewed: false
    };

    setNewMessage('');
		RoomDispatch({ type: "add_message_to_room", payload: { message }});

    socket.emit('sendMessage', { message });
  }
  
  useEffect(() => {
    setVerify(prev => {
      if(newMessage !== "" && !prev) 
        return true;
      else if(newMessage === "" && prev)
        return false;

      return prev;
    });
  },[newMessage])

  useEffect(() => {
    socket.emit('writting', { 
      to: selectedRoom.user[0]._id, 
      writting: verify,
      room: selectedRoom._id
    });

    return () => socket.removeAllListeners();
  },[verify, selectedRoom])
  
  return(
    <div className={styles.write_message}>
      { selectedRoom.referencedTo && 
        <div className={styles.referencedTo_container}>
          <div className={styles.message_container}>
            <span className={styles.my_name}>{selectedRoom.referencedTo.user}</span>
            <span>{selectedRoom.referencedTo.message}</span>
          </div>
          <button type="button">
            <MdClose size={32} color="#404041"/>
          </button>
        </div>
      }

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
          placeholder='Type a message' 
          onChange={(event)=> setNewMessage(event.target.value)}
        />
          
        <button type="button">
          <img src={AudioSVG} alt="Record an audio to send"/>
        </button>
      </form>
    </div>
  )
}