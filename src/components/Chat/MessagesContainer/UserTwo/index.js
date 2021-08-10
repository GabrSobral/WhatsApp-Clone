import { format } from 'date-fns'
import styles from './styles.module.scss'

export function UserTwo({ message }){
  const formattedMessageDate = format(new Date(message.timestamp), "HH:mm")

  return(
    <div className={styles.user_two} key={message._id}>
      <span className={styles.arrow_left}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 13" width="8" height="13">
          <path opacity=".13" fill="#fffffff" d="M1.533 3.568L8 12.193V1H2.812C1.042 1 .474 2.156 1.533 3.568z"></path>
          <path fill="#fff" d="M1.533 2.568L8 11.193V0H2.812C1.042 0 .474 1.156 1.533 2.568z"></path>
        </svg>
      </span>

      {/* <span className='userTwo-name'>{message.user}</span> */}
      <p className={styles.message}>{message.message}</p>
      <span className={styles.time}>{formattedMessageDate}</span>
      
    </div>
  )
}