import { useEffect } from "react"
import { IActionsRooms } from "../contexts/RoomsContext/roomsContext";
import { socket } from "../services/socket";

export const useSockets = (roomActions: IActionsRooms, myId: string) => {
  useEffect(() => {
    socket.on('receive_fetch_rooms', ({ rooms }: any) => {
			roomActions.setRoomsData(rooms)
		});

		socket.on('newMessage', ({ message, unreadMessages }: any) => {
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
			roomActions.receiveJoinNewRoom(room);
		});

		socket.on('receiveRemoveRoom', ({ room, user }: any) => {
			if(user === myId) return;
				
			roomActions.removeRoom(room);

			socket.emit('removeRoom', { 
				user_target: user,
				check: true
			});
		});

		// return () => socket.removeAllListeners();
  },[])
}