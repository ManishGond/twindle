// hooks/useVideoFeed.tsx
import { useEffect, useState } from "react";
import type { Video } from "../utils/data";

export const useVideoFeed = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMore = async () => {
    // Simulate API delay
    await new Promise((res) => setTimeout(res, 500));
    setVideos((prev) => [...prev, ...videos]);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchMore();
  }, []);

  return { videos, isLoading, fetchMore };
};
