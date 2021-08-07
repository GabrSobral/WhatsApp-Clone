import io from "socket.io-client";

const connectionOptions =  {
	"force new connection" : true,
	"reconnectionAttempts": "Infinity", 
	"timeout" : 10000,                  
	"transports" : ["websocket"]
  };
export const socket = io.connect('http://localhost:3333', connectionOptions);