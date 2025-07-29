import styles from "../../styles/Navbar.module.css";
import { FaYoutube, FaUserCircle } from "react-icons/fa";

export const Navbar = () => {
  return (
    <nav className={styles.nav}>
      <div className={styles.logo}>
        <FaYoutube color="pink" size={32} />
        <span>Twindle</span>
      </div>
      <input className={styles.search} type="text" placeholder="Search" />
      <FaUserCircle className={styles.profileIcon} size={30} />
    </nav>
  );
};
