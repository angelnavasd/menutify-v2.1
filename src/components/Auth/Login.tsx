import React, { useState, useRef, useEffect } from 'react';
import { loginWithEmailAndPassword, loginWithGoogle, sendEmailResetPassword } from '@/firebase/authService'; 
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const Login: React.FC = () => {
  const { currentUser } = useAuth();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const loginEmailPassButton = useRef<HTMLButtonElement>(null)
  const loginGoogleButton = useRef<HTMLButtonElement>(null)
  const [resetPassword, setResetPassword] = useState<boolean>(false);

  const navigate = useNavigate();

  useEffect(() => {
    if(resetPassword){
      setEmail('')
    }
  },[resetPassword])

  if (currentUser) {
    return <Navigate to="/" />;
  }

  const handleRegister = () => {
    navigate('/register');
  }

  const sendEmailResetPass = () => {
    if(email.length > 0){
      sendEmailResetPassword(email)
    }
  }

  const handleLogin = async (e: React.MouseEvent) => {
    const clickedButton = e.target as HTMLButtonElement;

    if(clickedButton === loginEmailPassButton.current){
      setLoading(true);
      try {
        const token = await loginWithEmailAndPassword(email, password);
        console.log('Usuario autenticado:', token);
        setLoading(true);
        setError(null);
        return
      } catch (err) {
        setError('Credenciales incorrectas o error en la autenticación');
      } finally {
        setLoading(false);
      }
    }

    if(clickedButton === loginGoogleButton.current){
      const token = await loginWithGoogle();
      console.log('Usuario autenticado:', token);
    }
   
  };

  return (
    <>
    
      <div className='grid justify-center items-center'>
        {!resetPassword ? <><h2>Login</h2></> : <><h2>Recuperar contraseña</h2></>}
        {!resetPassword 
          ? 
          (<>
            <div className='w-full grid gap-4 pb-4'>
              <input
                className='px-2 py-2'
                type="email"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
              className='w-full px-2 py-2'
                type="text"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            </>) 
          : 
          (<>

          <div className='w-full grid gap-4 pb-4'>
            <input
              className='px-2 py-2'
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          </>)}
          
        {!resetPassword ? 
        <>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <button onClick={handleLogin} ref={loginEmailPassButton} disabled={loading}>
            {loading ? 'Cargando...' : 'Iniciar sesión'}
          </button>

          <button onClick={handleLogin} ref={loginGoogleButton} disabled={loading}>
            {loading ? 'Cargando...' : 'Iniciar sesión con google'}
          </button>
        </> : 
        <>
          <button className={`${email.length === 0 ? 'cursor-not-allowed text-gray-400' : ''}`} onClick={sendEmailResetPass} ref={loginEmailPassButton} disabled={loading}>
            {loading ? 'Cargando...' : 'Enviar mail'}
          </button>
        </>}
        

        <div className='py-4 text-center gap-4'>
        {!resetPassword ? 
        <>
         <button className='font-normal py-2 px-2 border border-red-500' onClick={() => setResetPassword(true)}>
            Recuperar contraseña
            </button> 
        </> : 
        <>
           <button className='font-normal py-2 px-2 border border-red-500' onClick={() => setResetPassword(false)}>
            Volver
            </button>
        </>}
         
          <p>No tenes cuenta ? 
            <button className='font-bold py-2 px-2 hover:underline ml-1' onClick={(handleRegister)}>
            registrarse
            </button> 
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
