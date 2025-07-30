import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import cloudinary from "../utils/cloudinary";
import fs from "fs/promises";

export const uploadVideo = async (req: Request, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[];
    const videoFile = files?.find((file) => file.fieldname === "video");
    const thumbnailFile = files?.find((file) => file.fieldname === "thumbnail");
    const { title, tags } = req.body;
    const creatorId = (req as any).userId;

    if (!videoFile || !title || !creatorId) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    const videoUpload = await cloudinary.uploader.upload(videoFile.path, {
      resource_type: "video",
      folder: "twindle_videos",
    });

    let thumbnailUrl: string;
    let cloudinaryThumbId: string;

    if (thumbnailFile) {
      const thumbUpload = await cloudinary.uploader.upload(thumbnailFile.path, {
        resource_type: "image",
        folder: "twindle_thumbnails",
      });
      thumbnailUrl = thumbUpload.secure_url;
      cloudinaryThumbId = thumbUpload.public_id;

      await fs.unlink(thumbnailFile.path);
    } else {
      thumbnailUrl = cloudinary.url(`${videoUpload.public_id}.jpg`, {
        resource_type: "video",
        format: "jpg",
        start_offset: "1",
        secure: true,
      });
      cloudinaryThumbId = `${videoUpload.public_id}.jpg`;
    }

    await fs.unlink(videoFile.path);

    const tagArray =
      typeof tags === "string"
        ? tags.split(",").map((tag) => ({ tag: tag.trim() }))
        : [];

    const video = await prisma.video.create({
      data: {
        title,
        videoUrl: videoUpload.secure_url,
        cloudinaryPublicId: videoUpload.public_id,
        thumbnailUrl,
        cloudinaryThumbId,
        creator: {
          connect: { id: creatorId },
        },
        tags: {
          create: tagArray,
        },
      },
      include: {
        tags: true,
        creator: true
      },
    });

    // ✅ Fetch creator info separately
    const creator = await prisma.user.findUnique({
      where: { id: creatorId },
      select: {
        id: true,
        name: true,
        avatar: true,
      },
    });
    return res.status(201).json(video);
  } catch (err) {
    console.error("❌ Upload error:", err);
    return res.status(500).json({ error: "Failed to upload video." });
  }
};
