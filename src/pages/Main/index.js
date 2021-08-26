import { useEffect } from 'react'
import { Chat } from '../../components/Chat/index.js'
import { SideBar } from '../../components/SideBar'
import { useStatus } from '../../contexts/StatusContext.js'
import { useUsers } from '../../contexts/UsersContext.js'
import '../../services/socket.js'
import { Status } from '../Status/index.js'
import styles from './styles.module.scss'

export function Main(){
  const { selectedRoom, handleFetchRooms } = useUsers()
  const { isStatusOpen } = useStatus()

  useEffect(() => {
    (async function(){
      await handleFetchRooms()
    })()
  },[handleFetchRooms])

  return(
    <div className={styles.main}>
      {isStatusOpen && <Status/>}
      <aside>
        <SideBar/>
      </aside>

      <main>
        {selectedRoom && <Chat/>}
      </main>
    </div>
  )
}