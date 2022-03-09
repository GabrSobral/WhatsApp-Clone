import { useState, useContext, createContext, useEffect, ReactNode } from "react";

import { db, IMeSchema } from "../services/DBConfig";
import { useLiveQuery } from "dexie-react-hooks";

type AuthContextProps = {
  signUp: (phoneNumber: string, name: string) => Promise<void>;
  user: IMeSchema | null;
}

const AuthContext = createContext({} as AuthContextProps);

export const AuthProvider = ({ children }:{ children: ReactNode}) => {
  const myData = useLiveQuery(() => db.me.toArray());
  const [ user, setUser ] = useState<IMeSchema | null>(null);

  useEffect(() => {
    if(myData && myData[0]) setUser(myData[0]);
  },[myData]);

  const signUp = async (phoneNumber: string, name: string) => {
    const data: IMeSchema = { 
      wa_name: name, 
      number: phoneNumber, 
      jid: `${phoneNumber}@whatsapp.clone`
    };
    await db.me.add(data);  // DATABASE TRANSACTION
    setUser(data);          // SET USER TO APPLICATION STATE
  }

  return(
    <AuthContext.Provider value={{ signUp, user }} >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext);