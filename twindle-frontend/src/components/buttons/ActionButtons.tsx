// components/buttons/ActionButtons.tsx
import { useState } from "react";
import {
  BiDislike,
  BiLike,
  BiSolidDislike,
  BiSolidLike,
} from "react-icons/bi";
import { FaCommentDots, FaShare, FaMagic } from "react-icons/fa";
import styles from "../../styles/ActionButton.module.css";

export const ActionButtons = ({
  likes,
  comments,
}: {
  likes: number;
  comments: number;
}) => {
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);

  const toggleLike = () => {
    setLiked(!liked);
    if (disliked) setDisliked(false);
  };

  const toggleDislike = () => {
    setDisliked(!disliked);
    if (liked) setLiked(false);
  };

  return (
    <div className={styles.actions}>
      <button onClick={toggleLike} className={liked ? styles.active : ""}>
        {liked ? <BiSolidLike size={22} /> : <BiLike size={22} />}
        <span>{liked ? likes + 1 : likes}</span>
      </button>

      <button onClick={toggleDislike} className={disliked ? styles.active : ""}>
        {disliked ? <BiSolidDislike size={22} /> : <BiDislike size={22} />}
        <span>{disliked ? likes - 1 : likes}</span>
      </button>

      <button>
        <FaCommentDots size={20} />
        <span>{comments}</span>
      </button>

      <button>
        <FaShare size={18} />
        <span>Share</span>
      </button>

      <button>
        <FaMagic size={20} />
        <span>Curate</span>
      </button>
    </div>
  );
};
