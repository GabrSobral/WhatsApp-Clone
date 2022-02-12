import { useState } from 'react'
import { useRooms } from '../../../contexts/RoomsContext'
import { SearchBar } from '../SearchBar'
import { UserItem } from '../UserItem'
import styles from './styles.module.scss'

export function RoomsList(){
  const { rooms } = useRooms()
  const [ search, setSearch ] = useState('')

  return(
    <div className={styles.chats}>
      <SearchBar
        value={search}
        setSearch={(value) => setSearch(value)}
        placeholder="Search your contacts"
      />
      { rooms.map((room, index) => 
        <UserItem key={room._id} room={room} index={index}/> )}
    </div>
  )
}