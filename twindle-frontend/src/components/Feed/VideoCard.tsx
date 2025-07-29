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
    const [volume, setVolume] = useState(1);
    const [loading, setLoading] = useState(true);

    const videoRef = useRef<HTMLVideoElement | null>(null);

    // Attach internal ref to parent ref
    useEffect(() => {
      if (ref && typeof ref === "object" && ref !== null) {
        (ref as React.MutableRefObject<HTMLVideoElement | null>).current =
          videoRef.current;
      }
    }, [ref]);

    // Auto-play when active and ready
    useEffect(() => {
      if (!videoRef.current) return;

      if (isActive) {
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.then(() => setIsPaused(false)).catch(() => { });
        }
      } else {
        videoRef.current.pause();
        setIsPaused(true);
      }
    }, [isActive]);

    // Set volume/mute
    useEffect(() => {
      if (videoRef.current) {
        videoRef.current.volume = volume;
        videoRef.current.muted = volume === 0;
      }
    }, [volume]);

    // Spinner until video is ready
    const handleCanPlay = () => {
      setLoading(false);
    };

    // Tap to play/pause
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
        {loading && (
          <div className={styles.spinnerWrapper}>
            <div className={styles.spinner} />
          </div>
        )}

        <video
          ref={videoRef}
          className={styles.video}
          src={video.videoUrl}
          autoPlay
          loop
          playsInline
          muted={volume === 0}
          onCanPlay={handleCanPlay}
        />

        <div className={styles.overlay}>
          <VideoInfo video={video} />
        </div>

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
