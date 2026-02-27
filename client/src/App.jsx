import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { ThemeProvider } from "./context/ThemeContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import CommunityPage from "./pages/CommunityPage";
import PostDetail from "./pages/PostDetail";
import Resources from "./pages/Resources";
import Profile from "./pages/Profile";
import SettingsPage from "./pages/Settings";
import About from "./pages/About";
import SmoothScroll from "./components/SmoothScroll";
import ProtectedRoute from "./components/ProtectedRoutes";

// Note: CreatePostModal is likely imported and used inside your Navbar 
// or CommunityPage now, so we don't need to import it here unless 
// you're managing its global state at the App level.

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Navbar />

        <SmoothScroll>
          <div className="pt-20 min-h-screen bg-[#e5e5e5] dark:bg-[#080B16] transition-colors duration-500 overflow-x-hidden">
            <Routes>
              {/* 🔓 Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/about" element={<About />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/feed" element={<CommunityPage />} />

              {/* 🔒 Protected Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/post/:id" element={<PostDetail />} />
                {/* The "/create-post" Route was removed because 
                   it is now a Modal, not a standalone page. 
                */}
                <Route path="/profile" element={<Profile />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Route>

              {/* 404 Fallback */}
              <Route path="*" element={<div className="text-center py-20 dark:text-white font-bold">404 - Page Not Found</div>} />
            </Routes>
          </div>
        </SmoothScroll>
      </BrowserRouter>
    </ThemeProvider>
  );
}