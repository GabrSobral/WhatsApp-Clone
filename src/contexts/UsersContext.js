import React, { useState, useContext, createContext, useEffect } from 'react'

import { parseJwt } from '../utils/parseJWT';
import { getToken } from '../utils/handleToken';

import api from '../services/api.js'
import { socket } from "../services/socket";
import { useCallback } from 'react';

const UsersContext = createContext('')

export function UsersProvider({ children }) { 
	const [ rooms, setRooms ] = useState([])
	const [ selectedRoom, setSelectedRoom ] = useState()

	useEffect(() => {
		socket.on('newMessage', ({ messageData, unreadMessages }) => {
			if(parseJwt(getToken()).id === messageData.user){
				return
			}
			setRooms((prevState) => (
				prevState.map(item => {					
					if(item._id === messageData.assignedTo){
						console.log(selectedRoom, item)
							if(unreadMessages.to === item._id){
								if(unreadMessages.user !== parseJwt(getToken()).id){
									item.unreadMessages += 1
								}
							}

						item.messages.push(messageData)
						if( item.messages[item.messages.length -1] === 
								item.messages[item.messages.length -2] ){
									item.messages.pop()
						}
					}
					return item
				})
			))
		})

		return () => socket.removeAllListeners()
	// eslint-disable-next-line react-hooks/exhaustive-deps
	},[])

	useEffect(() => { console.log("Rooms", rooms) }, [ rooms ])

	const handleFetchRooms = useCallback(() => {
		(async function(){
			const { data } = await api.get('room/list')
			console.log(data)
			const { id } = parseJwt(getToken())
			setRooms(data)
	
			const myRooms = data.map(item => item.user[0]._id)
			socket.emit('joinroom', {rooms: [...myRooms, id]})
		})()
	},[]) 

	function handleAddMessageToRoom(message){
		setRooms(prevState => prevState.map(item => {
			if(item._id === message.assignedTo){
				item.messages.push(message)
				if(item.messages[item.messages.length -1] === 
					 item.messages[item.messages.length -2]){
						item.messages.pop()
				}
			}
			return item
		}))
	}

	async function handleSelectRoom(room){ 
		if(room._id === selectedRoom?._id){return}

		if(room.unreadMessages !== 0){
			socket.emit('viewUnreadMessages', 
			{ user: parseJwt(getToken()).id, room: room._id })

			room.unreadMessages = 0
		}
		
		if(room.hasMessages){ 
			setSelectedRoom(room)
			return 
		} else {
			const { data } = await api.get(`room/messages/list/${room._id}`)
			data.splice((data.length - room.messages.length - 1), data.length - 1)
			room.messages = data.concat(room.messages)
			room.hasMessages = true
			setSelectedRoom(room)
		}	
  }

	return(
		<UsersContext.Provider 
			value={{
				rooms,
				setSelectedRoom,
				selectedRoom,
				handleAddMessageToRoom,
				handleSelectRoom,
				handleFetchRooms
			}}
		>
			{children} 
		</UsersContext.Provider>
	)
}

export function useUsers() {
	return useContext(UsersContext)
}