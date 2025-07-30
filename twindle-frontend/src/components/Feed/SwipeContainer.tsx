import { useEffect, useRef, useState } from "react";
import { useVideoFeed } from "../../hooks/useVideoFeed";
import { VideoCard } from "./VideoCard";
import { VideoSwipeButtons } from "../buttons/VideoSwipeButtons";
import { ActionButtons } from "../buttons/ActionButtons";

type Props = {
  startVideoId?: string;
};

const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const SwipeContainer = ({ startVideoId }: Props) => {
  const { videos: originalVideos } = useVideoFeed();
  const containerRef = useRef<HTMLDivElement>(null);
  const currentVideoRef = useRef<HTMLVideoElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [videoList, setVideoList] = useState(() => shuffleArray(originalVideos));

  // Reshuffle on new video feed
  useEffect(() => {
    if (originalVideos.length) {
      setVideoList(shuffleArray(originalVideos));
    }
  }, [originalVideos]);

  // Set initial index if startVideoId is passed
  useEffect(() => {
    if (startVideoId && videoList.length) {
      const index = videoList.findIndex((v) => v.id === startVideoId);
      if (index !== -1) {
        setActiveIndex(index);
        const container = containerRef.current;
        if (container) {
          const videoHeight = container.clientHeight;
          container.scrollTo({ top: index * videoHeight, behavior: "auto" });
        }
      }
    }
  }, [startVideoId, videoList]);

  // Update activeIndex on scroll
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollTop = container.scrollTop;
          const index = Math.round(scrollTop / window.innerHeight);
          if (index !== activeIndex) {
            setActiveIndex(index);
          }

          // 🟡 Infinite Load Trigger
          if (index >= videoList.length - 2) {
            setVideoList((prev) => [...prev, ...shuffleArray(originalVideos)]);
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [activeIndex, videoList, originalVideos]);

  // Keyboard navigation (Arrow Up / Down)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        goToNext();
      } else if (e.key === "ArrowUp") {
        goToPrevious();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex]);

  const goToNext = () => {
    if (activeIndex < videoList.length - 1) {
      const newIndex = activeIndex + 1;
      setActiveIndex(newIndex);
      containerRef.current?.scrollTo({
        top: newIndex * window.innerHeight,
        behavior: "smooth",
      });
    }
  };

  const goToPrevious = () => {
    if (activeIndex > 0) {
      const newIndex = activeIndex - 1;
      setActiveIndex(newIndex);
      containerRef.current?.scrollTo({
        top: newIndex * window.innerHeight,
        behavior: "smooth",
      });
    }
  };

  return (
    <div
      ref={containerRef}
      style={{
        height: "100vh",
        overflowY: "scroll",
        scrollSnapType: "y mandatory",
        scrollBehavior: "smooth",
        overscrollBehaviorY: "contain",
      }}
    >
      {videoList.map((video, idx) => (
        <div
          key={`${video.id}-${idx}`}
          style={{
            height: "100vh",
            scrollSnapAlign: "start",
            position: "relative",
            backgroundColor: "black",
          }}
        >
          {idx === activeIndex && (
            <>
              <VideoSwipeButtons
                onNext={goToNext}
                onPrevious={goToPrevious}
                disablePrevious={activeIndex === 0}
              />
              <ActionButtons
                likes={
                  Array.isArray(video.likes) ? video.likes.length : video.likes ?? 0
                }
                comments={
                  Array.isArray(video.comments)
                    ? video.comments.length
                    : video.comments ?? 0
                }
              />
              <VideoCard video={video} isActive ref={currentVideoRef} />
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default SwipeContainer;
