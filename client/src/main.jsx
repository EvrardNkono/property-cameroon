// main.jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'  // ← AJOUTE CETTE LIGNE
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>  {/* ← ENCADRE App AVEC BrowserRouter */}
      <App />
    </BrowserRouter>
  </StrictMode>,
)