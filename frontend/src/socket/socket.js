import { io } from "socket.io-client";
const DOMAIN = import.meta.env.VITE_DOMAIN;

const SOCKET_URL = DOMAIN; 
const socket = io(SOCKET_URL, {
  autoConnect: false, // Prevents automatic connection
  transports: ["websocket"], // Ensures WebSocket is used as the transport protocol
});

export default socket;
