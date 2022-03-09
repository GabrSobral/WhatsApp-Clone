import { useState } from 'react'
import { useContact } from '../../../contexts/ContactContext'
import { SearchBar } from '../SearchBar'
import { UserItem } from '../UserItem'
import styles from './styles.module.scss'

export function RoomsList(){
  const { contacts } = useContact()
  const [ search, setSearch ] = useState('')

  return(
    <div className={styles.chats}>
      <SearchBar
        value={search}
        setSearch={(value) => setSearch(value)}
        placeholder="Search your contacts"
      />
      { contacts.map((contact, index) => 
        <UserItem key={contact.id} contact={contact} index={index}/> )}
    </div>
  )
}