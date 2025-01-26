import { db } from "@/firebase/config";
import { doc, setDoc, getDoc, deleteDoc } from "firebase/firestore";
import { getCurrentUser } from "@/firebase/authService";
import bcrypt from 'bcryptjs' ; // para cifrar passwords


export function addUser(email: string, password: string, nombres: string, hash?: boolean) {
    try {
        const user = getCurrentUser();

        if(hash){
            password = hashPassword(password);
        }
        
        if (!user) {
            throw new Error("No hay usuario autenticado.");
        }

        if(password === 'google'){
            setDoc(doc(db, "users", user.uid), {
                email: email,
                nombres: nombres,
                createdAt: new Date().toISOString(),
            });
        } else {
            setDoc(doc(db, "users", user.uid), {
                email: email,
                nombres: nombres,
                password: password,
                createdAt: new Date().toISOString(),
                emailConfirmed: false,
            },{ merge: true });
            }
        return true
    } catch (error) {
        return error
    }
}

const hashPassword = ( password: string ) => {
    const hashedPassword = bcrypt.hashSync(password, 10);
    return hashedPassword
}

export async function getUser(uid: string) {
    try {
        const userRef = doc(db, "users", uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            return userSnap.data();
            return null;
        } else {
            console.log("No se encontró un usuario.");
            return null;
        }
    } catch (error) {
        console.error("Error al obtener usuario:", error);
        return null;
    }
}

export const deleteDBUser = (user: any) => {
    try {
        const userRef = doc(db, "users", user.uid);
        deleteDoc(userRef);
        
    } catch (error: any) {
        if (error.code === "auth/requires-recent-login") {
            console.error("El usuario necesita volver a autenticarse para eliminar su cuenta.");

            throw new Error(
                "Por razones de seguridad, el usuario debe volver a autenticarse antes de eliminar su cuenta."
            );
        } else {
            throw new Error(error.message);
        }
    }
}

export const updateVerificationEmail = async (userId: string, newEmail: string): Promise<void> => {
    try {
      const userRef = doc(db, "users", userId);
      
      await setDoc(userRef, {
        email: newEmail, 
        emailConfirmed: false,
      }, { merge: true });
  
      console.log("Correo actualizado temporalmente.");
    } catch (error) {
      console.error("Error al actualizar el correo:", error);
    }
  };