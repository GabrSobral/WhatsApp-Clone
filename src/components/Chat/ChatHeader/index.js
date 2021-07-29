import { MdMoreVert, MdPerson, MdSearch } from 'react-icons/md'
import styles from './styles.module.scss'

export function ChatHeader(){
  return(
    <header className={styles.container}>
      <div className={styles.img_container}>
        <MdPerson size={24} color="#919191"/>
      </div>
      <div className={styles.name_and_users}>
        <span className='chat-name'>Bananinha</span>
        <span className='chat-last-online'>Online</span>
      </div>
      <div className={styles.search_and_more}>
        <button type='button'><MdSearch size={23} color="#919191"/></button>
        <button type='button'><MdMoreVert size={23} color="#919191"/></button>
      </div>
    </header>
  )
}