import { format } from 'date-fns'
import { useAuth } from '../../../../contexts/AuthContext';
import { useRooms } from '../../../../contexts/RoomsContext';
import ArrowLeft from '../../../../images/message_arrow_left.svg'
import styles from './styles.module.scss'

export function UserTwo({ message }){
  const formattedMessageDate = format(new Date(message.timestamp), "HH:mm");
  const { selectMessageToAnswer } = useRooms();
  const { myId } = useAuth();

  return(
    <div 
      className={styles.user_two} 
      key={message._id} 
      onClick={() => selectMessageToAnswer(message)}
    >
      <span className={styles.arrow_left}>
        <img src={ArrowLeft} alt="arrow of popup" />
      </span>

      { message.referencedTo &&
        <div className={styles.referencedTo_container}>
          <span className={styles.my_name}>{myId === message.referencedTo.user ? "Você":message.user}</span>
          <span>{message.referencedTo.message}</span>
        </div>
      }

      {/* <span className='userTwo-name'>{message.user}</span> */}
      <p className={styles.message}>{message.message}</p>
      <span className={styles.time}>{formattedMessageDate}</span>
    </div>
  )
}