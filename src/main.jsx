import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@xyflow/react/dist/style.css';
import './styles/index.css'
import App from './App.jsx'
import { initDatabase } from './services/database.js';

(async () => {
  // Inicializar la base de datos
  await initDatabase();

  // Montar la aplicación una vez que la base de datos esté lista
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
})();