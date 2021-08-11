import io from "socket.io-client";

const connectionOptions =  {
	"force new connection" : true,
	"reconnectionAttempts": "Infinity", 
	"timeout" : 10000,                  
	"transports" : ["websocket"]
  };
export const socket = io.connect(process.env.REACT_APP_API_URL, connectionOptions);