import { io, type Socket } from "socket.io-client";

const URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

export const socket: Socket = io(URL, {
  autoConnect: true, // connect automatically
});
