// src/components/LoadingScreen.tsx
import styles from "../styles/LoadingScreen.module.css";
import twindle_logo_outline from "../assets/twindle-logo-out.png"

const LoadingScreen = () => {
  return (
    <div className={styles.loadingContainer}>
      <img src={twindle_logo_outline} alt="Twindle Logo" className={styles.logoImage} />
      <div className={styles.spinner}></div>
    </div>
  );
};

export default LoadingScreen;
