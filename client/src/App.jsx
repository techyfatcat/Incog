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
import NotFound from "./pages/NotFound";
import SmoothScroll from "./components/SmoothScroll";
import ProtectedRoute from "./components/ProtectedRoutes";

// Helper component to handle conditional Navbar rendering
function Navigation() {
  const location = useLocation();

  // Define all valid paths. 
  // We use a regex check for dynamic routes like /post/123
  const validPaths = ["/", "/auth", "/about", "/resources", "/feed", "/profile", "/settings"];
  const isDynamicPostPath = location.pathname.startsWith("/post/");

  const isKnownRoute = validPaths.includes(location.pathname) || isDynamicPostPath;

  // If the current path doesn't match any of our routes, hide the Navbar
  if (!isKnownRoute) return null;

  return <Navbar />;
}

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

        {/* Navigation is now a child of BrowserRouter so it can use useLocation */}
        <Navigation />

        <SmoothScroll>
          <div className="pt-20 min-h-screen bg-[#e5e5e5] dark:bg-[#080B16] transition-colors duration-500 overflow-x-hidden relative">
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
                <Route path="/profile" element={<Profile />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Route>

              {/* 🚀 404 Fallback - This will now trigger Navigation to return null */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </SmoothScroll>
      </BrowserRouter>
    </ThemeProvider>
  );
}