import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import io, { Socket } from "socket.io-client";

type SocketContextProps = {
  socket: Socket;
}

const SocketContext = createContext({} as SocketContextProps);

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const [ socket, setSocket ] = useState<Socket>();

  useEffect(() => {
    const uri = import.meta.env.VITE_API_URL?.toString() || "";

    const instance = io(uri, { 
      transports: ["websocket"],
      timeout: 10000 ,
      reconnectionAttempts: 9999,
      forceNew: true,
      reconnectionDelay: 5000
    });

    setSocket(instance);

    return () => { instance.close(); };
  },[]);

  useEffect(() => {
    Notification.requestPermission();
  },[])

  return socket ?
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
    :
    <h2>Not Connected</h2>
}

export const useSocket = () => useContext(SocketContext);