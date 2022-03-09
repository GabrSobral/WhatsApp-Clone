import { FormEvent, useState } from 'react'

import { SignInput } from '../../SignInput'
import { ConfirmButton } from '../../ConfirmButton/index'

import { db, IContactsSchema } from '../../../services/DBConfig'

import styles from './styles.module.scss'
import { useContact } from '../../../contexts/ContactContext'

type NewContactProps = {
  close: () => void;
}

export function NewContact({ close }: NewContactProps){
  const { addNewContact } = useContact();
  const [ phoneNumber, setPhoneNumber ] = useState('');
  const [ contactName, setContactName ] = useState('');
  const [ isLoading, setIsLoading ] = useState(false)

  async function AddContact(event: FormEvent){
    event.preventDefault();

    const data: IContactsSchema = {
      display_name: contactName,
      jid: `${phoneNumber}@whatsapp.clone`,
      number: phoneNumber,
    };

    setIsLoading(true);
    // fetch new user data
    const id = await db.contacts.add(data);
    addNewContact({ id: Number(id), ...data });
    close();
  }

  return(
    <div className={styles.container}>
      <h2>Add new user</h2>
      <form onSubmit={AddContact}>
        <SignInput
          data={phoneNumber} bgColor="#FFFFFF"
          type="number"title="Write the new user phone number"
          setData={(value: string) => setPhoneNumber(value)}
        />
        <SignInput
          data={contactName} bgColor="#FFFFFF"
          type="text" title="Write the contact name"
          setData={(value: string) => setContactName(value)}
        />

        <ConfirmButton type="submit" isLoading={isLoading} text="Add"/>
      </form>
    </div>
  )
}