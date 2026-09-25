import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { loadShared, saveShared, checkConnection } from './storage'

window.__supabaseStorage = { loadShared, saveShared, checkConnection }

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)