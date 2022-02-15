import { socket } from "../../services/socket";

export const RoomsReducer = (state, action) => {
  const functions = {
    set_rooms: () => ({ ...state, rooms: action.payload.rooms }),
    add_room: () => ({ ...state, rooms: [ ...state.rooms, action.payload.room ] }),
    select_room: () => ({ ...state, selectedIndex: action.payload.index }),
    receive_join_new_room:() => ({ ...state, rooms:[action.payload.room, ...state.rooms]}),
    handle_is_focused: () => ({ ...state, isFocused: !state.isFocused }),
    read_unread_messages: () => {
      const i = state.rooms.findIndex(item => item._id === action.payload.room);
      state.rooms[i].unreadMessages = 0;
      return { ...state };
    },
    receive_writting: () => {
      const i = state.rooms.findIndex(item => item._id === action.payload.room);
      state.rooms[i].isWritting = action.payload.writting;
      return { ...state };
    },
    receive_read_messages: () => {
      const i = state.rooms.findIndex(item => item._id === action.payload.room);
      state.rooms[i].messages.forEach(message => message.viewed = true);
      return { ...state };
    },
    receive_Im_online: () => {
      const i = state.rooms.findIndex(item => item._id === action.payload.room);
      state.rooms[i].user[0].isOnline = action.payload.status;
      state.rooms[i].user[0].lastOnline = new Date();
     
      return { ...state };
    },
    add_prev_messages: () => {
      const prevMessages = action.payload.prevMessages;
      const i = state.rooms.findIndex(item => item._id === prevMessages[0].assignedTo);
      state.rooms[i].messages = prevMessages.concat(state.rooms[i].messages);
     
      return { ...state };
    },
    add_message_to_room: () => {
      const message = action.payload.message;
      const i = state.rooms.findIndex(item => item._id === message.assignedTo);

      state.rooms[i].messages.push(message);
      return { ...state };
    },
    update_message_sent: () => {
      const message = action.payload.message;
      const i = state.rooms.findIndex(item => item._id === message.assignedTo);
      const messageIndex = state.rooms[i].messages.findIndex(item => item.public_id === message.public_id);

      state.rooms[i].messages[messageIndex].received = true;
      state.rooms[i].messages[messageIndex]._id = message._id;

      return { ...state };
    },
    set_has_messages: () => {
      const messages = action.payload.messages;
      const room = action.payload.room;

      if(messages.length > 1) { 
				messages.splice((messages.length - room.messages.length), room.messages.length);
				room.messages = messages.concat(room.messages);
			}
			room.hasMessages = true;

      const i = state.rooms.findIndex(item => item._id === room._id);
      state.rooms[i] = room;

      return { ...state, selectedRoom: room };
    },
    new_message: () => {
      const messageData = action.payload.messageData;
      const unreadMessages = action.payload.unreadMessages;
      const selectedRoom = state.selectedRoom;
      const userId = action.payload.userId;
      const i = state.rooms.findIndex(item => item._id === messageData.assignedTo);

      if(unreadMessages.to === state.rooms[i]._id) {
        if(!state.isFocused || selectedRoom?._id !== messageData.assignedTo)
          unreadMessages.user !== userId && state.rooms[i].unreadMessages++;
        else 
          socket.emit('viewUnreadMessages', { 
            user: userId, 
            room: state.rooms[i]._id 
          });
      }
      state.rooms[i].messages.push(messageData);
      return { ...state };
    },
    set_current_message: () => {
      const current_message = action.payload.current_message;
      state.rooms[state.selectedIndex].current_message = current_message;
      return { ...state };
    }
  }

  const execute = functions[action.type];
  return execute ? execute() : state;
}