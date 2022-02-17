import { useState, useContext, createContext, useEffect, ReactNode } from "react";
import { AxiosRequestConfig, AxiosError } from "axios";

import { getToken, setToken } from "../utils/handleToken";
import { parseJwt } from "../utils/parseJWT.js";

import api from "../services/api";
import { IUser } from "../types/IUser";

type AuthContextProps = {
  signInOrSignUp: (phoneNumber: string, name?: string) => Promise<IAuthResponse>;
  myId: string;
}

type IAuthResponse = {
  user: IUser;
  token: string;
}

const AuthContext = createContext({} as AuthContextProps);

export const AuthProvider = ({ children }:{ children: ReactNode}) => {
  const [ myId, setMyId ] = useState('');

  useEffect(() => {
    const myToken = getToken();
    if(myToken)
      setMyId(parseJwt(myToken).id);
  },[]);

  const signInOrSignUp = (phoneNumber: string, name?: string): Promise<IAuthResponse> => {
    const url = typeof name === "string" ? '/users/register' : '/users/authenticate';
    return new Promise((resolve, reject) => {
      api.post<IAuthResponse>(url, { phoneNumber, name })
      .then(({ data }) => {
        setToken(data.token);
        setMyId(parseJwt(data.token).id);
        
        api.interceptors.request.use((config: AxiosRequestConfig) => {
          if(config.headers)
          config.headers.Authorization = `Bearer ${data.token}`;
          return config;
        });
        resolve(data);
      })
      .catch((error: AxiosError) => reject(error.response?.data.error))
    });
  }

  return(
    <AuthContext.Provider value={{ signInOrSignUp, myId }} >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext);