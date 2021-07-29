import { useState } from 'react'
import io from "socket.io-client";

import { Header } from './Header'
import { SearchBar } from './SearchBar'
import { UserItem } from './UserItem'

import styles from './styles.module.scss'

const connectionOptions =  {
	"force new connection" : true,
	"reconnectionAttempts": "Infinity", 
	"timeout" : 10000,                  
	"transports" : ["websocket"]
  };
export const socket = io.connect('http://localhost:3333', connectionOptions);

// socket.on("newUser", (user) => {
// setUsers([...users, user])
// });
// socket.on('deleteUser', (user) => {
// api.get('/users/list').then(response => {
//   setUsers(response.data)
// })
// })

export function SideBar(){
  
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
        <UserItem/>
        <UserItem/>
        <UserItem/>
        <UserItem/>
        <UserItem/>
        <UserItem/>
			</div>
		</div>
  )
}