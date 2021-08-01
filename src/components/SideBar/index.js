import { useState } from 'react'

import { Header } from './Header'
import { SearchBar } from './SearchBar'
import { UserItem } from './UserItem'

import styles from './styles.module.scss'
import { useUsers } from '../../contexts/UsersContext'

export function SideBar(){
  const { rooms } = useUsers()
  const [ search, setSearch ] = useState('')

  function handleSetSearch(value){ setSearch(value) }

  return(
    <div className={styles.container}>
			<Header/>
		  <SearchBar
        value={search}
        setSearch={handleSetSearch}
      />
			<div className={styles.chats}>
        { rooms.map((room) => (
          <UserItem
            key={room._id}
            room={room}
            // handleSelectRoom={handleSelectRoom}
          />
        ))}
			</div>
		</div>
  )
}