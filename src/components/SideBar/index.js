import { useState, useEffect, useRef } from 'react'
import { FiPlus } from 'react-icons/fi'
import { Slide } from '../Slide'

import { Header } from './Header'
import { NewContact } from './NewContact'
import { RoomsList } from './RoomsList'

import styles from './styles.module.scss'

export function SideBar(){
  const [ showNewContact, setShowNewContact ] = useState(false)
  const sideBarRef = useRef(null)

  useEffect(() => {
    document.addEventListener('click', (event) => {
      if(!event.target || !sideBarRef.current) return;
      
      const isClickInside = sideBarRef.current.contains(event.target)
      if(!isClickInside)
        setShowNewContact(false)
    });
  },[])

  return(
    <div className={styles.container} ref={sideBarRef}>
			<Header/>
      <RoomsList/>

      <Slide show={showNewContact}>
        <NewContact/> 
      </Slide>

      <button 
        onClick={() => setShowNewContact(prevState => !prevState)} 
        className={styles.add_contact}
        title="Add new contact"
      >
        <FiPlus size={32} stroke="#ffffff" />
      </button>
		</div>
  )
}