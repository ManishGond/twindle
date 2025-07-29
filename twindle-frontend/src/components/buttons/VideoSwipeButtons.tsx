// components/buttons/VideoSwipeButtons.tsx
import { FaChevronCircleUp, FaChevronCircleDown } from "react-icons/fa";
import styles from "../../styles/VideoSwipeButton.module.css";

interface Props {
  onNext: () => void;
  onPrevious: () => void;
}

export const VideoSwipeButtons = ({ onNext, onPrevious }: Props) => {
  return (
    <div className={styles.actions}>
      <button onClick={onPrevious}>
        <FaChevronCircleUp size={20} />
        <span>Previous</span>
      </button>

      <button onClick={onNext}>
        <FaChevronCircleDown size={20} />
        <span>Next</span>
      </button>
    </div>
  );
};
