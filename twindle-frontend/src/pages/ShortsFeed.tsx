import { SwipeContainer } from "../components/Feed/SwipeContainer";
import styles from "../styles/ShortsFeed.module.css";

export const ShortsFeed = () => {
  return (
    <div className={styles.feedWrapper}>
      <SwipeContainer />
    </div>
  );
};
