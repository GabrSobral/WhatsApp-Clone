import { useEffect, useRef } from 'react'
import { FaAngleDown } from 'react-icons/fa'

import { useUsers } from '../../../contexts/UsersContext'
import { useAuth } from '../../../contexts/AuthContext'

import { UserOne } from './UserOne'

import styles from './styles.module.scss'
import { UserTwo } from './UserTwo'

export function MessagesContainer(){
  const container = useRef()
  const { selectedRoom, rooms } = useUsers()
  const { tokenJWT } = useAuth()

  function scrollToDown(){ container.current.scrollTo(0, 99999) }

  useEffect(() => { scrollToDown() },[ selectedRoom, rooms ])
  
  return(
    <div className={styles.container} ref={container}>
      {selectedRoom.messages.map(message => (
        tokenJWT.id !== message.user ? (
          <UserTwo message={message} key={message._id}/>
        ) : (
          <UserOne message={message} key={message._id}/>
        )
      ))}

      <div></div>
      <button 
        type='button'
        onClick={scrollToDown}
        className={styles.go_to_down}
      > 
        <FaAngleDown size={15} color="#919191"/> 
      </button>
    </div>
  )
}