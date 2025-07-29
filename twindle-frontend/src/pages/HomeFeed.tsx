// /pages/HomeFeed.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchVideos } from "../utils/api";

export const HomeFeed = () => {
  const [videos, setVideos] = useState<any[]>([]);

  useEffect(() => {
    const loadVideos = async () => {
      const res = await fetchVideos();
      setVideos(res);
    };
    loadVideos();
  }, []);

  return (
    <div style={{ padding: "1rem" }}>
      <h2>For you page</h2>
      <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))" }}>
        {videos.map((video) => (
          <Link key={video.id} to={`/shorts/${video.id}`}>
            <div style={{ border: "1px solid #ccc", borderRadius: "10px", overflow: "hidden" }}>
              <video src={video.videoUrl} muted width="100%" height="auto" style={{ objectFit: "cover" }} />
              <div style={{ padding: "0.5rem" }}>
                <h4>{video.title}</h4>
                <p>{video.creator.name}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
