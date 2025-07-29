import { Request, Response } from "express";
import { uploadToB2 } from "../utils/b2";
import { prisma } from "../lib/prisma";

export const uploadVideo = async (req: Request, res: Response) => {
  try {
    const file = req.file;
    const { title, tags } = req.body;
    const creatorId = (req as any).userId;

    if (!file || !title || !creatorId) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    const mimeType = file.mimetype;
    const fileName = `${Date.now()}_${file.originalname}`;

    // Upload to Backblaze B2
    const videoUrl = await uploadToB2(file.buffer, fileName, mimeType);

    // Parse tags from comma-separated string
    const tagArray =
      typeof tags === "string"
        ? tags.split(",").map((tag) => ({ tag: tag.trim() }))
        : [];

    // Create video with tags and connect to creator
    const video = await prisma.video.create({
      data: {
        title,
        videoUrl,
        creator: {
          connect: { id: creatorId },
        },
        tags: {
          create: tagArray, // One-to-many creation
        },
      },
      include: {
        tags: true,
      },
    });

    return res.status(201).json({
      message: "Video uploaded!",
      video: {
        id: video.id,
        title: video.title,
        url: video.videoUrl,
        tags: video.tags.map((t) => t.tag),
        createdAt: video.createdAt,
      },
    });
  } catch (err) {
    console.error("Upload error:", err);
    return res.status(500).json({ error: "Failed to upload video." });
  }
};
