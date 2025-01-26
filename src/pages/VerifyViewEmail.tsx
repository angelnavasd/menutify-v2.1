import { useEffect } from "react";
import { isEmailVerifiedAsync, sendVerificationEmail, getCurrentUser, deleteCurrentUser } from "@/firebase/authService";
import { Navigate, useNavigate } from "react-router-dom";

const VerifyView = () => {
  const user = getCurrentUser();
  const navigate = useNavigate();

  if (!user || user.providerData[0]?.providerId === 'google.com') {
    return <Navigate to="/" replace />;
  }

  if(user.emailVerified && localStorage.getItem('emailVerified') === null || user.emailVerified && window.location.pathname.endsWith('/success') && !localStorage.getItem('emailVerified')){
    localStorage.removeItem('emailVerified');
    return <Navigate to="/" replace />;
  }

  if (user.emailVerified && localStorage.getItem('emailVerified') === 'true') {
    return <Navigate to="/verify-email/success" replace />;
  }

  if (!user.emailVerified && window.location.pathname.endsWith('/success')) {
    return <Navigate to="/verify-email" replace />;
  }

  useEffect(() => {
    const checkEmailVerification = async () => {
      const emailVerified = await isEmailVerifiedAsync();
      if (emailVerified) {
        localStorage.setItem('emailVerified', 'true');
        navigate("/verify-email/success", { replace: true });
      }
    };

    const interval = setInterval(checkEmailVerification, 1000);

    return () => clearInterval(interval);
  }, []);

  const deleteUser = async () => {
    const userDel = await deleteCurrentUser()
    if(userDel){
      navigate('/');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Verifica tu correo electrónico
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Por favor, revisa tu bandeja de entrada y haz clic en el enlace de verificación.
          </p>
          <div className="mt-4 grid gap-2 justify-center">
            <button
              onClick={() => sendVerificationEmail()}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Reenviar correo de verificación
            </button>
            <button
              onClick={() => deleteUser()}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Te equivocaste de correo?
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyView;
