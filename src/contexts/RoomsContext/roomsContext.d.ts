import { IMessage, IReferencedTo } from '../../types/IMessage'
import { IRoom } from '../../types/IRoom'
import { IUnreadMessage } from '../../types/IUnreadMessage'

export type IRoomContextProps = {
	rooms: IRoom[];
	selectedRoom: IRoom | null;
	isFocused: boolean;
	selectedIndex: number | null;
	roomActions: IActionsRooms;
	handleSelectRoom: (index: number) => void;
	handleFetchRooms: () => void;
	handleAddNewRoom: (room: IRoom) => void;
	handleRemoveRoomFromScreen: (room: IRoom) => void;
}

export type IActionsRooms = {
  setRoomsData: (rooms: IRoom[]) => void;
  addRoom: (room: IRoom) => void;
  selectRoom: (roomIndex: number | null) => void;
  receiveJoinNewRoom: (newRoom: IRoom) => void;
  setIsFocused: (isFocused: boolean) => void;
  readUnreadMessages: (roomId: string) => void;
  receiveWritting: (roomId: string, isWritting: boolean) => void,
  receiveReadMessages: (roomId: string) => void,
  receiveImOnline: (roomId: string, isOnline: boolean) => void,
  addPrevMessages: (prevMessages: IMessage[]) => void,
  addMessageToRoom: (message: IMessage) => void,
  updateMessageSent: (message: IMessage) => void,
  setHasMessages: (messages: IMessage[], room: IRoom) => void,
  newMessage: (message: IMessage, unreadMessages: IUnreadMessage, userId: string) => void,
  setCurrentMessage: (currentMessage: string) => void,
  addReferencedTo: (referencedTo: IReferencedTo) => void,
  removeRoom: (roomId: string) => void;
  selectMessageToAnswer: (message: IMessage) => void;
}