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

  // Set initial active index on mount
  useEffect(() => {
    if (startVideoId && videos.length) {
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

  const goToNext = () => {
    if (activeIndex < videos.length - 1) {
      setActiveIndex((prev) => prev + 1);
      containerRef.current?.scrollTo({
        top: (activeIndex + 1) * window.innerHeight,
        behavior: "smooth",
      });
    }
  };

  const goToPrevious = () => {
    if (activeIndex > 0) {
      setActiveIndex((prev) => prev - 1);
      containerRef.current?.scrollTo({
        top: (activeIndex - 1) * window.innerHeight,
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
      }}
    >
      {videos.map((video, idx) => (
        <div
          key={video.id}
          style={{
            height: "100vh",
            scrollSnapAlign: "start",
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
                  typeof video.likes === "number"
                    ? video.likes
                    : Array.isArray(video.likes)
                      ? video.likes
                      : 0
                }
                comments={Array.isArray(video.comments) ? video.comments.length : 0}
              />
            </>
          )}
          <VideoCard
            video={video}
            isActive={idx === activeIndex}
            ref={idx === activeIndex ? currentVideoRef : null}
          />
        </div>
      ))}
    </div>
  );
};

export default SwipeContainer;
