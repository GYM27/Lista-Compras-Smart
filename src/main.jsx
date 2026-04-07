import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ConvexProvider, ConvexReactClient } from 'convex/react'
import './index.css'
import App from './App.jsx'

const CONVEX_URL = import.meta.env.VITE_CONVEX_URL

// Only create the Convex client when the URL is configured.
// Without it, App renders in pure demo mode — no crashes.
const convex = CONVEX_URL ? new ConvexReactClient(CONVEX_URL) : null

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {convex ? (
      <ConvexProvider client={convex}>
        <App />
      </ConvexProvider>
    ) : (
      <App />
    )}
  </StrictMode>,
)
