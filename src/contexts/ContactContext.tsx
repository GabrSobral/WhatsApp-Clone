import { useState, useContext, createContext, useEffect, ReactNode } from "react";

import { db, IContactsSchema } from "../services/DBConfig";
import { useLiveQuery } from "dexie-react-hooks";

type ContactContextProps = {
  addNewContact: (newContact: IContactsSchema) => Promise<void>;
  contacts: IContactsSchema[];
}

const ContactContext = createContext({} as ContactContextProps);

export const ContactProvider = ({ children }:{ children: ReactNode}) => {
  const [ contacts, setContacts ] = useState<IContactsSchema[]>([]);
  const contactsData = useLiveQuery(async () => await db.contacts.toArray());

  useEffect(() => {
    if(contactsData) setContacts(contactsData);
  },[contactsData]);

  const addNewContact = async (newContact: IContactsSchema) => {
    await db.contacts.add(newContact);
    contacts.push(newContact)
    setContacts(contacts);
  }

  return(
    <ContactContext.Provider value={{ addNewContact, contacts }} >
      {children}
    </ContactContext.Provider>
  )
}

export const useContact = () => useContext(ContactContext);