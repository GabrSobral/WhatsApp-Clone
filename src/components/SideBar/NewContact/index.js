import { useState } from 'react'
import { FaWhatsapp } from 'react-icons/fa'

import api from '../../../services/api.js'
import { SignInput } from '../../SignInput'
import { SignButton } from '../../SignButton'

import { NewUserItem } from './NewUserItem'
import styles from './styles.module.scss'

export function NewContact(){
  const [ username, setUsername ] = useState('')
  const [ newUsers, setNewUsers ] = useState([])
  const [ isLoading, setIsLoading ] = useState(false)

  function handleSetUsername(value){ setUsername(value) }

  async function handleFetchNewUsers(event){
    event.preventDefault()
    setIsLoading(true)
    const { data } = await api.get(``)
    setNewUsers(data)
    setIsLoading(false)
  }

  return(
    <div className={styles.container}>
      <h2>Search for new users</h2>
      <form onSubmit={handleFetchNewUsers}>
        <SignInput
          data={username}
          setData={handleSetUsername}
          title="Write the new user email"
          bgColor="#FFFFFF"
        />

        <SignButton
          isFilled={!!username}
          isLoading={isLoading}
          showIcon={false}
          title="Search"
          style={{ height: '50px' }}
        />
      </form>
     

     <div className={styles.new_users_list}>

       { newUsers.length !== 0 ? newUsers.map(item => (
         <NewUserItem/>
       )) : (
         <div className={styles.not_user_found}>
           <FaWhatsapp size="6rem" fill="#d5d5d5"/>
           <span>
            Oops.. No user was found with <br/> this email, 
            try to invite your friends to <br/> use this app!
          </span>
         </div>
       )}
     </div>
    </div>
  )
}