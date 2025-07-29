// components/Feed/VerticalFeed.tsx
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { mockVideos } from "../../utils/data";
import { VideoCard } from "./VideoCard";
import { ActionButtons } from "../buttons/ActionButtons";
import { VideoSwipeButtons } from "../buttons/VideoSwipeButtons";

export const SwipeContainer = () => {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<"up" | "down">("up");
  const touchStartY = useRef<number | null>(null);
  const touchEndY = useRef<number | null>(null);

  const changeIndex = (dir: "up" | "down") => {
    setDirection(dir);
    setIndex((prev) => {
      if (dir === "up") return (prev + 1) % mockVideos.length;
      return prev === 0 ? mockVideos.length - 1 : prev - 1;
    });
  };

  // Mouse wheel
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY > 50) changeIndex("up");
      else if (e.deltaY < -50) changeIndex("down");
    };
    window.addEventListener("wheel", handleWheel);
    return () => window.removeEventListener("wheel", handleWheel);
  }, []);

  // Arrow keys
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") changeIndex("up");
      else if (e.key === "ArrowUp") changeIndex("down");
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  // Touch swipe
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
          <VideoCard video={mockVideos[index]} />
          <ActionButtons
            likes={mockVideos[index].likes}
            comments={mockVideos[index].comments}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
