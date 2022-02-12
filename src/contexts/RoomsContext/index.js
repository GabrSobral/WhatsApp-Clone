import React, { 
	useContext, 
	createContext, 
	useEffect, 
	useCallback, 
	useReducer } from 'react'

import { useAuth } from '../AuthContext'
import { RoomsReducer } from './reducer'

import api from '../../services/api.js'
import { socket } from "../../services/socket";

const RoomsContext = createContext('')

const initialState = {
	selectedIndex: null,
	rooms: [],
	isFocused: true
};

export function RoomsProvider({ children }) { 
	const [ RoomState, RoomDispatch ] = useReducer(RoomsReducer, initialState);
	const { myId } = useAuth();

	useEffect(() => {
		if(!myId) return;

		window.onblur = () => {
			RoomDispatch({ type: "handle_is_focused" });
			socket.emit('imOnline', { 
				user: myId, 
				status: false, 
				rooms: RoomState.rooms
			});
		}
		window.onfocus = () => {
			RoomDispatch({ type: "handle_is_focused" });
			socket.emit('imOnline', { 
				user: myId, 
				status: true, 
				rooms: RoomState.rooms
			});
			
			if(RoomState.selectedIndex){
				const roomId = RoomState.rooms[RoomState.selectedIndex]._id;
				socket.emit('viewUnreadMessages', { user: myId, room: roomId });
				RoomDispatch({ type: "read_unread_messages", payload: { room: roomId }});
			}
		}

		socket.on('receive_fetch_rooms', ({ rooms }) => {
			RoomDispatch({ type: "set_rooms", payload: { rooms }})
		});

		socket.on('newMessage', ({ message, unreadMessages }) => {
			if(myId === message.user) 
				return RoomDispatch({ type: "update_message_sent", payload: { message }});
			
			RoomDispatch({
				type: "new_message",
				payload: { 
					messageData: message, 
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
			if(myId === user) return;
			RoomDispatch({
				type: "receive_Im_online",
				payload: { room, status }
			});
		});

		socket.on('receiveJoinNewRoom', ({ user, room }) => {
			RoomDispatch({ type: "add_room", payload: { room }});
			socket.emit('joinNewRoom', { user_target: user, check: true});
			RoomDispatch({
				type: "receive_join_new_room",
				payload: { room }
			})
		});

		socket.on('receiveRemoveRoom', ({ room, user }) => {
			if(user === myId) return;

			RoomDispatch({
				type: "remove_room",
				payload: { room }
			});

			socket.emit('removeRoom', { 
				user_target: user,
				check: true
			});
		});

		return () => socket.removeAllListeners();
	},[RoomDispatch, RoomState.selectedIndex, RoomState.rooms, myId])

	const handleFetchRooms = useCallback(async () => {
		if(myId)
			socket.emit('fetch_rooms', { user_id: myId });
	},[myId])

	const handleAddNewRoom = useCallback((room) => {
		if(!myId) return;
		
		RoomDispatch({ type: "add_room", payload: { room } });

		socket.emit('joinNewRoom', {
			user_target: room.user[0]._id, 
			user: myId, 
			check: false,
			room_id: room._id
		});
	},[RoomDispatch, myId]);

	const handleSelectRoom = useCallback(async index => {
		if(index === RoomState.selectedIndex || (typeof index !== "number")) return;
		
		RoomDispatch({ type: "select_room", payload: { index }});
		const room = RoomState.rooms[index];

		if(room?.unreadMessages !== 0) {
			socket.emit('viewUnreadMessages', { user: myId, room: room._id });
			room.unreadMessages = 0;
		}
		
		if(!room.hasMessages) {
			const { data } = await api.get(`room/messages/list/${room._id}`);
			RoomDispatch({ type: "set_has_messages", payload: { messages: data, room }});
		}

	},[RoomDispatch, myId, RoomState]);

	const handleRemoveRoomFromScreen = useCallback((room) => {
		if (RoomState.rooms[RoomState.selectedIndex]._id === room._id)
			RoomDispatch({ type: "selectRoom", payload: { room: null }});

		RoomDispatch({ type: "remove_room", payload: { room }});

		socket.emit('removeRoom', { 
			user_target: room.user[0]._id,
			user: myId,
			room: room._id,
			check: false
		})
		return () => socket.removeAllListeners()
	},[RoomDispatch, RoomState.selectedIndex, RoomState.rooms, myId]);

	return(
		<RoomsContext.Provider 
			value={{
				rooms: RoomState.rooms,
				selectedRoom: RoomState.rooms[RoomState.selectedIndex],
				isFocused: RoomState.isFocused,
				RoomDispatch,
				handleSelectRoom,
				handleFetchRooms,
				handleAddNewRoom,
				handleRemoveRoomFromScreen
			}}
		>
			{children} 
		</RoomsContext.Provider>
	)
}

export function useRooms() {
	return useContext(RoomsContext)
}