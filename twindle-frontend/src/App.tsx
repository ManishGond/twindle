// App.tsx
import { useEffect, useState } from "react";
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
import LoadingScreen from "./components/LoadingScreen";

function App() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dispatch(setUserFromLocalStorage());

    // Delay of 3 seconds
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [dispatch]);

  if (loading) {
    return <LoadingScreen />;
  }

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
