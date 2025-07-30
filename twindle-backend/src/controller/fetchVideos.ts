import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const fetchVideos = async (req: Request, res: Response) => {
  try {
    const videos = await prisma.video.findMany({
      include: {
        tags: true,
        creator: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Prepare clean response
    const formattedVideos = videos.map((video) => ({
      id: video.id,
      title: video.title,
      videoUrl: video.videoUrl, // ✅ Direct Cloudinary URL
      thumbnailUrl: video.thumbnailUrl, // ✅ New field
      tags: video.tags.map((t) => t.tag),
      creator: video.creator,
      createdAt: video.createdAt,
    }));

    res.status(200).json(formattedVideos);
  } catch (error) {
    console.error("Error fetching videos:", error);
    res.status(500).json({ message: "Failed to fetch videos" });
  }
};
