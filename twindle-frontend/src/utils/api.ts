import axios from "axios";
import type { Video } from "./data";

const BASE_URL = "http://localhost:5000";

export const fetchVideos = async (): Promise<Video[]> => {
  try {
    const res = await axios.get<Video[]>(`${BASE_URL}/api/videos`);
    return res.data;
  } catch (error) {
    console.error("Failed to fetch videos:", error);
    return [];
  }
};

export const uploadVideo = async (formData: FormData, token: string) => {
  try {
    const res = await axios.post(`${BASE_URL}/api/videos/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error("Failed to upload video:", error);
    throw error;
  }
};
