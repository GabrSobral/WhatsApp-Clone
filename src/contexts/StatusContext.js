import { createContext, useContext, useState } from "react";

const StatusContext = createContext(null)

export function StatusProvider({ children }) {
  const [ isStatusOpen, setIsStatusOpen ] = useState(false)
  const [ selectedStatus, setSelectedStatus ] = useState()

  function handleStatusOpen(){ setIsStatusOpen(!isStatusOpen); setSelectedStatus(null) }
  function handleSelectStatus(status){ setSelectedStatus(status) }

  return(
    <StatusContext.Provider
      value={{
        isStatusOpen,
        handleStatusOpen,
        selectedStatus,
        handleSelectStatus
      }}
    >
      {children}
    </StatusContext.Provider>
  )
}

export function useStatus(){
  return useContext(StatusContext)
}