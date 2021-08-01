import { format } from 'date-fns'
import { MdDoneAll } from 'react-icons/md'
import styles from './styles.module.scss'

export function UserOne({ message }){
  const formattedMessageDate = format(new Date(message.timestamp), "HH:mm")

  return(
    <div className={styles.user_one} key={message._id}>
      <span className={styles.arrow_right}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 13" width="8" height="13">
          <path opacity=".13" d="M5.188 1H0v11.193l6.467-8.625C7.526 2.156 6.958 1 5.188 1z"></path>
          <path fill="#dcf8c6" d="M5.188 0H0v11.193l6.467-8.625C7.526 1.156 6.958 0 5.188 0z"></path>
        </svg>
      </span>

      <p className={styles.message}>{message.message}</p>

      <div className={styles.time_and_receiver}>
        <span className={styles.time}>{formattedMessageDate}</span>
        <MdDoneAll size={23} color='#000'/>
      </div>
    </div>
  )
}