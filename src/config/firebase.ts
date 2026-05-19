import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics"; 
import { getAuth } from "firebase/auth"; // <-- Importamos Auth

const firebaseConfig = {
  apiKey: "AIzaSyA4o7SijbV1r9OPU9x5ZlmhRBSgNWHgR_o",
  authDomain: "linfofluoroscopio-tesis.firebaseapp.com",
  projectId: "linfofluoroscopio-tesis",
  storageBucket: "linfofluoroscopio-tesis.firebasestorage.app",
  messagingSenderId: "632604952114",
  appId: "1:632604952114:web:b5b1e50f07413d975f1e2b",
  measurementId: "G-DQ2EMQ4F3F"
}; // <-- Aquí está la llave que faltaba

// Inicializar el motor de Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Analytics
export const analytics = getAnalytics(app);

// Exportar la base de datos Firestore
export const db = getFirestore(app);

// ¡LA MAGIA NUEVA! Exportar Auth listo para usar en el Login
export const auth = getAuth(app);