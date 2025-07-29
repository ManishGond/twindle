// VideoCard.tsx

import { useState, forwardRef, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "../../styles/VideoCard.module.css";
import { VideoInfo } from "./VideoInfo";
import type { Video } from "../../utils/data";
import {
  MdOutlinePauseCircleFilled,
  MdOutlinePlayCircleFilled,
} from "react-icons/md";

type Props = {
  video: Video;
  isActive?: boolean;
};


export const VideoCard = forwardRef<HTMLVideoElement, Props>(
  ({ video, isActive }, ref) => {
    const [isPaused, setIsPaused] = useState(false);
    const [showIcon, setShowIcon] = useState(false);
    const [volume, setVolume] = useState(1); // 0 to 1

    const videoRef = useRef<HTMLVideoElement | null>(null);

    // Merge internal ref and forwarded ref
    useEffect(() => {
      if (ref && typeof ref === "object" && ref !== null) {
        (ref as React.MutableRefObject<HTMLVideoElement | null>).current = videoRef.current;
      }
    }, [ref]);

    // Play/pause based on isActive
    useEffect(() => {
      if (!videoRef.current) return;

      if (isActive) {
        videoRef.current.play().catch(() => { });
        setIsPaused(false);
      } else {
        videoRef.current.pause();
        setIsPaused(true);
      }
    }, [isActive]);

    // Update volume
    useEffect(() => {
      if (videoRef.current) {
        videoRef.current.volume = volume;
        videoRef.current.muted = volume === 0;
      }
    }, [volume]);

    const handleTogglePlay = (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();
      const videoElement = videoRef.current;
      if (!videoElement) return;

      if (videoElement.paused) {
        videoElement.play();
        setIsPaused(false);
      } else {
        videoElement.pause();
        setIsPaused(true);
      }

      setShowIcon(true);
      setTimeout(() => setShowIcon(false), 1000);
    };

    return (
      <div className={styles.card} onClick={handleTogglePlay}>
        <video
          ref={videoRef}
          className={styles.video}
          src={video.videoUrl}
          autoPlay
          loop
          muted={volume === 0}
          playsInline
        />
        <div className={styles.overlay}>
          <VideoInfo video={video} />
        </div>

        {/* 🔊 Volume Slider */}
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className={styles.volumeSlider}
        />

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
  }
);
