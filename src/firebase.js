import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBShom-SNl6BxuxdIrQN7j8dHLqjwFd1AI",
  authDomain: "anchor-8383a.firebaseapp.com",
  projectId: "anchor-8383a",
  storageBucket: "anchor-8383a.firebasestorage.app",
  messagingSenderId: "318685220409",
  appId: "1:318685220409:web:7d1c714b3d17edf11f87e8",
  measurementId: "G-H6BW07WFFM"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
