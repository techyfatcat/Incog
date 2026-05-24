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
import InternshipPage from "./components/PreparationOS/Internships/InternshipGrid";
import JoinGroup from "./pages/JoinGroup";

// 🔥 NEW IMPORTS
import Groups from "./pages/Groups";
import Chat from "./pages/Chat";

import MockInterview from "./pages/MockInterview";
import InterviewRoom from "./pages/InterviewRoom";
import InterviewReport from "./pages/InterviewReport";

// Helper component to handle conditional Navbar rendering
function Navigation() {
  const location = useLocation();

  const validPaths = [
    "/",
    "/auth",
    "/about",
    "/resources",
    "/feed",
    "/profile",
    "/settings",
    "/groups", // ✅ ADD
    "/mock-interview",
  ];

  const isDynamicPostPath = location.pathname.startsWith("/post/");
  const isDynamicChatPath = location.pathname.startsWith("/chat/"); // ✅ ADD
  const isInterviewSessionPath =
    location.pathname.startsWith("/mock-interview/session/");

  const isInterviewReportPath =
    location.pathname.startsWith("/mock-interview/report/");

  const isKnownRoute =
    validPaths.includes(location.pathname) ||
    isDynamicPostPath ||
    isDynamicChatPath ||
    isInterviewSessionPath ||
    isInterviewReportPath;

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
              <Route path="/mock-interview" element={<MockInterview />} />

              <Route
                path="/mock-interview/room"
                element={<InterviewRoom />}
              />

              <Route
                path="/mock-interview/session/:id"
                element={<InterviewRoom />}
              />

              <Route
                path="/mock-interview/report/:id"
                element={<InterviewReport />}
              />
              {/* 🔒 Protected Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/post/:id" element={<PostDetail />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/settings" element={<SettingsPage />} />

                {/* 🔥 NEW GROUP FEATURE */}
                {/* <Route path="/groups" element={<Groups />} />
                <Route path="/chat/:groupId" element={<Chat />} />
                <Route path="/join/:code" element={<JoinGroup />} /> */}
              </Route>

              {/* 🚀 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </SmoothScroll>
      </BrowserRouter>
    </ThemeProvider>
  );
}