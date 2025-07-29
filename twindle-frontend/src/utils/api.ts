import axios from "axios";
import type { Video } from "./data";

interface FetchVideoResponse {
  videos: Video[];
  nextCursor: string | null;
}

export const fetchVideos = async (
  cursor: string | null
): Promise<FetchVideoResponse> => {
  try {
    const response = await axios.get("/api/videos", {
      params: cursor ? { cursor } : {},
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching videos:", error);
    return { videos: [], nextCursor: null };
  }
};
