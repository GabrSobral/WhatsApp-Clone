import React, { useState, useContext, createContext } from 'react'

const RoomContext = createContext('')

export function RoomProvider({ children }) { 
	const [ room, setRoom ] = useState('')
	return(
		<RoomContext.Provider 
		value={{
			room,
			setRoom
		}}>
			{children} 
		</RoomContext.Provider>
	)
}

export function useRoom() {
	return useContext(RoomContext)
}