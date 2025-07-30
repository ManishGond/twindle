import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const getMessageByRoom = async(req: Request, res: Response) => {
  try {
    const {roomId} = req.params
    const messages = await prisma.chatMessage.findMany({
      where: {roomId},
      orderBy: {createdAt: "asc"}
    })

    res.json(messages)
  } catch (error) {
    res.status(500).json({error: "Failed to fetch messages"})
  }
}