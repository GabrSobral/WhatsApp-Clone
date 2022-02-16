import { useState, useContext, createContext, useEffect, ReactNode } from "react";

import { getToken, login } from "../utils/handleToken";
import { parseJwt } from "../utils/parseJWT.js";

import api from "../services/api";
import { AxiosRequestConfig } from "axios";

type AuthContextProps = {
  signInOrSignUp: (phoneNumber: string, name?: string) => Promise<any>;
  myId: string;
}

const AuthContext = createContext({} as AuthContextProps);

export const AuthProvider = ({ children }:{ children: ReactNode}) => {
  const [ myId, setMyId ] = useState('');

  useEffect(() => {
    const myToken = getToken();
    if(myToken)
      setMyId(parseJwt(myToken).id);
  },[]);

  async function signInOrSignUp(phoneNumber: string, name?: string){
    const url = name ? '/users/register' : '/users/authenticate';
    const { data } = await api.post(url, { phoneNumber, name });
    
    login(data.token);
    setMyId(parseJwt(data.token).id);

    api.interceptors.request.use((config: AxiosRequestConfig) => {
      if(config.headers)
        config.headers.Authorization = `Bearer ${data.token}`;
      return config;
    })
    return data;
  }

  return(
    <AuthContext.Provider
      value={{
        signInOrSignUp,
        myId
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext);