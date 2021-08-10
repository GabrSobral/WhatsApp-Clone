import { useState } from 'react'
import { useUsers } from '../../../contexts/UsersContext'
import { SearchBar } from '../SearchBar'
import { UserItem } from '../UserItem'
import styles from './styles.module.scss'

export function RoomsList(){
  const { rooms, handleSelectRoom } = useUsers()
  const [ search, setSearch ] = useState('')

  function handleSetSearch(value){ setSearch(value) }
  
  return(
    <div className={styles.chats}>
      <SearchBar
        value={search}
        setSearch={handleSetSearch}
        placeholder="Search your contacts"
      />
      { rooms.map((room) => (
        <UserItem
          key={room._id}
          room={room}
          handleSelectRoom={handleSelectRoom}
        />
      ))}
    </div>
  )
}