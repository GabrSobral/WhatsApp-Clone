import { useEffect } from 'react'
import { Chat } from '../../components/Chat/index.js'
import { SideBar } from '../../components/SideBar'
import { useUsers } from '../../contexts/UsersContext.js'
import '../../services/socket.js'
import styles from './styles.module.scss'

export function Main(){
  const { selectedRoom, handleFetchRooms } = useUsers()

  useEffect(() => {
    (async function(){
      await handleFetchRooms()
    })()
  },[handleFetchRooms])

  return(
    <div className={styles.main}>
      <aside>
        <SideBar/>
      </aside>

      <main>
        {selectedRoom && <Chat/>}
      </main>
    </div>
  )
}