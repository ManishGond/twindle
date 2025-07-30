import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Navbar } from "../components/navbar/Navbar";
import { Sidebar } from "../components/sidebar/Sidebar";
import FloatingChat from "../components/chat/FloatingChat";

export const Layout = () => {
  const location = useLocation();

  // Controls body overflow for Shorts page only
  useEffect(() => {
    if (location.pathname === "/shorts") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [location.pathname]);

  const isSignupPage = location.pathname === "/signup";

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />
      <div style={{ flex: 1, display: "flex", minHeight: 0 }}>
        <Sidebar />
        <div
          style={{
            flex: 1,
            overflowY: isSignupPage ? "auto" : "hidden",
            padding: isSignupPage ? "2rem 1rem" : "0",
          }}
        >
          <Outlet />
        </div>
      </div>
      <FloatingChat />
    </div>
  );
};
