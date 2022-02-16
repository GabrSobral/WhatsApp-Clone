import { useEffect } from 'react'
import { Chat } from '../../components/Chat/index'
import { SideBar } from '../../components/SideBar'
import { useRooms } from '../../contexts/RoomsContext/index.jsx'
import { useStatus } from '../../contexts/StatusContext.jsx'
import { Status } from '../Status/index'

import styles from './styles.module.scss'
import '../../services/socket.js'

export function Main(){
  const { selectedRoom, handleFetchRooms } = useRooms()
  // const { isStatusOpen } = useStatus()

  useEffect(() => handleFetchRooms() ,[handleFetchRooms])

  return(
    <div className={styles.main}>
      {/* {isStatusOpen && <Status/>} */}
      <aside>
        <SideBar/>
      </aside>

      <main>
        {selectedRoom && <Chat/>}
      </main>
    </div>
  )
}