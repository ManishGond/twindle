import { useState } from "react";
import styles from "../../styles/VideoInfo.module.css";
import type { Video } from "../../utils/data";
import { motion } from "framer-motion";

export const VideoInfo = ({ video }: { video: Video }) => {
  const [isFollowing, setIsFollowing] = useState(false);

  const handleFollowClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIsFollowing((prev) => !prev);
    // TODO: Call follow/unfollow API
  };

  const avatarUrl =
    video.creator?.avatar && video.creator.avatar !== ""
      ? `http://localhost:5000/uploads/${video.creator.avatar}`
      : "defaultAvatar";

  return (
    <div className={styles.info}>
      <img
        src={avatarUrl}
        alt={video.creator.name}
        className={styles.avatar}
      />
      <div>
        <p className={styles.name}>@{video.creator.name}</p>
        <p className={styles.title}>{video.title}</p>
      </div>

      <motion.button
        className={styles.follow}
        onClick={handleFollowClick}
        animate={{
          backgroundColor: isFollowing ? "#fff" : "#9a76da",
          color: isFollowing ? "#000" : "#fff",
          width: isFollowing ? "110px" : "80px",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {isFollowing ? "Following" : "Follow"}
      </motion.button>
    </div>
  );
};
