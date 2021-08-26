import { createContext, useContext, useState } from "react";

const StatusContext = createContext(null)

export function StatusProvider({ children }) {
  const [ isStatusOpen, setIsStatusOpen ] = useState(false)

  function handleStatusOpen(){ setIsStatusOpen(!isStatusOpen) }

  return(
    <StatusContext.Provider
      value={{
        isStatusOpen,
        handleStatusOpen
      }}
    >
      {children}
    </StatusContext.Provider>
  )
}

export function useStatus(){
  return useContext(StatusContext)
}