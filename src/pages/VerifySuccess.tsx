import { Navigate, useNavigate } from 'react-router-dom';
import { getCurrentUser } from '@/firebase/authService';

const VerifySuccess = () => {
  const user = getCurrentUser();
  const navigate = useNavigate();

  if (!user || user.providerData[0]?.providerId === 'google.com') {
    return <Navigate to="/" replace />;
  }

  if (!user.emailVerified || !localStorage.getItem('emailVerified')) {
    return <Navigate to="/verify-email" replace />;
  }

  const handleDashboard = () => {
    localStorage.removeItem('emailVerified');
    navigate("/", { replace: true });
  };

  return (
    <div className="w-full grid items-center justify-center h-screen bg-green-100">
      <div className="text-center">
        <h1 className="text-2xl text-green-700">¡Verificación exitosa!</h1>
        <button
          onClick={handleDashboard}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mt-4"
        >
          Ir al Dashboard
        </button>
      </div>
    </div>
  );
};

export default VerifySuccess;