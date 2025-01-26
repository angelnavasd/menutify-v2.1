import React, {ReactNode, useEffect, useState} from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { isEmailVerifiedAsync } from "@/firebase/authService";

const ProtectedRoute: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isVerified, setIsVerified] = useState<boolean | null>(null); // null: todavía cargando
  const { currentUser } = useAuth();


  useEffect(() => {
    const checkEmailVerification = async () => {
      if (currentUser) {
        const emailVerified = await isEmailVerifiedAsync();
        setIsVerified(emailVerified);
      } else {
        setIsVerified(null);
      }
    };

    checkEmailVerification();

  }, [currentUser]);

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  if (isVerified === false) {
    return <Navigate to="/verify-email" replace />;
  } 


  return <>{children}</>;
};

export default ProtectedRoute;

