import { MdPerson } from 'react-icons/md'
import { FaAngleDown } from 'react-icons/fa'
import styles from './styles.module.scss'

export function UserItem(){
  return(
    <button 
      className={styles.user_container} 
      onClick={() => {}}>
        
      <div className={styles.user_img}>  
        <MdPerson size={30} color="#919191"/> 
      </div>

      <div className={styles.container_char}>
        <div className={styles.name_and_time}>
          <span>Bananinha</span>
          <span>23:39</span>
        </div>

        <div className={styles.message_and_counter}>
          <span>Mensagem de teste para preview, Lorem Ipsum set ic man krekca</span>
          <div>3</div>

          <button type="button" className={styles.details}>
            <FaAngleDown size={20} color="#919191"/>
          </button>
        </div>
      </div>
    </button>
  )
}