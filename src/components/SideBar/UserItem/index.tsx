import { format } from 'date-fns'
import { useAuth } from '../../../contexts/AuthContext'
import { useRooms } from '../../../contexts/RoomsContext'
import { SendingSVG } from '../../../images/sending'
import { IRoom } from '../../../types/IRoom'
import { PersonSVG } from '../../../images/person'
import { ArrowDown } from '../../../images/arrow_down'
import { DoubleCheckSVG } from '../../../images/double_check'

import styles from './styles.module.scss'

type Props = {
  room: IRoom;
  index: number;
}

export function UserItem({ room, index }: Props){
  const { isFocused, handleSelectRoom, selectedRoom } = useRooms()
  const { myId } = useAuth()
  const lastMessage = room.messages[room.messages.length - 1]
  const formattedMessageDate = room.messages.length !== 0 && 
    format(new Date(lastMessage.timestamp), "HH:mm")

  return(
    <div onClick={() => handleSelectRoom(index)} className={`${styles.user_container} 
        ${selectedRoom?._id === room._id && styles.active}`}>
      <div className={`${styles.user_img} ${room.user[0].isOnline && styles.online}`}>  
        <PersonSVG color={room.user[0].isOnline ? '#51b786':'#b5b5b5'}/> 
      </div>

      <div className={styles.container_char}>
        <div className={styles.name_and_time}>
          <span>{room.user[0].name}</span>
          <span>{formattedMessageDate}</span>
        </div>

        <div className={styles.message_and_counter}>
          { room.isWritting ? 
            <span className={styles.writting}>typing...</span> : 
            <div className={`${styles.lastMessage} ${!isFocused && styles.blur}`}>
              {lastMessage?.user === myId && (lastMessage.received ?
                <DoubleCheckSVG color={lastMessage?.viewed ? "#30B1E7":"#b1b1b1"} size={18}/> : 
                <SendingSVG color="#b1b1b1"/>)}
              <span>{lastMessage?.message}</span>
            </div>
          }

          {room.unreadMessages !== 0 && 
            <span className={styles.message_counter}>{room?.unreadMessages}</span>}

          <button type="button" className={styles.details} onClick={()=> alert()}>
            <ArrowDown size={15} color="#b1b1b1"/>
          </button>
        </div>
      </div>
    </div>
  )
}