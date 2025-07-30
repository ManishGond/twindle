import { useState } from "react";
import styles from "../../styles/Navbar.module.css";
import { FaUserCircle } from "react-icons/fa";
import { ProfileDropdown } from "../auth/ProfileDropdown";
import twindle from "../../assets/twindle-logo.png"

export const Navbar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  return (
    <nav className={styles.nav}>
      <div className={styles.logo}>
        <img
          src={twindle}
          alt="Twindle Logo"
          className={styles.logoImage}
        />
      </div>
      <input className={styles.search} type="text" placeholder="Search" />
      <div onClick={() => setShowDropdown(!showDropdown)} className={styles.profileIcon}>
        <FaUserCircle size={30} />
        {showDropdown && <ProfileDropdown />}
      </div>
    </nav>
  );
};
