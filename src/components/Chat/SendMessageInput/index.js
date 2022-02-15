import { useState, useEffect } from 'react'
import { uniqueId } from 'lodash'

import EmojiSVG from '../../../images/emoji.svg'
import FileSVG from '../../../images/file.svg'
import AudioSVG from '../../../images/audio.svg'

import { useRooms } from '../../../contexts/RoomsContext'
import { useAuth } from '../../../contexts/AuthContext'
import { socket } from "../../../services/socket"

import styles from './styles.module.scss'

export function SendMessageInput(){
  const [ newMessage, setNewMessage ] = useState([])
  const [ verify, setVerify ] = useState(false);
  const { selectedRoom, RoomDispatch, rooms, selectedIndex } = useRooms()
  const { myId } = useAuth();

  async function sendMessage(event){
    event.preventDefault()
    if(newMessage.trim() === '') return;

    const message = {
      _id: uniqueId(),
      public_id: `${new Date().getTime()}${myId}`,
      message: newMessage.trim(),
      assignedTo: selectedRoom._id,
      referencedTo: {
        _id: "62066a0cbba23556ebb751c4",
        message: "aaa",
        user: "6204ebe39b44271c9e150630",
      },
      received: false,
      timestamp: new Date(),
      user: myId,
      viewed: false
    };

    setNewMessage('');
		RoomDispatch({ type: "add_message_to_room", payload: { message }});

    socket.emit('sendMessage', { message });
  }
  const typeAMessage = (message) => {
    setNewMessage(prev => prev[selectedIndex].message = message);
  }

  useEffect(() => {
    setNewMessage(rooms.map(() => [{ message: "", referencedTo: null }]));
    console.log(rooms.map(() => [{ message: "", referencedTo: null }]));
  },[rooms])
  
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
      <form onSubmit={sendMessage}>
        <button type="button">
          <img src={EmojiSVG} alt="Emoji"/>
        </button>
        <button type="button">
          <img src={FileSVG} alt="Anexos"/>
        </button>

        <input 
          value={newMessage[selectedIndex].message} 
          type='text' 
          placeholder='Type a message' 
          onChange={(event)=> typeAMessage(event.target.value)}
        />
          
        <button type="button">
          <img src={AudioSVG} alt="Anexos"/>
        </button>
      </form>
    </div>
  )
}