import { MdMoreVert, MdPerson, MdSearch } from 'react-icons/md'

import { useAuth } from '../../../contexts/AuthContext'
import { useUsers } from '../../../contexts/UsersContext'

import api from '../../../services/api'
import { socket } from '../../../services/socket'
import { formatLastSeen } from '../../../utils/formatLastSeen'

import styles from './styles.module.scss'

export function ChatHeader(){
  const { selectedRoom, handleRemoveRoomFromScreen } = useUsers()
  const { myId } = useAuth()

  const formattedDate = selectedRoom.user[0] &&
  formatLastSeen(new Date(selectedRoom.user[0].lastOnline))

  async function handleExcludeContact(){
    await api.delete(`/room/delete/${selectedRoom._id}`)
    handleRemoveRoomFromScreen(selectedRoom)
    socket.emit('removeRoom', { user: myId, room: selectedRoom._id })
  }

  return(
    <header className={styles.container}>
      <div className={styles.img_container}>
        <MdPerson size={24} color="#919191"/>
      </div>
      <div className={styles.name_and_users}>
        <span className='chat-name'>{selectedRoom.user[0].name}</span>
        <span className='chat-last-online'>
          { selectedRoom.isWritting ? 'digitando...' : 
            selectedRoom?.user[0].isOnline ? 'online' : formattedDate }
        </span>
      </div>
      <div className={styles.search_and_more}>
        <button type='button'><MdSearch size={23} color="#919191"/></button>
        <button type='button'>
          <MdMoreVert size={23} color="#919191"/>

          <nav>
            <div onClick={handleExcludeContact}>
              Delete contact and conversation
            </div>
          </nav>
        </button>
      </div>
    </header>
  )
}