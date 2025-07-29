// App.tsx
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./layout/Layout";
import { ShortsFeed } from "./pages/ShortsFeed";
import { HomeFeed } from "./pages/HomeFeed";
import "./styles/App.module.css";
import UploadVideo from "./pages/UploadVideo";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { setUserFromLocalStorage } from "./features/auth/authSlice";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // ⚡ Runs once on app load — checks if there's a valid user in localStorage
    dispatch(setUserFromLocalStorage());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomeFeed />} />
          <Route path="/shorts" element={<ShortsFeed />} />
          <Route path="/shorts/:id" element={<ShortsFeed />} />
          <Route path="/upload" element={<UploadVideo />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
