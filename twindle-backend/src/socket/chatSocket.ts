import { Server, Socket } from "socket.io";
import { prisma } from "../lib/prisma";

interface ChatMessage {
  sender: string;
  content: string;
  roomId: string;
}

const onlineUsers: Record<string, Set<string>> = {};
const socketIdToUser: Record<string, { username: string; roomId: string }> = {};
const validRooms: Set<string> = new Set();

const setupChatSocket = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    socket.on("create_room", ({ roomId }) => {
      validRooms.add(roomId);
    });

    socket.on("join_room", async ({ roomId, username }, callback) => {
      // 👇 Check if room is either active (onlineUsers) or was created (validRooms)
      const isRoomValid = onlineUsers[roomId] || validRooms.has(roomId);
      if (!isRoomValid) {
        return callback?.({ error: "Room does not exist." });
      }

      // ✅ Remove existing mapping if user was already joined elsewhere
      if (socketIdToUser[socket.id]) {
        const prevRoom = socketIdToUser[socket.id].roomId;
        onlineUsers[prevRoom]?.delete(socketIdToUser[socket.id].username);
      }

      socket.join(roomId);
      socketIdToUser[socket.id] = { username, roomId };

      if (!onlineUsers[roomId]) onlineUsers[roomId] = new Set();
      onlineUsers[roomId].add(username);

      const messages = await prisma.chatMessage.findMany({
        where: { roomId },
        orderBy: { createdAt: "asc" },
        take: 50,
      });

      socket.emit("chat_history", messages);
      io.to(roomId).emit("room_users", Array.from(onlineUsers[roomId]));
      io.to(roomId).emit("system_message", `${username} joined the room`);

      return callback?.({ success: true });
    });

    socket.on("send_message", async (msg: ChatMessage) => {
      await prisma.chatMessage.create({
        data: {
          sender: msg.sender,
          content: msg.content,
          roomId: msg.roomId,
        },
      });

      const allMessages = await prisma.chatMessage.findMany({
        where: { roomId: msg.roomId },
        orderBy: { createdAt: "desc" },
        skip: 50,
      });

      if (allMessages.length > 0) {
        const idsToDelete = allMessages.map((m) => m.id);
        await prisma.chatMessage.deleteMany({
          where: { id: { in: idsToDelete } },
        });
      }

      io.to(msg.roomId).emit("receive_message", msg);
    });

    socket.on("leave_room", ({ roomId }) => {
      socket.disconnect(); // Triggers disconnecting — that's enough
    });

    socket.on("disconnecting", async () => {
      const userData = socketIdToUser[socket.id];
      if (!userData) return;

      const { username, roomId } = userData;

      if (onlineUsers[roomId]) {
        onlineUsers[roomId].delete(username);
        io.to(roomId).emit("room_users", Array.from(onlineUsers[roomId]));
        io.to(roomId).emit("system_message", `${username} left the room`);

        if (onlineUsers[roomId].size === 0) {
          delete onlineUsers[roomId];
          validRooms.delete(roomId);
          await prisma.chatMessage.deleteMany({ where: { roomId } });
        }
      }

      delete socketIdToUser[socket.id];
    });
  });
};

export default setupChatSocket;
