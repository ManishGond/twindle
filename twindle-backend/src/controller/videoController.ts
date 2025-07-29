import { Request, Response } from "express";
import { uploadToB2 } from "../utils/b2";
import { prisma } from "../lib/prisma";

export const uploadVideo = async (req: Request, res: Response) => {
  try {
    const file = req.file;
    const { title, tags, creatorId } = req.body;

    if (!file || !title || !creatorId) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    const mimeType = file.mimetype;
    const fileName = `${Date.now()}_${file.originalname}`;

    const videoUrl = await uploadToB2(file.buffer, fileName, mimeType);

    const video = await prisma.video.create({
      data: {
        title,
        videoUrl,
        tags: tags ? tags.split(",").map((tag: string) => tag.trim()) : [],
        creator: {
          connect: { id: creatorId },
        },
      },
    });

    return res.status(201).json({
      message: "Video uploaded!",
      video: {
        id: video.id,
        title: video.title,
        url: video.videoUrl,
        createdAt: video.createdAt,
      },
    });
  } catch (err) {
    console.error("Upload error:", err);
    return res.status(500).json({ error: "Failed to upload video." });
  }
};
