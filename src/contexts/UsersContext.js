/* eslint-disable default-case */
import React, { useState, useContext, createContext, useEffect, useCallback } from 'react'

import { useAuth } from './AuthContext'

import api from '../services/api.js'
import { socket } from "../services/socket";

const UsersContext = createContext('')

export function UsersProvider({ children }) { 
	const [ rooms, setRooms ] = useState([])
	const [ selectedRoom, setSelectedRoom ] = useState()
	const [ isFocused, setIsFocused ] = useState(true)
	const { myId } = useAuth()

	useEffect(() => {
		if(!myId){ return }

		window.onblur = () => {
			socket.emit('imOnline', { 
				user: myId, 
				status: false, 
				room: selectedRoom?._id
			})
			setIsFocused(false)
		}
		window.onfocus = () => {
			socket.emit('imOnline', { 
				user: myId, 
				status: true, 
				room: selectedRoom?._id 
			})
			if(selectedRoom){
				socket.emit('viewUnreadMessages', 
					{ user: myId, room: selectedRoom?._id })
				setSelectedRoom(prevState => {
					prevState.unreadMessages = 0
					return prevState	
				})
			}
			
			setIsFocused(true)
		}

		socket.on('newMessage', ({ messageData, unreadMessages }) => {
			if(myId === messageData.user){ return }
			setRooms(prevState => 
				prevState.map(item => {		
					if(item._id === messageData.assignedTo){
	
						if(unreadMessages.to === item._id){
							if(!isFocused || selectedRoom?._id !== messageData.assignedTo){
								if(unreadMessages.user !== myId){
									item.unreadMessages++
								}
							} else {
								socket.emit('viewUnreadMessages', 
								{ user: myId, room: item._id })
							}
						}
						item.messages = [...item.messages, messageData]
					}
					return item
				})
			)
		})

		socket.on('receiveWritting', ({ writting, room, to }) => {
			if(to !== myId){ return }
			setRooms((prevState) => (
				prevState.map(item => {		
					if(item._id === room){
						item.isWritting = writting
					}
					return item
				})
			))
		})

		socket.on('receiveReadMessages', ({ room, user }) => {
			if(user === myId){ return }
			setRooms(prevState => prevState.map(item => {
				if(item._id !== room){ return item }
				item.messages.forEach(message => message.viewed = true)
				return item
			}))
		})

		socket.on('receiveImOnline', ({ user, status, room }) => {
			if(myId === user){ return }
			setRooms(prevState => prevState.map(item => {
				if(item._id === room){
					item.user[0].isOnline = status
					item.user[0].lastOnline = new Date()
				} 
				return item
			}))
		})

		socket.on('receiveJoinNewRoom', ({ user, room }) => {
			if(user === myId){ return }

			socket.emit('joinNewRoom', { user_target: user, check: true})
			setRooms(prevState => [room, ...prevState])
		})

		socket.on('receiveRemoveRoom', ({ room, user }) => {
			if(user === myId){ return }
			selectedRoom?._id === room && setSelectedRoom(undefined)
			setRooms(prevState => {
				const newState = []
				prevState.forEach((item) => {
					item._id !== room && newState.push(item)
				})
				return newState
			})
			socket.emit('removeRoom', { 
				user_target: user,
				check: true
			})
		})
		return () => socket.removeAllListeners()
	},[selectedRoom, isFocused, myId])

	// useEffect(() => { console.log("Rooms", rooms) }, [ rooms ])

	const handleFetchRooms = useCallback(async () => {
		(async function(){
			const { data } = await api.get('room/list')
			setRooms(data)
	
			const myRooms = data.map(item => item.user[0]._id)
			socket.emit('joinroom', {rooms: [...myRooms, myId]})
		})()
	},[myId])

	function handleAddNewRoom(room){
		setRooms(prevState => [ room, ...prevState ])
		socket.emit('joinNewRoom', {
			user_target: room.user[0]._id, 
			user: myId, 
			check: false,
			room_id: room._id
		})
	}

	const handleAddPreviousMessages = useCallback(async (prevMessages) => {
		setRooms(prevState => prevState.map(item => {
			if(item._id === prevMessages[0].assignedTo){
				if(prevMessages.length < 50){
					item.hasAllMessages = true
				}
				item.messages = prevMessages.concat(item.messages)
			}
			return item
		}))
	},[])

	function handleAddMessageToRoom(message){
		setRooms(prevState => prevState.map(item => {
			if(item._id === message.assignedTo){
				item.messages = [...item.messages, message]
			}
			return item
		}))
	}
	function handleUpdateMessagesSent(message){
		setRooms(prevState => prevState.map(item => {
			if(item._id === message.assignedTo){
				item.messages.map(messageItem => {
					if(messageItem._id === message._id){
						return message
					}
					return messageItem
				})
			}
			return item
		}))
	}

	async function handleSelectRoom(room){ 
		if(room._id === selectedRoom?._id){ return }
		if(room.unreadMessages !== 0){
			socket.emit('viewUnreadMessages', 
			{ user: myId, room: room._id })
			room.unreadMessages = 0
		}
		
		if(room.hasMessages){ 
			setSelectedRoom(room)
			return 
		} else {
			const { data } = await api.get(`room/messages/list/${room._id}`)
			if(data.length > 1) { 
				data.splice((data.length - room.messages.length), room.messages.length)
				room.messages = data.concat(room.messages)
			}
			room.hasMessages = true
			setSelectedRoom(room)
		}	
  }
	function handleRemoveRoomFromScreen(room){
		selectedRoom?._id === room._id && setSelectedRoom(undefined)
		setRooms(prevState => {
			const newState = []
			prevState.forEach((item) => {
				item._id !== room._id && newState.push(item)
			})
			return newState
		})

		socket.emit('removeRoom', { 
			user_target: room.user[0]._id,
			user: myId,
			room: room._id,
			check: false
		})
		return () => socket.removeAllListeners()
	}

	return(
		<UsersContext.Provider 
			value={{
				rooms,
				setSelectedRoom,
				selectedRoom,
				handleAddMessageToRoom,
				handleSelectRoom,
				handleFetchRooms,
				handleUpdateMessagesSent,
				handleAddPreviousMessages,
				isFocused,
				handleAddNewRoom,
				handleRemoveRoomFromScreen
			}}
		>
			{children} 
		</UsersContext.Provider>
	)
}

export function useUsers() {
	return useContext(UsersContext)
}