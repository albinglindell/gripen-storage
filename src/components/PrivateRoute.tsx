import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import LoadingSpinner from "./LoadingSpinner";

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { currentUser, hasProfile, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!currentUser) {
    return <Navigate to="/" />;
  }

  // If user doesn't have a profile and is not on the startup page, redirect to startup
  if (!hasProfile && location.pathname !== "/startup") {
    return <Navigate to="/startup" />;
  }

  // If user has a profile and is on the startup page, redirect to dashboard
  if (hasProfile && location.pathname === "/startup") {
    return <Navigate to="/dashboard" />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
