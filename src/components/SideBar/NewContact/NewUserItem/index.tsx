import { format } from 'date-fns'

import styles from './styles.module.scss'

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  name: string;
  phoneNumber: string;
  last_seen: Date;
  isOnline: boolean;
}

export function NewUserItem({ name, phoneNumber, last_seen, isOnline, ...rest }: Props){
  const formattedDate = 
    format(new Date(last_seen), "'visto por último ás' H:mm")

  return(
    <button
      type="button"
      title="Add new user" 
      className={styles.container}
      {...rest}
    >
      <div className={styles.user_img}>
        {/* <MdPerson size={24} fill='#919191'/> */}
      </div>

      <div className={styles.user_details}>
        <div>
          <span className={styles.name}>{name}</span>
          <div className={styles.plus_icon}>
            {/* <FiPlus size={18} fill="#a8a8a8"/> */}
          </div>  
        </div>
        
        <span className={styles.email}>{phoneNumber}</span>
        <span className={styles.last_seen}>
          {isOnline ? "online" : formattedDate}
        </span>
      </div>
    </button>
  )
}