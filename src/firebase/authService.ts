import { 
  signInWithEmailAndPassword, 
  User, 
  signOut, 
  GoogleAuthProvider, 
  signInWithPopup,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  EmailAuthProvider, 
  reauthenticateWithCredential,
  deleteUser } from 'firebase/auth';
// import { db } from "@/firebase/config";
import { addUser, getUser, deleteDBUser } from '@/services/userService';
import { authToken } from '@/types/auth'
import { auth } from './config';  

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

export const registerWithEmailAndPassword = async (email: string, password: string, nombres: string): Promise<boolean|undefined> => {
  const userCreated = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCreated.user
  const token = await user.getIdToken()
  const idToken = {token}
  setIdToken(idToken)
  if(user){
    const userExists = await getUser(user.uid)
    addUser(email, password, nombres, true);
    if(!userExists){
      await sendVerificationEmail()
    }
    return true
  } else {
    return false
  }
}

export const registerWithGoogle = async (): Promise<boolean|undefined> => {
  const provider = new GoogleAuthProvider(); 
  const result = await signInWithPopup(auth, provider);
  // const credential = GoogleAuthProvider.credentialFromResult(result)

  //const que permite acceder al accessToken

  //datos del usuario por si queremos nombre apellido 
  // y demas de la cuenta de google 
  // const user = result.user

  //token de acceso para apis de google y sus servicios
  //habilitar cuando se necesite
  // const accessToken = credential?.accessToken 
  
  const user = result.user

  if(user){
    const token = await user.getIdToken()
    const idToken = {token}
    setIdToken(idToken)
    const userExists = await getUser(user.uid)
    if(userExists == null){
      addUser(user.email!, 'google', user.displayName!);
    }
      return true
  } else {
    return false
  }
}

export const logout = async (): Promise<void> => {
  document.cookie = `token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; secure; SameSite=Strict`; 
  localStorage.clear();
  sessionStorage.clear();
  await signOut(auth);
};

//verificar que hace esta shit
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

export const isEmailVerifiedAsync = async (): Promise<boolean> => {
  await auth.currentUser?.reload();
  return auth.currentUser?.emailVerified ?? false;
}

/**
 * Reautenticar al usuario actual utilizando email y contraseña.
 * Esto es necesario para operaciones sensibles como eliminar la cuenta.
 * 
 * @param email 
 * @param password 
 * @throws
 */
export const reauthenticateUser = async (email: string, password: string): Promise<void|boolean> => {
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

export const deleteCurrentUser = async (): Promise<void|boolean> => {
  const currentUser: User | null = auth.currentUser;
  //hay un tema con esto y es que si pasa mucho tiempo sin cliquear que se quiere cambiar el mail porque se equivoco
  //pide una reautenticacion, cosa que es complicada por el meollo que hace para validar y nose que
  if(currentUser){
    deleteDBUser(currentUser)
    await deleteUser(currentUser);
    logout();
    return true
  }
  if (!currentUser) {
    throw new Error("No hay un usuario autenticado.");
  }

}


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
