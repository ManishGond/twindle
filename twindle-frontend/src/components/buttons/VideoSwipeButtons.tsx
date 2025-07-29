// components/buttons/VideoSwipeButtons.tsx
import { FaChevronCircleUp, FaChevronCircleDown } from "react-icons/fa";
import styles from "../../styles/VideoSwipeButton.module.css";

interface Props {
  onNext: () => void;
  onPrevious: () => void;
  disablePrevious?: boolean;
}

export const VideoSwipeButtons = ({
  onNext,
  onPrevious,
  disablePrevious,
}: Props) => {
  return (
    <div className={styles.actions}>
      <button
        onClick={onPrevious}
        disabled={disablePrevious}
        className={disablePrevious ? styles.disabled : ""}
      >
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
