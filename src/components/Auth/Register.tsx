import React, { useState, useRef, useEffect } from 'react';
import {
    registerWithEmailAndPassword,
    registerWithGoogle } from '@/firebase/authService'; 
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from "lucide-react";

const Register: React.FC = () => {
  const { currentUser } = useAuth();
  const [nombre, setNombre] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [rePassword, setRePassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const registerEmailPassButton = useRef<HTMLButtonElement>(null)
  const registerGoogleButton = useRef<HTMLButtonElement>(null)
  const [readyRegister, setReadyRegister] = useState<boolean>(false);

  const navigate = useNavigate();

  useEffect(() => {
    if(password === rePassword && password.length > 0){
        setReadyRegister(true)
    } else {
        setReadyRegister(false)
    }
  }, [password,rePassword])

  if (currentUser) {
    return <Navigate to="/verify-email" />;
  } 

  const handleLogin = () => {
    navigate('/login');
  }

  const handleRegister = async (e: React.MouseEvent) => {
    const clickedButton = e.target as HTMLButtonElement;

    if(clickedButton === registerEmailPassButton.current){
      setLoading(true);
      try {
        await registerWithEmailAndPassword(email, password, nombre);
        setLoading(true);
        setError(null);
        return
      } catch (err) {
        console.log(err)
        setError('Credenciales incorrectas o error en la autenticación');
      } finally {
        setLoading(false);
      }
    }

    if(clickedButton === registerGoogleButton.current){
      try {
        await registerWithGoogle();
      } catch (error) {
        console.error("Error en registro con Google:", error);
      }
    }
  };

  return (
    <div className='grid justify-center items-center'>
      <h2>Register</h2>
        <div className='w-full grid gap-4 pb-4'>
        <input
          className='px-2 py-2'
          type="text"
          placeholder="Nombres"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />

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
        <input
          className='px-2 py-2'
          type="email"
          placeholder="Confirmar contraseña"
          value={rePassword}
          onChange={(e) => setRePassword(e.target.value)}
        />
      </div>
      
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button className={`${!readyRegister ? 'text-gray-400' : ''}`} onClick={handleRegister} ref={registerEmailPassButton} disabled={!readyRegister}>
        {loading ? (<>
            <div className='flex justify-center gap-3'>
              <p>Cargando..</p>
                <Loader2></Loader2>
            </div>
                </>) 
                : (<>registrarse</>)
                }
      </button>

      <button onClick={handleRegister} ref={registerGoogleButton} disabled={loading}>
        Registrarse con google
      </button>

      <p>Ya tenes cuenta ? 
          <button className='font-bold py-2 px-2 hover:underline ml-1' onClick={handleLogin}>
          Iniciar sesion
          </button> 
        </p>
    </div>
  );
};

export default Register;
