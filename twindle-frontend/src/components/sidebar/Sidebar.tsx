// Sidebar.tsx

import { Link } from "react-router-dom";
import styles from "../../styles/Sidebar.module.css";
import { FaHome, FaHistory, FaThumbsUp } from "react-icons/fa";
import { MdAppShortcut } from "react-icons/md";
import { RiDashboard2Line } from "react-icons/ri";

export const Sidebar = () => {
  return (
    <div className={styles.sidebar}>
      <div className="flex flex-col justify-between h-full">
        <div>
          <Link to="/" className={styles.sidebarItem}>
            <FaHome size={18} />
            <span>Home</span>
          </Link>
          <Link to="/shorts" className={styles.sidebarItem}>
            <MdAppShortcut size={18} />
            <span>Shorts</span>
          </Link>
          <button className={styles.sidebarItem}>
            <FaHistory size={18} />
            <span>History</span>
          </button>
          <button className={styles.sidebarItem}>
            <FaThumbsUp size={18} />
            <span>Liked</span>
          </button>
        </div>
        <div>
          <Link to="/upload" className={styles.sidebarItem}>
            <RiDashboard2Line size={18} />
            <span>Upload</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
