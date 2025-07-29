import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchVideos } from "../utils/api";
import styles from "../styles/HomeFeed.module.css";

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
    <div className={styles.container}>
      <h2 className={styles.heading}>For You Page</h2>
      <div className={styles.grid}>
        {videos.map((video) => (
          <Link key={video.id} to={`/shorts/${video.id}`} className={styles.card}>
            <video
              src={video.videoUrl}
              muted
              className={styles.thumbnail}
            />
            <div className={styles.details}>
              <h4 className={styles.title}>{video.title}</h4>
              <p className={styles.creator}>{video.creator.name}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
