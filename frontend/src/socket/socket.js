import { io } from "socket.io-client";
const SOCKET_DOMAIN = import.meta.env.VITE_SOCKET_DOMAIN;

const SOCKET_URL = SOCKET_DOMAIN; 
const socket = io(SOCKET_URL, {
  autoConnect: false, // Prevents automatic connection
  withCredentials : true,
  path: "/socket.io/",
  transports: ["websocket"], // Ensures WebSocket is used as the transport protocol
});

export default socket;
