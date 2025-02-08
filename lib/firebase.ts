import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyA-mbh6ys-MlfhZiDh5dVh76yeMN5XDEZU",
  authDomain: "birthday-71f8c.firebaseapp.com",
  projectId: "birthday-71f8c",
  storageBucket: "birthday-71f8c.firebasestorage.app",
  messagingSenderId: "845877059130",
  appId: "1:845877059130:web:8a56d24773dbc6f524df03",
  measurementId: "G-4X874XS5BJ"
};
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
const analytics = getAnalytics(app);