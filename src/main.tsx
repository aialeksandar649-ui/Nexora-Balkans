import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';
import { PropertiesProvider } from './contexts/PropertiesContext';
import { ToastProvider } from './contexts/ToastContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import App from './App.tsx';
import './index.css';

// Register service worker after load, deferred to avoid blocking main thread
if ('serviceWorker' in navigator && typeof window !== 'undefined') {
  const registerSw = () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  };
  if (document.readyState === 'complete') {
    if ('requestIdleCallback' in window) {
      (window as Window).requestIdleCallback(registerSw, { timeout: 3000 });
    } else {
      setTimeout(registerSw, 1);
    }
  } else {
    window.addEventListener('load', () => {
      if ('requestIdleCallback' in window) {
        (window as Window).requestIdleCallback(registerSw, { timeout: 3000 });
      } else {
        setTimeout(registerSw, 1);
      }
    });
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <ThemeProvider>
          <LanguageProvider>
            <AuthProvider>
              <PropertiesProvider>
                <ToastProvider>
                  <App />
                </ToastProvider>
              </PropertiesProvider>
            </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>
);
