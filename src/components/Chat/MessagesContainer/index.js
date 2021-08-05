import { useEffect, useRef, useState } from 'react'
import { FaAngleDown } from 'react-icons/fa'

import { useUsers } from '../../../contexts/UsersContext'

import { UserOne } from './UserOne'
import { UserTwo } from './UserTwo'

import styles from './styles.module.scss'
import { parseJwt } from '../../../utils/parseJWT'
import { getToken } from '../../../utils/handleToken'

export function MessagesContainer(){
  const container = useRef()
  const { selectedRoom, rooms } = useUsers()
  const [ myId, setMyId ] = useState('')

  useEffect(() => {
    setMyId(parseJwt(getToken()).id)
  },[])

  function scrollToDown(){ container.current.scrollTo(0, 99999) }

  useEffect(() => { scrollToDown() },[ selectedRoom, rooms ])
  
  return(
    <div className={styles.container} ref={container}>
      {selectedRoom.messages.map(message => (
        myId !== message.user ? (
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