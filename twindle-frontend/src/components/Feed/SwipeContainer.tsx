import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { VideoCard } from "./VideoCard";
import { ActionButtons } from "../buttons/ActionButtons";
import { VideoSwipeButtons } from "../buttons/VideoSwipeButtons";
import { fetchVideos } from "../../utils/api";
import type { Video } from "../../utils/data";
import styles from '../../styles/SwipeContainer.module.css'

export const SwipeContainer = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<"up" | "down">("up");
  const [cursor, setCursor] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState(false);

  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const touchStartY = useRef<number | null>(null);
  const touchEndY = useRef<number | null>(null);

  useEffect(() => {
    fetchInitialVideos();
  }, []);

  const fetchInitialVideos = async () => {
    setIsFetching(true);
    const res = await fetchVideos(null);
    setVideos(res.videos);
    setCursor(res.nextCursor);
    setIsFetching(false);
  };

  const fetchMoreVideos = async () => {
    if (isFetching || !cursor) return;
    setIsFetching(true);
    const res = await fetchVideos(cursor);
    setVideos((prev) => [...prev, ...res.videos]);
    setCursor(res.nextCursor);
    setIsFetching(false);
  };

  const changeIndex = (dir: "up" | "down") => {
    setDirection(dir);
    setIndex((prev) => {
      const newIndex = dir === "up" ? prev + 1 : prev - 1;
      return Math.max(0, Math.min(videos.length - 1, newIndex));
    });
  };

  // Pause all videos except current
  useEffect(() => {
    videoRefs.current.forEach((video, i) => {
      if (video) {
        if (i === index) video.play().catch(() => { });
        else video.pause();
      }
    });

    // 👇 Trigger lazy load when 2 from end
    if (videos.length - index <= 3) {
      fetchMoreVideos();
    }
  }, [index]);

  // Swipe detection handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndY.current = e.changedTouches[0].clientY;
    if (!touchStartY.current || !touchEndY.current) return;

    const delta = touchStartY.current - touchEndY.current;
    if (delta > 50) changeIndex("up");
    else if (delta < -50) changeIndex("down");
  };

  const swipeVariants = {
    enter: (dir: "up" | "down") => ({
      y: dir === "up" ? 1000 : -1000,
      opacity: 0,
    }),
    center: { y: 0, opacity: 1 },
    exit: (dir: "up" | "down") => ({
      y: dir === "up" ? -1000 : 1000,
      opacity: 0,
    }),
  };

  if (!videos?.length) {
    return <div className={styles.loading}>Loading videos...</div>;
  }

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{
        height: "100vh",
        width: "100vw",
        background: "black",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={index}
          variants={swipeVariants}
          initial="enter"
          animate="center"
          exit="exit"
          custom={direction}
          transition={{ duration: 0.5 }}
          style={{
            height: "100%",
            width: "100%",
            position: "absolute",
          }}
        >
          <VideoSwipeButtons
            onNext={() => changeIndex("up")}
            onPrevious={() => changeIndex("down")}
          />
          <VideoCard
            ref={(el) => {
              videoRefs.current[index] = el
            }}
            video={videos[index]}
          />
          <ActionButtons
            likes={videos[index].likes}
            comments={videos[index].comments}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
