import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIZaSVAeOrarfgqcrhpXxcrEXaWOiOPKhBvkMQ",
  authDomain: "menutify-test.firebaseapp.com",
  projectId: "menutify-test",
  storageBucket: "menutify-test.firebasestorage.app",
  messagingSenderId: "105920755253",
  appId: "1:105920755253:web:0b6521c7a4a353e4c2637c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export default app; 