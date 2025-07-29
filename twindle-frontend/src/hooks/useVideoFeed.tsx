// hooks/useVideoFeed.tsx
import { useEffect, useState } from "react";
import type { Video } from "../utils/data";
import { fetchVideos } from "../utils/api";

export const useVideoFeed = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMore = async () => {
    setIsLoading(true);
    try {
      const data = await fetchVideos();
      setVideos(data);
    } catch (err) {
      console.error("Failed to fetch videos:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMore();
  }, []);

  return { videos, isLoading, fetchMore };
};
