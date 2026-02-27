import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
    // Check if the token exists in localStorage
    const token = localStorage.getItem("token");

    // If there is no token, redirect to the auth page
    if (!token) {
        return <Navigate to="/auth" replace />;
    }

    // If the token exists, render the child routes (the "Outlet")
    return <Outlet />;
};

export default ProtectedRoute;