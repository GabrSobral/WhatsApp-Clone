import { useState, useContext, createContext } from "react";
import { useHistory } from "react-router-dom";

import { getToken, login, logout } from "../utils/handleToken";
import { parseJwt } from "../utils/parseJWT.js";

import api from "../services/api";
import { useEffect } from "react";
import { socket } from "../services/socket";

const AuthContext = createContext({})

export function AuthProvider({ children }){
  const [ isAuthenticated, setIsAuthenticated ] = useState({})
  const [ tokenJWT, setTokenJWT ] = useState({})
  const { push } = useHistory()

  useEffect(() => {
    const myToken = getToken()
    if(myToken){
      setIsAuthenticated(true)
      setTokenJWT(parseJwt(myToken))
    }
  },[])

  async function SignIn(email, password){
    const { data } = await api.post('/users/authenticate', 
      { email, password })
    
    login(data.token)
    setIsAuthenticated(true)

    api.interceptors.request.use(config => {
      if(!config.headers.Authorization){
        config.headers.Authorization = `Bearer ${data.token}`
      }
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
  async function Logout(){
		await api.patch('/users/logout')
    socket.emit('imOnline', { 
      user: parseJwt(getToken()).id, 
      status: false, 
    })
    logout()
    push('/SignIn')
	}

  return(
    <AuthContext.Provider
      value={{
        SignIn,
        SignUp,
        isAuthenticated,
        tokenJWT,
        Logout
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(){
  return useContext(AuthContext)
}