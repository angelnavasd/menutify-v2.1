import { useEffect, useState } from "react";
import { 
  isEmailVerifiedAsync, 
  getCurrentUser, 
  sendVerificationEmail, 
  deleteCurrentUser 
} from "@/firebase/authService";
import { useNavigate, Outlet, Navigate } from "react-router-dom";

const VerifyView = () => {
  const navigate = useNavigate();
  const [isVerified, setIsVerified] = useState(false);
  const [checking, setChecking] = useState(true);
  const user = getCurrentUser();

  // Redirigir al login si el usuario no está autenticado
  if (!user) {
    return <Navigate to="/login" /> 
  }

  useEffect(() => {
    const checkEmailVerification = async () => {
      const emailVerified = await isEmailVerifiedAsync();
      if (emailVerified) {
        setIsVerified(true);
        return;
      }
      setChecking(false);
    };

    checkEmailVerification();

    // Intervalo para verificar si el correo ha sido validado
    const interval = setInterval(() => {
      if (!isVerified) {
        checkEmailVerification();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isVerified]);

  useEffect(() => {
    if (isVerified) {
      navigate("success");
    }
  }, [isVerified, navigate]);

  if (!isVerified && !checking && window.location.pathname.endsWith("/success")) {
    return <Navigate to="/verify-email" />
  }

  const handleChangeEmail = async () => {
    const delCurrentUser = await deleteCurrentUser();
    if (delCurrentUser) {
      navigate("/register");
    }
  };

  const isOnSubroute = window.location.pathname.endsWith("/success");

  return (
    <div className="flex justify-center items-center w-full h-screen bg-slate-800 text-white">
      {!isOnSubroute && (
        <div className="text-center">
          <h1 className="text-2xl mb-4">¡Correo de verificación enviado!</h1>
          <p className="mb-4">
            Por favor, revisa tu correo electrónico y sigue el enlace de verificación para continuar.
          </p>
          <div className="grid gap-4">
            <button className="hover:underline" onClick={handleChangeEmail}>
              ¿Te equivocaste de email?
            </button>
            <button
              className="hover:underline"
              onClick={() => sendVerificationEmail()}
            >
              Reenviar enlace de confirmación
            </button>
          </div>
        </div>
      )}
      <Outlet />
    </div>
  );
};

export default VerifyView;
