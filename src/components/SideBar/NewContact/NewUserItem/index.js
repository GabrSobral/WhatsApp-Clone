import { FiPlus } from 'react-icons/fi'
import { MdPerson } from 'react-icons/md'
import styles from './styles.module.scss'

export function NewUserItem(){
  return(
    <button
      type="button"
      title="Add new user" 
      className={styles.container}
    >
      <div className={styles.user_img}>
        <MdPerson size={24} fill='#919191'/>
      </div>

      <div className={styles.user_details}>
        <div>
          <span className={styles.name}>
            Rodrigo Gomes
          </span>
          <div className={styles.plus_icon}>
            <FiPlus size={18} fill="#a8a8a8"/>
          </div>  
        </div>
        
        <span className={styles.email}>Rodriguinho@gmail.com</span>
        <span className={styles.last_seen}>Last seen 9:34PM</span>
      </div>
    </button>
  )
}