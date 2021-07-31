import { useState, useContext } from "react";
import { createContext } from "react";

import { getToken, login } from "../utils/handleToken";
import { parseJwt } from "../utils/parseJWT.js";

import api from "../services/api";
import { useEffect } from "react";

const AuthContext = createContext({})

export function AuthProvider({ children }){
  const [ isAuthenticated, setIsAuthenticated ] = useState({})
  const [ tokenJWT, setTokenJWT ] = useState({})

  useEffect(() => {
    const myToken = getToken()
    if(myToken){
      setTokenJWT(parseJwt(myToken))
    }
  },[])

  async function SignIn(email, password){
    const { data } = await api.post('/users/authenticate', 
      { email, password })
    
    login(data.token)
    setIsAuthenticated(true)

    api.interceptors.request.use(config => {
      config.headers.authorization = `Bearer ${data.token}`
      return config
    })

    return data
  }
  async function SignUp(name, email, password){
    const { data } = await api.post('/users/register', 
      { name, email, password })
    
    login(data.token)
    setIsAuthenticated(true)

    api.interceptors.request.use(config => {
      config.headers.authorization = `Bearer ${data.token}`
      return config
    })

    return data
  }

  return(
    <AuthContext.Provider
      value={{
        SignIn,
        SignUp,
        isAuthenticated,
        tokenJWT
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(){
  return useContext(AuthContext)
}