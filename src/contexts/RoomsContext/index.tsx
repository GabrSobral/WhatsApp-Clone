import { useContext, createContext, useEffect, useCallback, ReactNode } from 'react'

import { useAuth } from '../AuthContext'
import { IRoomContextProps } from './roomsContext';

import api from '../../services/api.js'
import { socket } from "../../services/socket";

import { IRoom } from '../../types/IRoom';
import { IMessage } from '../../types/IMessage';

import { useRoomsActions } from '../../hooks/useRoomsActions';

const RoomsContext = createContext({} as IRoomContextProps)

export function RoomsProvider({ children }:{ children: ReactNode }) { 
	const [ state, roomActions ] = useRoomsActions();	
	const { myId } = useAuth();

	useEffect(() => {
		if(!myId) return;

		// window.onblur = () => {
		// 	roomActions.setIsFocused(false);
		// 	socket.emit('imOnline', { 
		// 		user: myId, 
		// 		status: false, 
		// 		rooms: state.rooms
		// 	});
		// }

		// window.onfocus = () => {
		// 	roomActions.setIsFocused(true);
		// 	socket.emit('imOnline', { 
		// 		user: myId, 
		// 		status: true, 
		// 		rooms: state.rooms
		// 	});
			
		// 	if(state.selectedIndex){
		// 		const roomId = state.rooms[state.selectedIndex]._id;
		// 		socket.emit('viewUnreadMessages', { user: myId, room: roomId });
		// 		roomActions.readUnreadMessages(roomId);
		// 	}
		// }

		socket.on('receive_fetch_rooms', ({ rooms }: any) => {
			roomActions.setRoomsData(rooms)
		});

		socket.on('newMessage', ({ message, unreadMessages }: any) => {
			console.log(myId);
			console.log(message);
			if(myId === message.user) 
				return roomActions.updateMessageSent(message);
			
			roomActions.newMessage(message, unreadMessages, myId);
		});

		socket.on('receiveWritting', ({ writting, room, to }: any) => {
			if(to === myId)
				roomActions.receiveWritting(room, writting);
		});

		socket.on('receiveReadMessages', ({ room, user }: any) => {
			if(user !== myId)
				roomActions.receiveReadMessages(room);
		});

		socket.on('receiveImOnline', ({ user, status, room }: any) => {
			if(myId !== user)
				roomActions.receiveImOnline(room, status);
		});

		socket.on('receiveJoinNewRoom', ({ user, room }: any) => {
			roomActions.addRoom(room);
			socket.emit('joinNewRoom', { user_target: user, check: true});
		});

		socket.on('receiveRemoveRoom', ({ room, user }: any) => {
			if(user === myId) return;
				
			roomActions.removeRoom(room);

			socket.emit('removeRoom', { 
				user_target: user,
				check: true
			});
		});

		return () => { socket.removeAllListeners() };
	},[roomActions, state.selectedIndex, state.rooms, myId])

	const handleFetchRooms = useCallback(async () => {
		if(myId)
			socket.emit('fetch_rooms', { user_id: myId });
	},[myId])

	const handleAddNewRoom = useCallback((room: IRoom) => {
		if(!myId) return;
		
		roomActions.addRoom(room);

		socket.emit('joinNewRoom', {
			user_target: room.user[0]._id, 
			user: myId, 
			check: false,
			room_id: room._id
		});
	},[roomActions, myId]);

	const handleSelectRoom = useCallback(async (index: number) => {
		if(index === state.selectedIndex || (typeof index !== "number")) return;
		roomActions.selectRoom(index);
	
		const room = state.rooms[index];

		if(room?.unreadMessages !== 0) {
			socket.emit('viewUnreadMessages', { user: myId, room: room._id });
			room.unreadMessages = 0;
		}
		
		if(!room.hasMessages) {
			const { data } = await api.get<IMessage[]>(`room/messages/list/${room._id}`);
			roomActions.setHasMessages(data, room);
		}
	},[roomActions, myId, state]);

	const handleRemoveRoomFromScreen = useCallback((room: IRoom) => {
		if(!state.selectedIndex) return;
		if (state.rooms[state.selectedIndex]._id === room._id)
			roomActions.selectRoom(null);

		roomActions.removeRoom(room._id);
		socket.emit('removeRoom', { 
			user_target: room.user[0]._id,
			user: myId,
			room: room._id,
			check: false
		})
	},[roomActions, state.selectedIndex, state.rooms, myId]);

	return(
		<RoomsContext.Provider 
			value={{
				rooms: state.rooms,
				isFocused: state.isFocused,
				selectedIndex: state.selectedIndex,
				selectedRoom: typeof state.selectedIndex === "number" ? 
					state.rooms[state.	selectedIndex] : null,

				roomActions,
				handleSelectRoom,
				handleFetchRooms,
				handleAddNewRoom,
				handleRemoveRoomFromScreen,
			}}
		>
			{children} 
		</RoomsContext.Provider>
	)
}

export const useRooms = () => useContext(RoomsContext);