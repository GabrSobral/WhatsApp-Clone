import React, { 
	useState, 
	useContext, 
	createContext, 
	useEffect, 
	useCallback, 
	useReducer } from 'react'

import { useAuth } from '../AuthContext'
import { RoomsReducer } from '../reducer'

import api from '../../services/api.js'
import { socket } from "../../services/socket";

const UsersContext = createContext('')

export function UsersProvider({ children }) { 
	const initialState = {
		selectedRoom: null,
		rooms: [],
		isFocused: true
	};
	const { RoomState, RoomDispatch } = useReducer(RoomsReducer, initialState);
	const { myId } = useAuth()

	useEffect(() => {
		if(!myId) return;

		window.onblur = () => {
			socket.emit('imOnline', { 
				user: myId, 
				status: false, 
				room: RoomState.selectedRoom?._id
			});
			RoomDispatch({ type: "handle_is_focused" });
		}
		window.onfocus = () => {
			socket.emit('imOnline', { 
				user: myId, 
				status: true, 
				room: RoomState.selectedRoom?._id 
			})
			if(RoomState.selectedRoom){
				socket.emit('viewUnreadMessages', { 
					user: myId,
					room: RoomState.selectedRoom?._id 
				});

				RoomDispatch({ type: "read_unread_messages" });
			}
			RoomDispatch({ type: "handle_is_focused" });
		}

		socket.on('newMessage', ({ messageData, unreadMessages }) => {
			if(myId === messageData.user) return;
			RoomDispatch({
				type: "new_message",
				payload: { 
					messageData, 
					unreadMessages,
					userId: myId,
				}
			});
		});

		socket.on('receiveWritting', ({ writting, room, to }) => {
			if(to !== myId) return;
			RoomDispatch({
				type: "receive_writting",
				payload: { room, writting }
			});
		});

		socket.on('receiveReadMessages', ({ room, user }) => {
			if(user === myId) return;
			RoomDispatch({
				type: "receive_read_messages",
				payload: { room }
			});
		});

		socket.on('receiveImOnline', ({ user, status, room }) => {
			if(myId === user){ return }
			RoomDispatch({
				type: "receive_Im_online",
				payload: { room, status }
			});
		});

		socket.on('receiveJoinNewRoom', ({ user, room }) => {
			if(user === myId) return;

			socket.emit('joinNewRoom', { user_target: user, check: true})
			RoomDispatch({
				type: "receive_join_new_room",
				payload: { room }
			})
		});

		socket.on('receiveRemoveRoom', ({ room, user }) => {
			if(user === myId) return;

			RoomDispatch({
				type: "receive_remove_room",
				payload: { }
			})

			socket.emit('removeRoom', { 
				user_target: user,
				check: true
			})
		})
		return () => socket.removeAllListeners()
	},[RoomDispatch, RoomState.selectedRoom, myId])

	// useEffect(() => { console.log("Rooms", rooms) }, [ rooms ])

	const handleFetchRooms = useCallback(async () => {
		(async function(){
			const { data } = await api.get('/room/list')
			RoomDispatch({ type: "set_rooms", payload: { rooms: data }});
	
			const myRooms = data.map(item => item.user[0]._id)
			socket.emit('joinroom', {rooms: [...myRooms, myId]})
		})()
	},[myId, RoomDispatch])

	function handleAddNewRoom(room){
		RoomDispatch({ type: "add_room", payload: { room } });

		socket.emit('joinNewRoom', {
			user_target: room.user[0]._id, 
			user: myId, 
			check: false,
			room_id: room._id
		})
	}

	const handleAddPreviousMessages = useCallback(async (prevMessages) => {
		RoomDispatch({ type: "add_prev_messages", payload: { prevMessages } })
	},[RoomDispatch])

	function handleAddMessageToRoom(message) {
		RoomDispatch({ type: "handle_add_message_to_room", payload: { message }})
	}
	
	function handleUpdateMessagesSent(message){
		RoomDispatch({ type: "handle_update_message_sent", payload: { message }})
	}

	async function handleSelectRoom(room){ 
		if(room._id === selectedRoom?._id) return;
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