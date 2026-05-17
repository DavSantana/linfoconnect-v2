import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// Importamos Analytics por si la doctora luego quiere saber cuánta gente usa la app
import { getAnalytics } from "firebase/analytics"; 

const firebaseConfig = {
  apiKey: "AIzaSyA4o7SijbV1r9OPU9x5ZlmhRBSgNWHgR_o",
  authDomain: "linfofluoroscopio-tesis.firebaseapp.com",
  projectId: "linfofluoroscopio-tesis",
  storageBucket: "linfofluoroscopio-tesis.firebasestorage.app",
  messagingSenderId: "632604952114",
  appId: "1:632604952114:web:b5b1e50f07413d975f1e2b",
  measurementId: "G-DQ2EMQ4F3F"
};

// Inicializar el motor de Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Analytics (Opcional, pero bueno tenerlo encendido)
export const analytics = getAnalytics(app);

// ¡LA MAGIA! Exportar la base de datos Firestore lista para usar en toda la plataforma
export const db = getFirestore(app);