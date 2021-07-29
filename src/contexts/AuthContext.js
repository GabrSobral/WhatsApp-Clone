import { useState } from "react";
import { createContext } from "react";
import { useContext } from "react/cjs/react.production.min";
import api from "../services/api";
import { login } from "../utils/handleToken";

const AuthContext = createContext({})

export function AuthProvider({ children }){
  const [ isAuthenticated, setIsAuthenticated ] = useState({})

  async function SignIn(email, password){
    const { data } = await api.post('/users/login', 
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