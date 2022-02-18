import { format } from 'date-fns'
import { useAuth } from '../../../../contexts/AuthContext';
import { useRooms } from '../../../../contexts/RoomsContext';
import { AnswerSVG } from '../../../../images/answer';
import ArrowLeft from '../../../../images/message_arrow_left.svg'
import { IMessage } from '../../../../types/IMessage';

import styles from './styles.module.scss'

export const AnotherMessage = ({ message }: { message: IMessage }) => {
  const formattedMessageDate = format(new Date(message.timestamp), "HH:mm");
  const { roomActions } = useRooms();
  const { myId } = useAuth();

  return(
    <div className={styles.wrapper}>
      <div className={styles.container} key={message._id}>
        { message.referencedTo &&
          <div className={styles.referencedTo_container}>
            <span className={styles.my_name}>
              {myId === message.referencedTo.user ? "Você":message.user}
            </span>
            <span>{message.referencedTo.message}</span>
          </div>
        }

        <div className={styles.message_content_container}>
          <p className={styles.message}>{message.message}</p>
          <span className={styles.time_and_receiver}>{formattedMessageDate}</span>
        </div>
      </div>

      <div className={styles.buttons_wrapper}>
        <button type="button" onClick={() => roomActions.selectMessageToAnswer(message)}>
          <AnswerSVG color="#A6ADA0" size={15}/>
        </button>
      </div>
    </div>
  )
}