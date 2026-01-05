import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Suppress unhandled promise rejections from external services (e.g., LaunchDarkly, browser extensions)
// that use code: 403 (app-level auth errors) with httpStatus: 200.
// These are typically not actionable errors in the app itself and clutter the console.
window.addEventListener('unhandledrejection', (event) => {
  const reason = event.reason;
  // Check if this is an external service rejection (minified name 'i', code 403, httpStatus 200)
  if (reason && typeof reason === 'object' && reason.code === 403 && reason.httpStatus === 200) {
    // Prevent the error from being reported; log in DEV for debugging
    event.preventDefault();
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.debug('Suppressed external service rejection (likely LaunchDarkly/extension):', reason);
    }
  } else if (import.meta.env.DEV) {
    // Log other unhandled rejections for debugging
    // eslint-disable-next-line no-console
    console.error('Unhandled promise rejection:', reason, event);
  }
});
