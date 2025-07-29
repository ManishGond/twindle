import { useEffect, useState } from "react";
// import { fetchAllVideos } from "../utils/api"; // hypothetical function
import type { Video } from "../utils/data";
import { VideoCard } from "../components/Feed/VideoCard";

export const HomeFeed = () => {
  const [videos, setVideos] = useState<Video[]>([]);

  useEffect(() => {
    // fetchAllVideos().then(setVideos);
  }, []);

  return (
    <div style={{ padding: "1rem" }}>
      <h2 style={{ color: "white", marginBottom: "1rem" }}>All Videos</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {videos.map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>
    </div>
  );
};
