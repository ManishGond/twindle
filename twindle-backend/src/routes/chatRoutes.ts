import express from "express";
import { getMessageByRoom } from "../controller/chatController";

const chatRoutes = express.Router();
chatRoutes.get("/:roomId/messages", getMessageByRoom);

export default chatRoutes;
