import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchVideos } from "../utils/api";
import { setVideos, clearVideos } from "../features/videos/videosSlice";
import styles from "../styles/HomeFeed.module.css";
import { Link } from "react-router-dom";
import type { AppDispatch, RootState } from "../store/store";

const ONE_DAY = 24 * 60 * 60 * 1000;

export const HomeFeed = () => {
  const dispatch = useDispatch<AppDispatch>();
  const videos = useSelector((state: RootState) => state.videos.videos);
  const lastUpdated = useSelector((state: RootState) => state.videos.lastUpdated);

  // Clear videos if expired
  useEffect(() => {
    const isExpired = !!lastUpdated && Date.now() - lastUpdated > ONE_DAY;

    if (isExpired) {
      dispatch(clearVideos());
    }
  }, [dispatch, lastUpdated]);

  // Fetch videos if empty
  useEffect(() => {
    if (videos.length === 0) {
      const loadVideos = async () => {
        const res = await fetchVideos();
        dispatch(setVideos(res));
      };

      loadVideos();
    }
  }, [dispatch, videos.length]);

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>For You Page</h2>
      <div className={styles.grid}>
        {videos.map((video) => (
          <Link key={video.id} to={`/shorts/${video.id}`} className={styles.card}>
            <img
              src={video.thumbnailUrl}
              alt={video.title}
              className={styles.thumbnail}
            />
            <div className={styles.details}>
              <h4 className={styles.title}>{video.title}</h4>
              <p className={styles.creator}>
                {video.creator?.name ?? "Unknown Creator"}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
