import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDummyKeyForLocalDevOnly12345678",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "mastermind-aid.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "mastermind-aid",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "mastermind-aid.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1234567890",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1234567890:web:1234567890abcdef"
};

// Initialize Firebase safely
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
