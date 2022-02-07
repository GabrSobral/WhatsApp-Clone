import { socket } from "../../services/socket";

export const RoomsReducer = (state, action) => {
  switch(action.type) {
    case "set_rooms": 
      return { ...state, rooms: action.payload.rooms };

    case "add_room": 
      return { ...state, rooms: [ ...state.rooms, action.payload.room ] };

    case "selectRoom": {
      const room = action.payload.room;
      const selectedRoom = state.selectedRoom;

      if(room._id === selectedRoom?._id) return;

      if(room.unreadMessages !== 0){
        socket.emit('viewUnreadMessages', { user: myId, room: room._id });
        room.unreadMessages = 0;
      }
      
      if(!room.hasMessages){ 
        const { data } = await api.get(`room/messages/list/${room._id}`);
        if(data.length > 1) { 
          data.splice((data.length - room.messages.length), room.messages.length);
          room.messages = data.concat(room.messages);
        }
        room.hasMessages = true;
      }
      return { ...state, selectedRoom: room };
    }

    case "read_unread_messages": 
      return { ...state, unreadMessages: 0 }

    case "new_message": {
      const messageData = action.payload.messageData;
      const unreadMessages = action.payload.messageData;
      const selectedRoom = state.selectedRoom;
      const userId = action.payload.userId;

      const rooms = state.rooms.map(item => {		
        if(item._id !== messageData.assignedTo) return item;

        if(unreadMessages.to === item._id){
          if(!state.isFocused || selectedRoom?._id !== messageData.assignedTo) {
            unreadMessages.user !== userId && item.unreadMessages++;
            
          } else 
            socket.emit('viewUnreadMessages', { 
              user: userId, 
              room: item._id 
            });
        }
        item.messages.push(messageData);
        
        return item;
      });
      return { ...state, rooms };
    }

    case "receive_writting": {
      const rooms = state.rooms.map(item => {		
        if(item._id === action.payload.room)
        item.isWritting = action.payload.writting
        
        return item
      })
      return { ...state, rooms };
    }

    case "receive_read_messages" : {
      const rooms =  state.rooms.map(item => {
        if(item._id !== action.payload.room) return item;
        
        item.messages.forEach(message => message.viewed = true);
        return item;
      });
      return { ...state, rooms };
    }

    case "receive_Im_online" : {
      const rooms = state.rooms.map(item => {
        if(item._id === action.payload.room) {
          item.user[0].isOnline = action.payload.status;
          item.user[0].lastOnline = new Date();
        };
        return item;
      })
      return { ...state, rooms };
    }

    case "receive_join_new_room" : 
      return { ...state, rooms: [ action.payload.room, ...state.rooms ] }

    case "receive_remove_room" : {
      const room = action.payload.room;
      const selectedRoom = state.selectedRoom === room ? null:state.selectedRoom;

      const rooms = state.rooms.filter(item => item._id !== room)
			return { ...state, rooms, selectedRoom }
    }

    case "handle_is_focused":
      return { ...state, isFocused: !state.isFocused };
    
    case "add_prev_messages": {
      const prevMessages = action.payload.prevMessages;

      const rooms = state.rooms.map(item => {
        if(item._id === prevMessages[0].assignedTo){
          prevMessages.length < 50 && ( item.hasAllMessages = true );

          item.messages = prevMessages.concat(item.messages)
        }
        return item;
      });
      return { ...state, rooms };
    };

    case "handle_add_message_to_room" : {
      const message = action.payload.message;
      const i = state.rooms.findIndex(messageItem => messageItem._id === message.assignedTo);
      state.rooms[i].messages.push(message);
     
      return { ...state };
    }

    case "handle_update_message_sent": {
      const message = action.payload.message;

      const rooms = state.rooms.map(item => {
        if(item._id !== message.assignedTo) return item;

        const i = item.messages.findIndex(messageItem => messageItem._id === message._id);
        item[i].received = true;
        return item;
      })
      return { ...state, rooms };
    }
      
    default : return state;
  }
}