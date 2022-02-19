import { useState, useEffect, FormEvent, useRef } from 'react'
// import { MdClose } from 'react-icons/md'
import { uniqueId } from 'lodash'

import { EmojiSVG } from '../../../images/emoji'
import { FileSVG } from '../../../images/file'
import { AudioSVG } from '../../../images/audio'

import { useRooms } from '../../../contexts/RoomsContext'
import { useAuth } from '../../../contexts/AuthContext'

import styles from './styles.module.scss'
import { IMessage } from '../../../types/IMessage'
import { CloseSvg } from '../../../images/close'
import { useSocket } from '../../../contexts/SocketContext'

export function SendMessageInput(){
  const { socket } = useSocket();
  const [ newMessage, setNewMessage ] = useState("");
  const [ verify, setVerify ] = useState(false);
  const { selectedRoom, roomActions } = useRooms();
  const { myId } = useAuth();
  const inputRef = useRef<HTMLInputElement>(null);

  async function sendMessage(event: FormEvent){
    event.preventDefault()
    if(newMessage.trim() === '') return;

    const message: IMessage = {
      _id: uniqueId(),
      public_id: `${new Date().getTime()}${myId}`,
      message: newMessage.trim(),
      assignedTo: selectedRoom?._id || "",
      referencedTo: selectedRoom?.referencedTo,
      received: false,
      timestamp: new Date(),
      user: myId,
      viewed: false
    };

    setNewMessage('');
    roomActions.addMessageToRoom(message);
    selectedRoom?._id && roomActions.removeReferencedTo(selectedRoom?._id);
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
      to: selectedRoom?.user[0]._id, 
      writting: verify,
      room: selectedRoom?._id
    });
  },[verify, selectedRoom])

  useEffect(() => {
    inputRef.current?.focus();
  },[selectedRoom?.referencedTo])
  
  return(
    <div className={styles.write_message}>
      { selectedRoom?.referencedTo && 
        <div className={styles.referencedTo_container}>
          <div className={styles.message_container}>
            <span className={styles.my_name}>{selectedRoom?.referencedTo.user}</span>
            <span>{selectedRoom?.referencedTo.message}</span>
          </div>
          <button 
            type="button" 
            onClick={() => roomActions.removeReferencedTo(selectedRoom?._id)}
          >
            <CloseSvg size={14} color="#54656F"/>
          </button>
        </div>
      }

      <form onSubmit={sendMessage}>
        <button type="button">
          <EmojiSVG color="#54656F"/>
        </button>
        <button type="button">
          <FileSVG color="#54656F"/>
        </button>

        <input 
          ref={inputRef}
          value={newMessage} 
          type='text' 
          placeholder='Type a message' 
          onChange={(event)=> setNewMessage(event.target.value)}
        />
          
        <button type="button">
          <AudioSVG color="#54656F"/>
        </button>
      </form>
    </div>
  )
}