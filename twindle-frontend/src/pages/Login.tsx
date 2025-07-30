import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import styles from "../styles/AuthForm.module.css";

import { loginUser } from "../utils/api";
import { login } from "../features/auth/authSlice";
import type { RootState } from "../store/store";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) navigate("/");
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await loginUser(form.email, form.password);
      dispatch(login(res));
      navigate("/");
    } catch (err) {
      console.error("Login error:", err);
      alert("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Welcome Back 👋</h2>
        <p className={styles.subtitle}>Login to your account</p>
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="email"
            placeholder="Email address"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className={styles.input}
          />
          <input
            type="password"
            placeholder="Password"
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className={styles.input}
          />
          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
