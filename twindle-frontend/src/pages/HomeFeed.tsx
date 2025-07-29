import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchVideos } from "../utils/api";
import { setVideos } from "../features/videos/videosSlice";
import styles from "../styles/HomeFeed.module.css";
import { Link } from "react-router-dom";
import type { AppDispatch, RootState } from "../store/store";

export const HomeFeed = () => {
  const dispatch = useDispatch<AppDispatch>();
  const videos = useSelector((state: RootState) => state.videos.videos);

  useEffect(() => {
    if (videos.length === 0) {
      const loadVideos = async () => {
        const res = await fetchVideos();
        dispatch(setVideos(res));
      };
      loadVideos();
    }
  }, [dispatch, videos]);

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>For You Page</h2>
      <div className={styles.grid}>
        {videos.map((video) => (
          <Link key={video.id} to={`/shorts/${video.id}`} className={styles.card}>
            <video src={video.videoUrl} muted className={styles.thumbnail} />
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
