import { useEffect } from 'react'
import { Chat } from '../../components/Chat/index.js'
import { SideBar } from '../../components/SideBar'
import { useRooms } from '../../contexts/RoomsContext/index.js'
import { useStatus } from '../../contexts/StatusContext.js'
import { Status } from '../Status/index.js'

import styles from './styles.module.scss'
import '../../services/socket.js'

export function Main(){
  const { selectedRoom, handleFetchRooms } = useRooms()
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