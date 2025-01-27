import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  EmailAuthProvider, 
  reauthenticateWithCredential,
  User } from 'firebase/auth';
import { db } from "@/firebase/config";
import { addUser, getUser } from '@/services/userService';
import { authToken } from '@/types/auth'
import { auth } from './config';
import { doc, deleteDoc } from 'firebase/firestore';

export const loginWithEmailAndPassword = async (email: string, password: string): Promise<boolean> => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const token = await userCredential.user.getIdToken()
  const user = userCredential.user;
  if(user){
    const idToken = { token }
    setIdToken(idToken)
    return true;
  } else {
    return false;
  }
};

export const loginWithGoogle = async (): Promise<boolean> => {
  const provider = new GoogleAuthProvider(); 
  const result = await signInWithPopup(auth, provider);  
  const token = await result.user.getIdToken()
  const user = result.user;
  if(user){
    const idToken = { token }
    setIdToken(idToken)
    return true;
  } else {
    return false;
  }
};

export const registerWithEmailAndPassword = async (email: string, password: string, nombres: string, numero: string,): Promise<boolean> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    const token = await userCredential.user.getIdToken();
    const idToken = { token };
    setIdToken(idToken);

    const user = userCredential.user;

    if (user) {
      await addUser(email, password, nombres, numero, true);

      await sendEmailVerification(user);

      return true;
    }
    return false;
  } catch (error: any) {
    console.error("Error en registro:", error);
    if (auth.currentUser) {
      try {
        await auth.currentUser.delete();
      } catch (deleteError) {
        console.error("Error borrando usuario después de fallo:", deleteError);
      }
    }
    throw error;
  }
};

export const registerWithGoogle = async (): Promise<{success: boolean, isGoogleUser: boolean}> => {
  const provider = new GoogleAuthProvider(); 
  const result = await signInWithPopup(auth, provider);
  const user = result.user

  if(user){
    const token = await user.getIdToken()
    const idToken = {token, provider: 'google'}  
    setIdToken(idToken)
    const userExists = await getUser(user.uid)
    if(userExists == null){
      await addUser(user.email!, 'google', user.displayName!, user.phoneNumber!, true);
    }
    return { success: true, isGoogleUser: true }
  } else {
    return { success: false, isGoogleUser: false }
  }
}

export const logout = async (): Promise<void> => {
  document.cookie = `token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; secure; SameSite=Strict`; 
  localStorage.clear();
  sessionStorage.clear();
  await signOut(auth);
};

export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

export const sendEmailResetPassword = async (email: string): Promise<string> => {
  try{
    await sendPasswordResetEmail(auth, email)
    return 'Correo enviado'
  } catch(error: any){
    return `${error.message}`
  }
}

export const sendVerificationEmail = async (): Promise<void> => {
  try {
    if (auth.currentUser) {
        await sendEmailVerification(auth.currentUser);
        console.log(auth.currentUser)
        console.log("Correo de verificación enviado.");
    } else {
        console.log("No hay usuario autenticado.");
    }
  } catch (error) {
      console.error("Error al enviar el correo de verificación:", error);
  }
}

export const isEmailVerifiedAsync = async () => {
  const user = auth.currentUser;
  if (user) {
    try {
      // Forzar recarga del usuario para obtener el estado más reciente
      await user.reload();
      return user.emailVerified;
    } catch (error) {
      console.error("Error checking email verification:", error);
      return false;
    }
  }
  return false;
};

/**
 * Reautenticar al usuario actual utilizando email y contraseña.
 * Esto es necesario para operaciones sensibles como eliminar la cuenta.
 * 
 * @param email 
 * @param password 
 * @throws
 */
const reauthenticateUser = async (email: string, password: string): Promise<void|boolean> => {
  const currentUser = auth.currentUser;

  if (!currentUser) {
    throw new Error("No hay un usuario autenticado.");
  }

  try {
    const credential = EmailAuthProvider.credential(email, password);

    await reauthenticateWithCredential(currentUser, credential);
    return true

  } catch (error: any) {
    throw new Error("Error en la reautenticación: " + error.message);
  }
};

//Solo deletea usuario cuando el token no pasa mucho tiempo
//si pasa mucho tiempo ya no deja eliminar la cuenta por lo que 
//firebase pide que reautenticar y es un quilombo
export const deleteCurrentUser = async (): Promise<boolean> => {
  try {
    const currentUser = auth.currentUser;

    if (currentUser) {
      try {
        await currentUser.delete();
        console.log('User deleted successfully');
      } catch (error: any) {
        console.error('Error deleting user:', error);
        throw new Error('Error al borrar usuario: ' + error.message);
      }
    } else {
      throw new Error('No user is currently signed in.');
    }

    const uid = currentUser.uid;

    try {
      const userRef = doc(db, "users", uid);
      await deleteDoc(userRef);
    } catch (dbError) {
      console.error("Error borrando de la base de datos:", dbError);
    }

    await logout();
    localStorage.clear();
    return true;
  } catch (error) {
    console.error("Error en deleteCurrentUser:", error);
    return false;
  }
};

//seteamos el token en cookies asi podemos validar consultas y demas mediante el token
//HttpOnly; solo accesibles desde el servidor local no funcion
const setIdToken = (token: authToken) => {
  if(token && token.token){
    document.cookie = `token=${token.token}; path=/; max-age=3600; secure; SameSite=Strict`;// 1 hora de expiración
    return true
  } else {
    return false
  }
}
