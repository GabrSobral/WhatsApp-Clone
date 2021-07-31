import { format } from 'date-fns'
import { MdMoreVert, MdPerson, MdSearch } from 'react-icons/md'
import { useUsers } from '../../../contexts/UsersContext'
import styles from './styles.module.scss'

export function ChatHeader(){
  const { selectedRoom } = useUsers()

  const formattedDate = selectedRoom.user[0] &&
  format(
    new Date(selectedRoom.user[0].lastOnline), 
    "'visto por último ás' H:mm")

  return(
    <header className={styles.container}>
      <div className={styles.img_container}>
        <MdPerson size={24} color="#919191"/>
      </div>
      <div className={styles.name_and_users}>
        <span className='chat-name'>{selectedRoom.user[0].name}</span>
        <span className='chat-last-online'>
          {selectedRoom?.user[0].isOnline ? 'online' : formattedDate}
        </span>
      </div>
      <div className={styles.search_and_more}>
        <button type='button'><MdSearch size={23} color="#919191"/></button>
        <button type='button'><MdMoreVert size={23} color="#919191"/></button>
      </div>
    </header>
  )
}