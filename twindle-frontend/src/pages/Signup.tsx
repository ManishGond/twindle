import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../features/auth/authSlice";
import type { RootState } from "../store/store";
import styles from "../styles/AuthForm.module.css";
import { signupUser } from "../utils/api";

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    isCreator: false,
    isCurator: false,
    avatar: null as File | null,
  });

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) navigate("/");
  }, [isAuthenticated, navigate]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm((prev) => ({ ...prev, avatar: file }));
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("email", form.email);
      formData.append("password", form.password);
      formData.append("isCreator", String(form.isCreator));
      formData.append("isCurator", String(form.isCurator));
      if (form.avatar) formData.append("avatar", form.avatar);

      const res = await signupUser(formData); // ✅ from api.ts
      dispatch(login(res));
      navigate("/");
    } catch (err) {
      console.error("Signup error:", err);
      alert("Signup failed. Please try again.");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Create Account</h2>
        <p className={styles.subtitle}>Join as a Creator or Curator or both</p>

        <form onSubmit={handleSubmit} encType="multipart/form-data" className={styles.form}>
          <input
            type="text"
            placeholder="Full Name"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className={styles.input}
          />

          <input
            type="email"
            placeholder="Email Address"
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

          <input
            type="password"
            placeholder="Confirm Password"
            required
            value={form.confirmPassword}
            onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
            className={styles.input}
          />

          <div className={styles.checkboxGroup}>
            <label>
              <input
                type="checkbox"
                checked={form.isCreator}
                onChange={(e) => setForm({ ...form, isCreator: e.target.checked })}
              />
              Creator
            </label>
            <label>
              <input
                type="checkbox"
                checked={form.isCurator}
                onChange={(e) => setForm({ ...form, isCurator: e.target.checked })}
              />
              Curator
            </label>
          </div>

          <div className={styles.avatarSection}>
            <label className={styles.uploadLabel}>Upload Avatar</label>
            <input type="file" accept="image/*" onChange={handleAvatarChange} />
            {avatarPreview && (
              <img src={avatarPreview} alt="Preview" className={styles.avatarPreview} />
            )}
          </div>

          <button type="submit" className={styles.button}>
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
