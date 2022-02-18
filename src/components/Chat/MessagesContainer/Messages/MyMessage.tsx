import { format } from 'date-fns'
import { useAuth } from '../../../../contexts/AuthContext';
import { useRooms } from '../../../../contexts/RoomsContext';
import { AnswerSVG } from '../../../../images/answer';
import { DoubleCheckSVG } from '../../../../images/double_check';
import { SendingSVG } from '../../../../images/sending';
import { IMessage } from '../../../../types/IMessage';

import styles from './styles.module.scss'

export const MyMessage = ({ message }: { message: IMessage }) => {
  const formattedMessageDate = format(new Date(message.timestamp), "HH:mm");
  const { myId } = useAuth();
  const { roomActions } = useRooms();

  return(
    <div className={`${styles.wrapper} ${styles.me}`}>
      <div className={styles.buttons_wrapper}>
        <button type="button" onClick={() => roomActions.selectMessageToAnswer(message)}>
          <AnswerSVG color="#A6ADA0" size={15}/>
        </button>
      </div>

      <div className={`${styles.container} ${styles.me}`} key={message._id}>
        { message.referencedTo &&
          <div className={styles.referencedTo_container}>
            <span className={styles.my_name}>
              {myId === message.referencedTo.user ? "Você": message.user}
            </span>
            <span>{message.referencedTo.message}</span>
          </div>
        }

        <div className={styles.message_content_container}>
          <p className={styles.message}>{message.message}</p>
          <div className={styles.time_and_receiver}>
            <span className={styles.time}>{formattedMessageDate}</span>
            { message.received ? 
              <DoubleCheckSVG size={16} color={message.viewed ? "#30B1E7" : "#A6ADA0"}/> :
              <SendingSVG color="#A6ADA0" size={16}/>
            }
          </div>
        </div>
      </div>
      
    </div>
  )
}