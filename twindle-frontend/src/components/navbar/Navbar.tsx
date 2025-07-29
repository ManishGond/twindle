import { useState } from "react";
import styles from "../../styles/Navbar.module.css";
import { FaYoutube, FaUserCircle } from "react-icons/fa";
import { ProfileDropdown } from "../auth/ProfileDropdown";

export const Navbar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  return (
    <nav className={styles.nav}>
      <div className={styles.logo}>
        <FaYoutube color="pink" size={32} />
        <span>Twindle</span>
      </div>
      <input className={styles.search} type="text" placeholder="Search" />
      <div onClick={() => setShowDropdown(!showDropdown)} className={styles.profileIcon}>
        <FaUserCircle size={30} />
        {showDropdown && <ProfileDropdown />}
      </div>
    </nav>
  );
};
