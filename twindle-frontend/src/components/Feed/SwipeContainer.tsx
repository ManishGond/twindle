// /components/Feed/SwipeContainer.tsx
import { useEffect, useRef, useState } from "react";
import { useVideoFeed } from "../../hooks/useVideoFeed";
import { VideoCard } from "./VideoCard";
import { VideoSwipeButtons } from "../buttons/VideoSwipeButtons";
import { ActionButtons } from "../buttons/ActionButtons";

type Props = {
  startVideoId?: string;
};

const SwipeContainer = ({ startVideoId }: Props) => {
  const { videos } = useVideoFeed();
  const containerRef = useRef<HTMLDivElement>(null);
  const currentVideoRef = useRef<HTMLVideoElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (startVideoId) {
      const index = videos.findIndex((v) => v.id === startVideoId);
      if (index !== -1) {
        setActiveIndex(index);
        const container = containerRef.current;
        if (container) {
          const videoHeight = container.clientHeight;
          container.scrollTo({ top: index * videoHeight, behavior: "auto" });
        }
      }
    }
  }, [startVideoId, videos]);

  const handleScroll = () => {
    const container = containerRef.current;
    if (!container) return;
    const scrollTop = container.scrollTop;
    const containerHeight = container.clientHeight;
    const newIndex = Math.round(scrollTop / containerHeight);
    if (newIndex !== activeIndex) {
      setActiveIndex(newIndex);
    }
  };

  const handleNext = () => {
    if (activeIndex < videos.length - 1) {
      const nextIndex = activeIndex + 1;
      scrollToIndex(nextIndex);
    }
  };

  const handlePrevious = () => {
    if (activeIndex > 0) {
      const prevIndex = activeIndex - 1;
      scrollToIndex(prevIndex);
    }
  };

  const scrollToIndex = (index: number) => {
    const container = containerRef.current;
    if (container) {
      const videoHeight = container.clientHeight;
      container.scrollTo({ top: index * videoHeight, behavior: "smooth" });
      setActiveIndex(index);
    }
  };

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      style={{
        height: "100vh",
        overflowY: "scroll",
        scrollSnapType: "y mandatory",
      }}
    >
      {videos.map((video, idx) => (
        <div
          key={video.id}
          style={{
            height: "100vh",
            scrollSnapAlign: "start",
            position: "relative", // needed to absolutely position buttons
          }}
        >
          <VideoSwipeButtons onNext={handleNext} onPrevious={handlePrevious} />
          {/* Video UI */}
          <VideoCard
            video={video}
            isActive={idx === activeIndex}
            ref={idx === activeIndex ? currentVideoRef : null}
          />

          <ActionButtons likes={video.likes} comments={video.comments} />
        </div>
      ))}
    </div>
  );
};

export default SwipeContainer;
