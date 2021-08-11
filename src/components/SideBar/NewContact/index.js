import { useEffect, useState } from 'react'
import { FaWhatsapp } from 'react-icons/fa'

import api from '../../../services/api.js'
import { SignInput } from '../../SignInput'
import { SignButton } from '../../SignButton'

import { NewUserItem } from './NewUserItem'
import styles from './styles.module.scss'
import { useUsers } from '../../../contexts/UsersContext.js'

export function NewContact(){
  const { handleAddNewRoom } = useUsers()
  const [ username, setUsername ] = useState('')
  const [ newUsers, setNewUsers ] = useState([])
  const [ isLoading, setIsLoading ] = useState(false)
  const [ isSearched, setIsSearched ] = useState(false)

  useEffect(() => {
    if(!username){
      setNewUsers([]);
      setIsSearched(false)
    }
  },[username])

  function handleSetUsername(value){ setUsername(value) }

  async function handleFetchNewUsers(event){
    event.preventDefault()
    setIsLoading(true)
    const { data } = await api.post("/users/show", { email: username })
    setNewUsers(data)
    setIsLoading(false)
    setIsSearched(true)
  }

  async function handleCreateNewRoom(user_id){
    const { data } = await api.post(`/room/new/${user_id}`)

    handleAddNewRoom(data)    
  }

  return(
    <div className={styles.container}>
      <h2>Search for new users</h2>
      <form onSubmit={handleFetchNewUsers}>
        <SignInput
          data={username}
          setData={handleSetUsername}
          type="email"
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
          <NewUserItem
            key={item._id}
            name={item.name}
            email={item.email}
            last_seen={item.lastOnline}
            isOnline={item.isOnline}
            onClick={() => handleCreateNewRoom(item._id)}
          />
        )) : (
         <div className={styles.not_user_found}>
           <FaWhatsapp size="6rem" fill="#d5d5d5"/>
           <span>
           { isSearched ? (
              `Oops.. No user was found with this email, 
              try to invite your friends to use this app!`
           ) : (
             `Search for new users to start to talk!`
           )}
          </span>

           
         </div>
       )}
     </div>
    </div>
  )
}