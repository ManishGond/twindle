import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import videoRoutes from "./routes/videoRoutes";
import authLimiter from "./middleware/rateLimiter";
import authRoutes from "./routes/authRoutes";
import { Server } from "socket.io";
import { createServer } from "http";
import setupChatSocket from "./socket/chatSocket"; // ✅ import
import chatRoutes from "./routes/chatRoutes";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/videos", videoRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/uploads", express.static("uploads"));

const httpServer = createServer(app);
// Create Socket.IO server
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Call socket handler
setupChatSocket(io); // ✅ mount chat logic

// Server listener
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`🚀 Server and WebSocket are running on port ${PORT}`);
});
