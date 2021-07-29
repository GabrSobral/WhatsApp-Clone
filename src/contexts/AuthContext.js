import { useState, useContext } from "react";
import { createContext } from "react";
import { login } from "../utils/handleToken";
import api from "../services/api";

const AuthContext = createContext({})

export function AuthProvider({ children }){
  const [ isAuthenticated, setIsAuthenticated ] = useState({})

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

  return(
    <AuthContext.Provider
      value={{
        SignIn,
        isAuthenticated
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(){
  return useContext(AuthContext)
}