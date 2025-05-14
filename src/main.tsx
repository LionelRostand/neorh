
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import "./lib/firebase"; // Importation de Firebase pour initialiser l'app

createRoot(document.getElementById("root")!).render(<App />);
