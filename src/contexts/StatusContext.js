import { createContext, useContext, useState, useEffect } from "react";
import api from '../services/api'

const StatusContext = createContext(null)

export function StatusProvider({ children }) {
  const [ myStatus, setMyStatus ] = useState([])
  const [ recentStatus, setRecentStatus ] = useState([])
  const [ viewedStatus, setViewedStatus ] = useState([])
  const [ isStatusOpen, setIsStatusOpen ] = useState(false)
  const [ selectedStatus, setSelectedStatus ] = useState()
  const [ index, setIndex ] = useState(0)

  useEffect(() => {
    (async () => {
      const statusFetch = await api.get('/status/list')
      const myStatusFetch = await api.get('/status/my-list')
      setMyStatus(myStatusFetch.data)

      statusFetch.data.forEach(item_data => {
        if(item_data.status.indexOf(item => item.viewed) === -1) {
          setRecentStatus(prevState => [ item_data, ...prevState])
        } else {
          setViewedStatus(prevState => [ item_data, ...prevState])
        }
      })
    })()
  },[])

  function handleStatusOpen(){ 
    setIsStatusOpen(!isStatusOpen); 
    setSelectedStatus(null) 
  }
  function handleSelectStatus(status){
    if(status){ status.status[index].viewed = true }
    setSelectedStatus(status) 
    setIndex(0)
  }

  function handleIndex(command){
    if(command === "next"){
      if(index >= selectedStatus.status.length - 1) { setIndex(0) } 
      else{ setIndex(prevState => prevState + 1) }

    } else {

      if(index <= 0){ setIndex(selectedStatus.status.length - 1) }
      else{ setIndex(prevState => prevState - 1) }
    }
  }

  return(
    <StatusContext.Provider
      value={{
        isStatusOpen,
        handleStatusOpen,
        selectedStatus,
        handleSelectStatus,
        myStatus,
        viewedStatus,
        recentStatus,
        handleIndex,
        index
      }}
    >
      {children}
    </StatusContext.Provider>
  )
}

export function useStatus(){
  return useContext(StatusContext)
}