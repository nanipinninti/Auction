import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:5001"; 
const socket = io(SOCKET_URL, {
  autoConnect: false, // Prevents automatic connection
  transports: ["websocket"], // Ensures WebSocket is used as the transport protocol
});

export default socket;
