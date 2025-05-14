
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Configuration Firebase de l'application
const firebaseConfig = {
  apiKey: "AIzaSyBeWmKp9IwixLJD0hNb2DiI8zXfhKhw2Ks",
  authDomain: "neorh-998d2.firebaseapp.com",
  projectId: "neorh-998d2",
  storageBucket: "neorh-998d2.firebasestorage.app",
  messagingSenderId: "849642731551",
  appId: "1:849642731551:web:26c8e13c1019c524867d2a"
};

// Initialisation de Firebase
const app = initializeApp(firebaseConfig);

// Initialisation de Firestore
export const db = getFirestore(app);

// Initialisation de Storage
export const storage = getStorage(app);

export default app;
