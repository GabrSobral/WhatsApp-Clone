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
	const [ { isFocused, rooms, selectedIndex }, roomActions ] = useRoomsActions();	
	const { myId } = useAuth();

	useEffect(() => {
		if(!myId) return;

		const roomsIds = rooms.map(item => item._id);

		const onBlur = () => {
			// roomActions.setIsFocused(false);
			// socket.emit('imOnline', { 
			// 	user: myId, 
			// 	status: false, 
			// 	rooms: roomsIds
			// });
		}

		const onFocus = () => {
			// roomActions.setIsFocused(true);
			// socket.emit('imOnline', { 
			// 	user: myId, 
			// 	status: true, 
			// 	rooms: roomsIds
			// });
			
			// if(selectedIndex){
			// 	const roomId = rooms[selectedIndex]._id;
			// 	socket.emit('viewUnreadMessages', { user: myId, room: roomId });
			// 	roomActions.readUnreadMessages(roomId);
			// }
		}

		window.addEventListener("blur", onBlur);
		window.addEventListener("focus", onFocus);

		return () => {
			window.removeEventListener("blur", onBlur);
			window.removeEventListener("focus", onFocus);
			socket.removeAllListeners()
		}
	},[roomActions, selectedIndex, myId, rooms])

	useEffect(() => {
		if(!myId) return;

		socket.on('receive_fetch_rooms', ({ rooms }: any) => {
			roomActions.setRoomsData(rooms)
		});

		socket.on('newMessage', ({ message, unreadMessages }: any) => {
			if(myId === message.user) 
				return roomActions.updateMessageSent(message);
			
			if(typeof selectedIndex === "number" && 
				(isFocused && rooms[selectedIndex]?._id === message.assignedTo))
				socket.emit('viewUnreadMessages', { 
					user: myId, 
					room: message.assignedTo
				});

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
	},[roomActions, selectedIndex, rooms, myId])

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
		if(index === selectedIndex || (typeof index !== "number")) return;
		roomActions.selectRoom(index);
	
		const room = rooms[index];

		if(room?.unreadMessages !== 0) {
			socket.emit('viewUnreadMessages', { user: myId, room: room._id });
			room.unreadMessages = 0;
		}
		
		if(!room.hasMessages) {
			const { data } = await api.get<IMessage[]>(`room/messages/list/${room._id}`);
			roomActions.setHasMessages(data, room);
		}
	},[roomActions, myId, rooms, selectedIndex]);

	const handleRemoveRoomFromScreen = useCallback((room: IRoom) => {
		if(!selectedIndex) return;
		if (rooms[selectedIndex]._id === room._id)
			roomActions.selectRoom(null);

		roomActions.removeRoom(room._id);
		socket.emit('removeRoom', { 
			user_target: room.user[0]._id,
			user: myId,
			room: room._id,
			check: false
		})
	},[roomActions, selectedIndex, rooms, myId]);

	return(
		<RoomsContext.Provider 
			value={{
				rooms: rooms,
				isFocused: isFocused,
				selectedIndex: selectedIndex,
				selectedRoom: typeof selectedIndex === "number" ? 
					rooms[selectedIndex] : null,

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