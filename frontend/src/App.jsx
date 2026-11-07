import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import AppRoutes from './routes/AppRoutes.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <AppRoutes />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3500,
              style: {
                background: '#FFFFFF',
                color: '#252B27',
                border: '1px solid #DCE3DA',
                borderRadius: '8px',
                fontSize: '13px',
                boxShadow: '0 4px 12px rgba(37,43,39,0.08)',
              },
              success: {
                iconTheme: { primary: '#244C3A', secondary: '#FFFFFF' },
              },
              error: {
                iconTheme: { primary: '#C0392B', secondary: '#FFFFFF' },
              },
            }}
          />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
