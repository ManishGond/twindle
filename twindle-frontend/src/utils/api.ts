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
