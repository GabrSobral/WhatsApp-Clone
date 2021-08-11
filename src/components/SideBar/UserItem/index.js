import { MdDoneAll, MdPerson } from 'react-icons/md'
import { FaAngleDown } from 'react-icons/fa'
import styles from './styles.module.scss'
import { format } from 'date-fns'
import { useUsers } from '../../../contexts/UsersContext'
import { useAuth } from '../../../contexts/AuthContext'

export function UserItem({
  room,
  handleSelectRoom
}){
  const { isFocused } = useUsers()
  const { myId } = useAuth()
  const lastMessage = room.messages[room.messages.length - 1]
  const formattedMessageDate = room.messages.length !== 0 && 
    format(new Date(lastMessage.timestamp), "HH:mm")

  return(
    <div 
      className={styles.user_container} 
      onClick={() => handleSelectRoom(room)}
    >
        
      <div className={`${styles.user_img} ${room.user[0].isOnline && styles.online}`}>  
        <MdPerson size={30} fill={room.user[0].isOnline ? '#51b786' : '#919191'}/> 
      </div>

      <div className={styles.container_char}>
        <div className={styles.name_and_time}>
          <span>{room.user[0].name}</span>
          <span>
            {formattedMessageDate}
          </span>
        </div>

        <div className={styles.message_and_counter}>
          { room.isWritting ? 
            <span className={styles.writting}>digitando...</span> : 
            <span className={`${styles.lastMessage} ${!isFocused && styles.blur}`}>
              {room.messages.length !== 0 && 
                (lastMessage.user !== myId ? 
                  (lastMessage?.message) :
                  (<>
                  <MdDoneAll size={19} fill={lastMessage?.viewed ? "#30B1E7" : "#A6ADA0"}/>
                  {lastMessage?.message}
                  </>))
              }
            </span>
          }

          {room.unreadMessages !== 0 && <div>{room?.unreadMessages}</div>}

          <button type="button" className={styles.details}>
            <FaAngleDown size={20} fill="#919191"/>
          </button>
        </div>
      </div>
    </div>
  )
}