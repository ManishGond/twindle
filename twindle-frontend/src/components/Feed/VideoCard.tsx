import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "../../styles/VideoCard.module.css";
import { VideoInfo } from "./VideoInfo";
import type { Video } from "../../utils/data";
import {
  MdOutlinePauseCircleFilled,
  MdOutlinePlayCircleFilled,
} from "react-icons/md";

export const VideoCard = ({ video }: { video: Video }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [showIcon, setShowIcon] = useState(false);

  const handleTogglePlay = () => {
    const videoEl = videoRef.current;
    if (!videoEl) return;

    if (videoEl.paused) {
      videoEl.play();
      setIsPaused(false);
    } else {
      videoEl.pause();
      setIsPaused(true);
    }

    // Show play/pause icon temporarily
    setShowIcon(true);
    setTimeout(() => {
      setShowIcon(false);
    }, 1000); // icon disappears after 1s
  };

  return (
    <div className={styles.card} onClick={handleTogglePlay}>
      <video
        ref={videoRef}
        className={styles.video}
        src={video.videoUrl}
        autoPlay
        loop
        muted
        playsInline
      />
      <div className={styles.overlay}>
        <VideoInfo video={video} />
      </div>

      {/* ✅ Animated Icon */}
      <AnimatePresence>
        {showIcon && (
          <motion.div
            key={isPaused ? "play" : "pause"}
            className={styles.playIcon}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.1 }}
          >
            {isPaused ? (
              <MdOutlinePlayCircleFilled size={80} color="white" />
            ) : (
              <MdOutlinePauseCircleFilled size={80} color="white" />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
