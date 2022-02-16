import { createContext, useContext, useState, useEffect, ReactNode, useMemo } from "react";
import api from '../services/api'
import { IStatus } from "../types/IStatus";

type StatusContextProps = {
  myStatus: any,
  isStatusOpen: any,
  actions: any,
  selectedStatus: any,
  viewedStatus: any,
  recentStatus: any,
  index: any
}

const StatusContext = createContext({} as StatusContextProps);

type IState = {
  myStatus: any[],
  recentStatus: any[],
  viewedStatus: any[],
  selectedStatus: any | null
}

const initialState: IState = {
  myStatus: [],
  recentStatus: [],
  viewedStatus: [],
  selectedStatus: null
}

export function StatusProvider({ children }: { children: ReactNode }) {
  const [ state, setState ] = useState(initialState);
  const [ isStatusOpen, setIsStatusOpen ] = useState(false);
  const [ selectedStatus, setSelectedStatus ] = useState(null);
  const [ index, setIndex ] = useState(0);

  const actions = useMemo(() => ({
    setMyStatus: (myStatus: IStatus[]) => {
      setState(prev => {
        prev.myStatus = myStatus;
        return prev;
      })
    },
    setRecentStatus: (recentStatus: IStatus) => {
      setState(prev => {
        prev.recentStatus = [ recentStatus, ...prev.recentStatus];
        return prev; 
      })
    },
    setViewedStatus: (viewedStatus: IStatus) => {
      setState(prev => {
        prev.viewedStatus = [ viewedStatus, ...prev.viewedStatus];
        return prev; 
      })
    },
    openStatusPage: () => {
      setIsStatusOpen(true);
      setState(prev => {
        prev.selectedStatus = null;
        return prev;
      })
    },
    selectStatus: (status: any) => {

    },
    hanleIndex: (command: "next" | "prev") => {
      if(!state.selectedStatus) return;
      if(command === "next" ){
        if(index >= state.selectedStatus.status.length - 1)
          setIndex(0); 
        else
          setIndex(prevState => prevState + 1);
      } else {
        if(index <= 0)
          setIndex(state.selectedStatus.status.length - 1);
        else
          setIndex(prevState => prevState - 1);
      }
    }
  }),[])

  useEffect(() => {
    api.get('/status/list')
      .then(({ data: statusFetch }) => {
        statusFetch.forEach((item_data: any) => {
          if(item_data.status.indexOf((item:any) => item.viewed) === -1)
            actions.setRecentStatus(item_data);
          else
            actions.setViewedStatus(item_data);
        })
      });

    api.get('/status/my-list')
      .then(({ data: myStatusFetch }) => actions.setMyStatus(myStatusFetch.data));
  },[])

  return(
    <StatusContext.Provider
      value={{
        myStatus: state.myStatus,
        isStatusOpen,
        actions,
        selectedStatus: state.selectedStatus,
        viewedStatus: state.viewedStatus,
        recentStatus: state.recentStatus,
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