import { useEffect, useRef, useState } from 'react'
import { FaAngleDown } from 'react-icons/fa'

import { useUsers } from '../../../contexts/UsersContext'

import { UserOne } from './UserOne'
import { UserTwo } from './UserTwo'

import styles from './styles.module.scss'
import { parseJwt } from '../../../utils/parseJWT'
import { getToken } from '../../../utils/handleToken'
import api from '../../../services/api'

export function MessagesContainer(){
  const container = useRef()
  const scrollMessage = useRef()
  const { selectedRoom, handleAddPreviousMessages } = useUsers()
  const [ myId, setMyId ] = useState('')

  function scrollToDown(){ 
    scrollMessage.current.scrollIntoView({ behavior: 'smooth'}) }

  useEffect(() => { setMyId(parseJwt(getToken()).id) },[])
  useEffect(() => { scrollToDown() },[ ])

  useEffect(() => {
    const controller = new AbortController();

    container.current.onscroll = async () => {
      if(selectedRoom.hasAllMessages){ 
        controller.abort()
        return 
      }
      if(container.current.scrollTop === 0){
        if(selectedRoom.messages.length > 9){
          const last_message = selectedRoom?.messages[0]._id 
          const { data } = await api.get(
            `/room/messages/list/${selectedRoom._id}?last_message=${last_message}`
          )
          handleAddPreviousMessages(data)
        }
      }
    }
  },[handleAddPreviousMessages, selectedRoom])
  
  return(
    <div className={styles.container} ref={container}>
      {selectedRoom.messages.map(message => (
        myId !== message.user ? (
          <UserTwo message={message} key={message._id}/>
        ) : (
          <UserOne message={message} key={message._id}/>
        )
      ))}

      <div ref={scrollMessage}/>
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