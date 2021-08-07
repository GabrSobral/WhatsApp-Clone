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

      <p className={styles.message}>
        {message.message}

        <div className={styles.time_and_receiver}>
          <span className={styles.time}>{formattedMessageDate}</span>
          { message.received ? 
            <MdDoneAll size={16} fill={message.viewed ? "#30B1E7" : "#A6ADA0"}/> :
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 15" width="16" height="15">
              <path fill="currentColor" d="M9.75 7.713H8.244V5.359a.5.5 0 0 0-.5-.5H7.65a.5.5 0 0 0-.5.5v2.947a.5.5 0 0 0 .5.5h.094l.003-.001.003.002h2a.5.5 0 0 0 .5-.5v-.094a.5.5 0 0 0-.5-.5zm0-5.263h-3.5c-1.82 0-3.3 1.48-3.3 3.3v3.5c0 1.82 1.48 3.3 3.3 3.3h3.5c1.82 0 3.3-1.48 3.3-3.3v-3.5c0-1.82-1.48-3.3-3.3-3.3zm2 6.8a2 2 0 0 1-2 2h-3.5a2 2 0 0 1-2-2v-3.5a2 2 0 0 1 2-2h3.5a2 2 0 0 1 2 2v3.5z"></path>
            </svg>
          }
        </div>
      </p>

      
    </div>
  )
}