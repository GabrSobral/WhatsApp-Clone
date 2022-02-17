import { useMemo, useState } from "react"
import { IActionsRooms } from "../contexts/RoomsContext/roomsContext"
import { socket } from "../services/socket"
import { IMessage, IReferencedTo } from "../types/IMessage"
import { IRoom } from "../types/IRoom"
import { IUnreadMessage } from "../types/IUnreadMessage"

type StateProps = {
	selectedIndex: number | null;
	rooms: IRoom[];
	isFocused: boolean;
}

const initialState: StateProps = {
	selectedIndex: null,
	rooms: [],
	isFocused: true
};

export const useRoomsActions = (): [ StateProps, IActionsRooms ] => {
	const [ state, setState ] = useState(initialState);

  const roomActions = useMemo(() => ({
		setRoomsData: ( rooms: IRoom[] ) => {
			setState(prev => ({ ...prev, rooms }));
		},
		addRoom: ( room: IRoom ) => {
			setState(prev => ({ ...prev, rooms: [ ...prev.rooms, room ] }));
		},
		selectRoom: ( roomIndex: number | null ) => {
			setState(prev => ({ ...prev, selectedIndex: roomIndex }));
		},
		receiveJoinNewRoom: (newRoom: IRoom) => {
			setState(prev => ({ ...prev, rooms:[ newRoom, ...state.rooms ]}));
		},
		setIsFocused: (isFocused: boolean) => {
			setState(prev => ({ ...prev, isFocused: isFocused}));
		},
		readUnreadMessages: (roomId: string) => {
			setState(prev => {
				const i = prev.rooms.findIndex(item => item._id === roomId);
				prev.rooms[i].unreadMessages = 0;
				return { ...prev };
			});
		},
		receiveWritting: (roomId: string, isWritting: boolean) => {
			setState(prev => {
				const i = prev.rooms.findIndex(item => item._id === roomId);
				prev.rooms[i].isWritting = isWritting;
				return { ...prev };
			})
		},
		receiveReadMessages: (roomId: string) => {
			setState(prev => {
				const i = prev.rooms.findIndex(item => item._id === roomId);
				prev.rooms[i].messages.forEach(message => message.viewed = true);
				return { ...prev };
			})
		},
		receiveImOnline: (roomId: string, isOnline: boolean) => {
			setState(prev => {
				const i = prev.rooms.findIndex(item => item._id === roomId);
				prev.rooms[i].user[0].isOnline = isOnline;
				prev.rooms[i].user[0].lastOnline = new Date();
				return { ...prev };
			})
		},
		addPrevMessages: (prevMessages: IMessage[]) => {
			setState(prev => {
				const i = prev.rooms.findIndex(item => item._id === prevMessages[0].assignedTo);
				prev.rooms[i].messages = prevMessages.concat(prev.rooms[i].messages);
				return { ...prev };
			});
		},
		addMessageToRoom: (message: IMessage) => {
			setState(prev => {
				const i = prev.rooms.findIndex(item => item._id === message.assignedTo);
				prev.rooms[i].messages.push(message);
				return { ...prev };
			});
		},
		updateMessageSent: (message: IMessage) => {
			setState(prev => {
				const i = prev.rooms.findIndex(item => item._id === message.assignedTo);
				const messageIndex = prev.rooms[i].messages.findIndex(item => item.public_id === message.public_id);
		
				prev.rooms[i].messages[messageIndex].received = true;
				prev.rooms[i].messages[messageIndex]._id = message._id;
				return { ...prev };
			});
		},
		setHasMessages: (messages: IMessage[], room: IRoom) => {
			if(messages.length > 1) { 
				messages.splice((messages.length - room.messages.length), room.messages.length);
				room.messages = messages.concat(room.messages);
			}
			room.hasMessages = true;
			setState(prev => {
				const i = prev.rooms.findIndex(item => item._id === room._id);
				prev.rooms[i] = room;
				return { ...prev };
			});
		},
		newMessage: (message: IMessage, unreadMessages: IUnreadMessage, userId: string) => {
			setState(prev => {
				const selectedRoom = prev.selectedIndex ? prev.rooms[prev.selectedIndex]: null;
				const i = prev.rooms.findIndex(item => item._id === message.assignedTo);
		
				if(unreadMessages.to === prev.rooms[i]._id) {
					if(!prev.isFocused || selectedRoom?._id !== message.assignedTo)
						unreadMessages.user !== userId && prev.rooms[i].unreadMessages++;
					else 
						socket.emit('viewUnreadMessages', { 
							user: userId, 
							room: prev.rooms[i]._id 
						});
				}
				prev.rooms[i].messages.push(message);
				return { ...prev };
			})
		},
		setCurrentMessage: (currentMessage: string) => {	
			setState(prev => {
				if(prev.selectedIndex)
					prev.rooms[prev.selectedIndex].currentMessage = currentMessage;
	
				return { ...prev };
			})
		},
		addReferencedTo: (referencedTo: IReferencedTo) => {
			setState(prev => {
				if(!prev.selectedIndex) return { ...prev };
	
				prev.rooms[prev.selectedIndex].referencedTo = referencedTo;
				return { ...prev };
			})
		},
		removeRoom: (roomId: string) => {
			setState(prev => {
				const i = prev.rooms.findIndex(item => item._id === roomId);
				prev.rooms.splice(i, 1);
				return { ...prev };
			});
		},
		selectMessageToAnswer: (message: IMessage) => {
			setState(prev => {
				const i = prev.rooms.findIndex(item => item._id === message.assignedTo);
				prev.rooms[i].referencedTo = message;
				return { ...prev };
			})
		},
		removeReferencedTo: (roomId: string) => {
			setState(prev => {
				const i = prev.rooms.findIndex(item => item._id === roomId);
				prev.rooms[i].referencedTo = undefined;
				return { ...prev };
			})
		},
		setHasAllMessages: (roomId: string) => {
			setState(prev => {
				const i = prev.rooms.findIndex(item => item._id === roomId);
				prev.rooms[i].hasAllMessages = true;
				return { ...prev };
			});
		}
	}),[])

  return [ state, roomActions ];
}