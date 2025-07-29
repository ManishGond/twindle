// utils/auth.ts
export const getAuth = () => {
  const authData = localStorage.getItem("auth");
  if (!authData) return null;

  try {
    return JSON.parse(authData); // Contains token, user, etc.
  } catch (err) {
    console.error("Failed to parse auth data:", err);
    return null;
  }
};
