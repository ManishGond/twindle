import { Server, Socket } from "socket.io";
import { prisma } from "../lib/prisma";

interface ChatMessage {
  sender: string;
  content: string;
  roomId: string;
}

const onlineUsers: Record<string, Set<string>> = {};
const socketIdToUser: Record<string, { username: string; roomId: string }> = {};

const setupChatSocket = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    console.log("User connected:", socket.id);

    socket.on("join_room", ({ roomId, username }) => {
      socket.join(roomId);
      socketIdToUser[socket.id] = { username, roomId };

      if (!onlineUsers[roomId]) onlineUsers[roomId] = new Set();
      onlineUsers[roomId].add(username);

      io.to(roomId).emit("room_users", Array.from(onlineUsers[roomId]));
      io.to(roomId).emit("system_message", `${username} joined the room`);
    });

    socket.on("send_message", async (msg: ChatMessage) => {
      await prisma.chatMessage.create({
        data: {
          sender: msg.sender,
          content: msg.content,
          roomId: msg.roomId,
        },
      });

      io.to(msg.roomId).emit("receive_message", msg);
    });

    socket.on("leave_room", ({ roomId, username }) => {
      socket.leave(roomId);
      if (onlineUsers[roomId]) {
        onlineUsers[roomId].delete(username);
        io.to(roomId).emit("room_users", Array.from(onlineUsers[roomId]));
        io.to(roomId).emit("system_message", `${username} left the room`);
      }

      delete socketIdToUser[socket.id];
    });

    socket.on("disconnecting", () => {
      const userData = socketIdToUser[socket.id];
      if (!userData) return;

      const { username, roomId } = userData;

      if (onlineUsers[roomId]) {
        onlineUsers[roomId].delete(username);
        io.to(roomId).emit("room_users", Array.from(onlineUsers[roomId]));
        io.to(roomId).emit("system_message", `${username} left the room`);
      }

      delete socketIdToUser[socket.id];
    });
  });
};

export default setupChatSocket;
