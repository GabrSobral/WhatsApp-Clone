import { format } from 'date-fns'
import { useAuth } from '../../../contexts/AuthContext'
import { useRooms } from '../../../contexts/RoomsContext'
import { SendingSVG } from '../../../images/sending'
import { PersonSVG } from '../../../images/person'
import { ArrowDown } from '../../../images/arrow_down'
import { DoubleCheckSVG } from '../../../images/double_check'

import styles from './styles.module.scss'
import { IContactsSchema } from '../../../services/DBConfig'

type Props = {
  contact: IContactsSchema;
  index: number;
}

export function UserItem({ contact, index }: Props){
  const { isFocused, handleSelectRoom, selectedRoom } = useRooms()
  // const lastMessage = room.messages[room.messages.length - 1]
  // const formattedMessageDate = room.messages.length !== 0 && 
  //   format(new Date(lastMessage.timestamp), "HH:mm")

  return(
    <div onClick={() => handleSelectRoom(index)} className={`${styles.user_container}`}>
      <div className={`${styles.user_img} ${styles.online}`}>  
        <PersonSVG color={'#b5b5b5'}/> 
      </div>

      <div className={styles.container_char}>
        <div className={styles.name_and_time}>
          <span>{contact.display_name}</span>
          <span>13:03</span>
        </div>

        <div className={styles.message_and_counter}>
          {/* { room.isWritting ? 
            <span className={styles.writting}>typing...</span> : 
            <div className={`${styles.lastMessage} ${!isFocused && styles.blur}`}>
              {lastMessage?.user === myId && (lastMessage.received ?
                <DoubleCheckSVG color={lastMessage?.viewed ? "#30B1E7":"#b1b1b1"} size={18}/> : 
                <SendingSVG color="#b1b1b1"/>)} */}
              <span>teste</span>
            {/* </div>
          } */}

          <div style={{ display: "flex", gap: '0.3rem' }}>
            {/* {room.unreadMessages !== 0 &&  */}
              <span className={styles.message_counter}>1</span>
            {/* } */}

            <button type="button" className={styles.details} onClick={()=> alert()}>
              <ArrowDown size={15} color="#b1b1b1"/>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}