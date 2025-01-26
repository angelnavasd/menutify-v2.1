import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ProtectedRoute: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  if (currentUser.providerData[0]?.providerId === 'google.com') {
    return <>{children}</>;
  }

  if (currentUser.emailVerified) {
    return <>{children}</>;
  }

  return <Navigate to="/verify-email" replace />;
};

export default ProtectedRoute;
