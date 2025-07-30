// src/components/LoadingScreen.tsx
import styles from "../styles/LoadingScreen.module.css";

const LoadingScreen = () => {
  return (
    <div className={styles.loadingContainer}>
      <h1 className={styles.logo}>Twindle</h1>
      <div className={styles.spinner}></div>
    </div>
  );
};

export default LoadingScreen;
