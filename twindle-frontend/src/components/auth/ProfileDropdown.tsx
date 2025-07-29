import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { logout } from "../../features/auth/authSlice";
import styles from "../../styles/ProfileDropdown.module.css";
import type { RootState } from "../../store/store";
import { FaSignOutAlt, FaSignInAlt, FaUserPlus } from "react-icons/fa";

export const ProfileDropdown = () => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  return (
    <div className={styles.dropdown}>
      {isAuthenticated ? (
        <>
          <p className={styles.welcome}>👋 Hello, {user?.name || "User"}</p>
          <button className={styles.btn} onClick={() => dispatch(logout())}>
            <FaSignOutAlt /> Logout
          </button>
        </>
      ) : (
        <>
          <Link to="/login" className={styles.btn}>
            <FaSignInAlt /> Login
          </Link>
          <Link to="/signup" className={styles.btn}>
            <FaUserPlus /> Sign Up
          </Link>
        </>
      )}
    </div>
  );
};
