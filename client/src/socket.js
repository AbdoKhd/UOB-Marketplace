// src/socket.js
import { io } from "socket.io-client";

const SOCKET_URL = "http://192.168.1.144:5000";

const socket = io(SOCKET_URL, {
  autoConnect: false, // Connect manually when needed
});

export default socket;
