import { useEffect, useLayoutEffect, useRef } from 'react'
// import { FaAngleDown } from 'react-icons/fa'

import { UserOne } from './UserOne'
import { UserTwo } from './UserTwo'

import styles from './styles.module.scss'
import api from '../../../services/api'
import { useAuth } from '../../../contexts/AuthContext'
import { useRooms } from '../../../contexts/RoomsContext'
import { Loading } from './Loading'

export function MessagesContainer(){
  const container = useRef<HTMLDivElement>(null);
  const scrollMessage = useRef<HTMLDivElement>(null);
  const { selectedRoom, roomActions, isFocused } = useRooms();
  const { myId } = useAuth();

  const scrollToDown = () => {
    if(scrollMessage.current)
      scrollMessage.current.scrollIntoView();
  }

  useLayoutEffect(() => {
    // if(container.current.scrollBottom === 0)
      scrollToDown()
  }, [ selectedRoom?.messages ])

  useEffect(() => {
    if(!container.current) return;
    
    const controller = new AbortController();
    container.current.onscroll = async () => {
      if(selectedRoom?.hasAllMessages)
        return controller.abort();

      if(container.current && container.current.scrollTop === 0) {
        if(selectedRoom?.messages && selectedRoom?.messages.length > 9) {
          const last_message = selectedRoom?.messages[0]._id;
          const { data } = await api.get(
            `/room/messages/list/${selectedRoom._id}?last_message=${last_message}`
          );
          if(data.length !== 0) 
            roomActions.addPrevMessages(data);
        }
      }
    }
  },[roomActions, selectedRoom])
  
  return(
    <div className={`${styles.container} ${!isFocused && styles.blur}`} ref={container}>
      { !selectedRoom?.hasMessages && <Loading/> }
      { selectedRoom?.messages.map(message => 
        myId !== message.user ? 
          <UserTwo message={message} key={message._id}/>
        : 
          <UserOne message={message} key={message._id}/>
      )}

      <div ref={scrollMessage}/>
      <button type='button' onClick={scrollToDown} className={styles.go_to_down}> 
        {/* <FaAngleDown size={15} color="#919191"/>  */}
      </button>
    </div>
  )
}