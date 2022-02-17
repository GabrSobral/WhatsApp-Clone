import { io } from "socket.io-client";

const uri = import.meta.env.VITE_API_URL?.toString() || "";

export const socket = io(uri, { 
	transports: ["websocket"],
	timeout: 10000 ,
	reconnectionAttempts: 9999,
	forceNew: true,
	reconnectionDelay: 5000
});