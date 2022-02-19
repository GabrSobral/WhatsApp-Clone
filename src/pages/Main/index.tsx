import { useEffect } from 'react'
import { Chat } from '../../components/Chat/index'
import { SideBar } from '../../components/SideBar'
import { useRooms } from '../../contexts/RoomsContext/index.jsx'

import styles from './styles.module.scss'

export function Main(){
  const { selectedRoom, handleFetchRooms } = useRooms()

  useEffect(() => handleFetchRooms() ,[handleFetchRooms])

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