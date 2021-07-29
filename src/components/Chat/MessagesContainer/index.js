import { MdDoneAll } from 'react-icons/md'
import { FaAngleDown } from 'react-icons/fa'
import styles from './styles.module.scss'

export function MessagesContainer(){
  return(
    <div className={styles.container}>

      <div className={styles.user_two}>
        <span className={styles.arrow_left}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 13" width="8" height="13">
            <path opacity=".13" fill="#fffffff" d="M1.533 3.568L8 12.193V1H2.812C1.042 1 .474 2.156 1.533 3.568z"></path>
            <path fill="#fff" d="M1.533 2.568L8 11.193V0H2.812C1.042 0 .474 1.156 1.533 2.568z"></path>
          </svg>
        </span>

        {/* <span className='userTwo-name'>{message.user}</span> */}
        <p className={styles.message}>Mensagem teste</p>
        <span className={styles.time}>23:32PM</span>
      </div>
 
      <div className={styles.user_one}>
        <span className={styles.arrow_right}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 13" width="8" height="13">
            <path opacity=".13" d="M5.188 1H0v11.193l6.467-8.625C7.526 2.156 6.958 1 5.188 1z"></path>
            <path fill="#dcf8c6" d="M5.188 0H0v11.193l6.467-8.625C7.526 1.156 6.958 0 5.188 0z"></path>
          </svg>
        </span>

        <p className={styles.message}>Mensagem de teste do usuário</p>

        <div className={styles.time_and_receiver}>
          <span className={styles.time}>11:32AM</span>
          <MdDoneAll size={23} color='#000'/>
        </div>
      </div>

      <div></div>
      <button 
        type='button' 
        className={styles.go_to_down}
      > 
        <FaAngleDown size={15} color="#919191"/> 
      </button>
    </div>
  )
}