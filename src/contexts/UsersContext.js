import React, { useState, useContext, createContext, useEffect } from 'react'

import { parseJwt } from '../utils/parseJWT';
import { getToken } from '../utils/handleToken';

import api from '../services/api.js'
import { socket } from "../services/socket";

const UsersContext = createContext('')

export function UsersProvider({ children }) { 
	const [ rooms, setRooms ] = useState([])
	const [ selectedRoom, setSelectedRoom ] = useState()

	useEffect(() => {
		socket.on('newMessage', ({ messageData }) => {
			if(getToken() === messageData.user){
				return
			}
			setRooms((prevState) => {
				const newState =  prevState.map(item => {
					if(item._id === messageData.assignedTo){
						item.messages.push(messageData)
						if( item.messages[item.messages.length -1] === 
								item.messages[item.messages.length -2]){
									item.messages.pop()
						}
					}
					return item
				})
				return newState
			})
		})

		return () => socket.removeAllListeners()
	},[])

	// useEffect(() => { console.log(rooms) }, [ rooms ])

	useEffect(() => {
		(async () =>{
			const { data } = await api.get('room/list')

			const { id } = parseJwt(getToken())
			setRooms(data)

			const myRooms = data.map(item => item.user[0]._id)

			socket.emit('joinroom', {rooms: [...myRooms, id]})
		})()
	},[])

	function handleSelectRoom(room){ setSelectedRoom(room);}
	function handleAddMessageToRoom(message){
		// setRooms(prevState => {
		// 	const a = prevState.map((item, index) => {
		// 		if(item._id === message.assignedTo){
		// 			const messages = item.messages
		// 			messages.push(message)
		// 			console.log("mensagesns: ", messages)
		// 			item.messages = messages
		// 			console.log('item:, ', item.messages)
		// 		}
		// 		return item
		// 	})
		// 	console.log(a)
		// 	return a
		// })
		// // setRooms(prevState => prevState.map(item => {
		// // 	if(item._id === message.assignedTo){
		// // 		item.messages.push(message)
		// // 		if(item.messages[item.messages.length -1] === 
		// // 			 item.messages[item.messages.length -2]){
		// // 				item.messages.pop()
		// // 		}
		// // 	}
		// // 	return item
		// // }))
	}

	return(
		<UsersContext.Provider 
		value={{
			rooms,
			handleSelectRoom,
			selectedRoom,
			handleAddMessageToRoom
		}}>
			{children} 
		</UsersContext.Provider>
	)
}

export function useUsers() {
	return useContext(UsersContext)
}