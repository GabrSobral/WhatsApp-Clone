/* eslint-disable default-case */
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
	const [ isFocused, setIsFocused ] = useState(false)

	useEffect(() => {
		if(!getToken()){ return }

		socket.on('newMessage', ({ messageData, unreadMessages }) => {
			if(parseJwt(getToken()).id === messageData.user){ return }
			setRooms(prevState => 
				prevState.map(item => {		
					if(item._id === messageData.assignedTo){
	
						if(unreadMessages.to === item._id){
							if(!isFocused || selectedRoom?._id !== messageData.assignedTo){
								if(unreadMessages.user !== parseJwt(getToken()).id){
									item.unreadMessages++
								}
							} else {
								socket.emit('viewUnreadMessages', 
								{ user: parseJwt(getToken()).id, room: item._id })
							}
						}
						item.messages = [...item.messages, messageData]
					}
					return item
				})
			)
		})

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

		socket.on('receiveReadMessages', ({ room, user }) => {
			if(user === parseJwt(getToken()).id){ return }
			setRooms(prevState => prevState.map(item => {
				if(item._id !== room){ return item }
				item.messages.forEach(message => message.viewed = true)
				return item
			}))
		})

		window.onblur = () => {
			socket.emit('imOnline', { 
				user: parseJwt(getToken()).id, 
				status: false, 
				room: selectedRoom?._id
			})
			setIsFocused(false)
		}
		window.onfocus = () => {
			socket.emit('imOnline', { 
				user: parseJwt(getToken()).id, 
				status: true, 
				room: selectedRoom?._id 
			})
			if(selectedRoom){
				socket.emit('viewUnreadMessages', 
					{ user: parseJwt(getToken()).id, room: selectedRoom?._id })
				setSelectedRoom(prevState => {
					prevState.unreadMessages = 0
					return prevState	
				})
			}
			
			setIsFocused(true)
		}

		socket.on('receiveImOnline', ({ user, status, room }) => {
			if(parseJwt(getToken()).id === user){ return }
			setRooms(prevState => prevState.map(item => {
				if(item._id === room){
					item.user[0].isOnline = status
					item.user[0].lastOnline = new Date()
				} 
				return item
			}))
		})
		return () => socket.removeAllListeners()
	},[selectedRoom, isFocused])

	// useEffect(() => { console.log("Rooms", rooms) }, [ rooms ])

	const handleFetchRooms = useCallback(async () => {
		(async function(){
			const { data } = await api.get('room/list')
			const { id } = parseJwt(getToken())
			setRooms(data)
	
			const myRooms = data.map(item => item.user[0]._id)
			socket.emit('joinroom', {rooms: [...myRooms, id]})
		})()
	},[])

	const handleAddPreviousMessages = useCallback((prevMessages) => {
		setSelectedRoom(prevState => {
			if(prevMessages.length < 10){
				prevState.hasAllMessages = true
			}
			prevState.messages = prevMessages.concat(prevState.messages)
			return prevState
		})
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
			{ user: parseJwt(getToken()).id, room: room._id })
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
				handleAddPreviousMessages
			}}
		>
			{children} 
		</UsersContext.Provider>
	)
}

export function useUsers() {
	return useContext(UsersContext)
}