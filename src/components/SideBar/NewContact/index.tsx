import { FormEvent, useEffect, useState } from 'react'
// import { FaWhatsapp } from 'react-icons/fa'

import api from '../../../services/api.js'
import { SignInput } from '../../SignInput'
// import { SignButton } from '../../SignButton'

import { NewUserItem } from './NewUserItem'
import styles from './styles.module.scss'
import { useRooms } from '../../../contexts/RoomsContext'
import { useAuth } from '../../../contexts/AuthContext.jsx'
import { IUser } from '../../../types/IUser.js'

export function NewContact(){
  const { handleAddNewRoom } = useRooms()
  const { myId } = useAuth()
  const [ phoneNumber, setPhoneNumber ] = useState('')
  const [ message, setMessage ] = useState('')
  const [ newUsers, setNewUsers ] = useState<IUser[]>([])
  const [ isLoading, setIsLoading ] = useState(false)
  const [ isSearched, setIsSearched ] = useState(false)

  useEffect(() => {
    if(!phoneNumber) {
      setNewUsers([]);
      setIsSearched(false)
    }
  },[phoneNumber])

  useEffect(() => {
    isSearched ? 
      setMessage(`Oops.. No user was found with this phone number, try to invite your friends to use this app!`) : 
      setMessage(`Search for new users to start to talk!`);
  },[ isSearched ])

  async function handleFetchNewUsers(event: FormEvent){
    event.preventDefault();
    setIsLoading(true);
    const { data } = await api.post<IUser[]>("/users/show", { phoneNumber });
    
    if(data[0]._id !== myId)
      setNewUsers(data);

    setIsLoading(false);
    setIsSearched(true);
  }

  async function handleCreateNewRoom(user_id: string){
    try{
      const { data } = await api.post(`/room/new/${user_id}`);
      handleAddNewRoom(data);
    } catch(error: any){
      if(error.response.data.error === "Room already exists") {
        setMessage('You already added this user!');
        setNewUsers([]);
        return;
      }
      setMessage(error.response.data.error);
      setNewUsers([]);
    }
  }

  return(
    <div className={styles.container}>
      <h2>Search for new users</h2>
      <form onSubmit={handleFetchNewUsers}>
        <SignInput
          data={phoneNumber}
          setData={(value: string) => setPhoneNumber(value)}
          type="number"
          title="Write the new user phone number"
          bgColor="#FFFFFF"
        />
{/* 
        <SignButton
          isFilled={!!phoneNumber}
          isLoading={isLoading}
          showIcon={false}
          title="Search"
          style={{ height: '50px' }}
        /> */}
      </form>
     
      <div className={styles.new_users_list}>
          { newUsers.length !== 0 ? newUsers.map(item =>
            <NewUserItem
              key={item._id}
              name={item.name}
              phoneNumber={item.phoneNumber}
              last_seen={item.lastOnline}
              isOnline={item.isOnline}
              onClick={async () => await handleCreateNewRoom(item._id)}
            />
          ) : (
            <div className={styles.not_user_found}>
              {/* <FaWhatsapp size="6rem" fill="#d5d5d5"/> */}
              <span>{message}</span>
            </div>
          )}
      </div>
    </div>
  )
}