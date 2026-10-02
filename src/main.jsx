import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './App.css'
import App from './App.jsx'
import { loadShared, saveShared, checkConnection, signInWithProvider, sendMagicLink, getAuthSession, onAuthStateChange, signOutAuth } from './storage'

window.__supabaseStorage = { loadShared, saveShared, checkConnection, signInWithProvider, sendMagicLink, getAuthSession, onAuthStateChange, signOutAuth }

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
