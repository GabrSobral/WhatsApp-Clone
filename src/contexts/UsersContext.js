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

	const handleReceiveMessage = useCallback(() => {
		socket.on('newMessage', ({ messageData, unreadMessages }) => {
			if(parseJwt(getToken()).id === messageData.user){ return }

			setRooms((prevState) => (
				prevState.map(item => {		
					if(item._id === messageData.assignedTo){

						if(unreadMessages.to === item._id){
							if(!selectedRoom || selectedRoom._id !== messageData.assignedTo){
								console.log(`passou ${selectedRoom?._id} e ${messageData.assignedTo}`)
								if(unreadMessages.user !== parseJwt(getToken()).id){
									item.unreadMessages++
								}
							} else {
								socket.emit('viewUnreadMessages', 
								{ user: parseJwt(getToken()).id, room: item._id })
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
	},[selectedRoom])

	useEffect(() => {
		handleReceiveMessage()
	},[handleReceiveMessage])

	useEffect(() => {
		socket.on('receiveWritting', ({ writting, room, to }) => {
			if(to !== parseJwt(getToken()).id){ return }
			setRooms((prevState) => (
				prevState.map(item => {		
					if(item._id === room){
						item.isWritting = writting
					}
					return item
				})
			))
		})
	},[])

	useEffect(() => { console.log("Rooms", rooms) }, [ rooms ])
	useEffect(() => { console.log("SelectedRoom", selectedRoom) }, [ selectedRoom ])

	const handleFetchRooms = useCallback(() => {
		(async function(){
			const { data } = await api.get('room/list')
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
		if(room._id === selectedRoom?._id){ return }

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