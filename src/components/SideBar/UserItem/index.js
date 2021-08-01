import { MdPerson } from 'react-icons/md'
import { FaAngleDown } from 'react-icons/fa'
import styles from './styles.module.scss'
import { format } from 'date-fns'
import { useUsers } from '../../../contexts/UsersContext'
import api from '../../../services/api'

export function UserItem({
  room,
  // handleSelectRoom
}){
  const { setSelectedRoom, selectedRoom } = useUsers()
  const lastMessage = room.messages[room.messages.length - 1]
  const formattedMessageDate = room.messages.length !== 0 && 
    format(new Date(lastMessage.timestamp), "HH:mm")

  async function handleSelectRoomAA(room){ 
    setSelectedRoom(room)
    if(room._id === selectedRoom?._id){return}

    const { data } = await api.get(`room/messages/list/${room._id}`)
    data.pop()
    setSelectedRoom(prevState => {
      prevState.messages = data.concat(prevState.messages)
      return prevState
    })
  }

  return(
    <div 
      className={styles.user_container} 
      onClick={() => handleSelectRoomAA(room)}>
        
      <div className={styles.user_img}>  
        <MdPerson size={30} color="#919191"/> 
      </div>

      <div className={styles.container_char}>
        <div className={styles.name_and_time}>
          <span>{room.user[0].name}</span>
          <span>
            {formattedMessageDate}
          </span>
        </div>

        <div className={styles.message_and_counter}>
          <span>
            {room.messages.length !== 0 && lastMessage.message}
          </span>
          <div>3</div>

          <button type="button" className={styles.details}>
            <FaAngleDown size={20} color="#919191"/>
          </button>
        </div>
      </div>
    </div>
  )
}