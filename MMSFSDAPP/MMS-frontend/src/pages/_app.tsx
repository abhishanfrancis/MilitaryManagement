import { Toaster } from 'react-hot-toast';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { useAuthStore } from '@/stores/authStore';
import Layout from '@/components/layout/Layout';
import LoadingScreen from '@/components/ui/LoadingScreen';
import { authService } from '@/services/authService';

import '@/styles/globals.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

function AppContent({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const { isInitialized, isAuthenticated, setUser, setIsAuthenticated, setIsInitialized } = useAuthStore();

  // Initialize auth state — validate token with backend
  useEffect(() => {
    if (isInitialized) return;

    const init = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          // Validate the token by calling /auth/me
          const user = await authService.getCurrentUser();
          setUser(user);
          setIsAuthenticated(true);
        }
      } catch (e) {
        // Token is invalid or expired — clear it
        console.error('Token validation failed, clearing session');
        localStorage.removeItem('token');
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsInitialized(true);
      }
    };

    init();
  }, [isInitialized, setUser, setIsAuthenticated, setIsInitialized]);

  // Handle authentication redirects after initialization
  useEffect(() => {
    if (!isInitialized) return;

    const publicPaths = ['/login', '/register', '/forgot-password', '/reset-password', '/dev-login'];
    const path = router.pathname;

    if (!isAuthenticated && !publicPaths.includes(path)) {
      router.replace('/login');
    } else if (isAuthenticated && publicPaths.includes(path)) {
      router.replace('/dashboard');
    }
  }, [isInitialized, isAuthenticated, router]);

  // Show loading screen until initialized
  if (!isInitialized) {
    return <LoadingScreen />;
  }

  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

export default function App(props: AppProps) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent {...props} />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#0f172a',
              color: '#f8fafc',
              borderRadius: '16px',
              padding: '14px 20px',
              fontSize: '14px',
              fontWeight: '500',
              boxShadow: '0 20px 60px -15px rgba(0, 0, 0, 0.25)',
              border: '1px solid rgba(255,255,255,0.08)',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#10b981',
                secondary: 'white',
              },
            },
            error: {
              duration: 5000,
              iconTheme: {
                primary: '#ef4444',
                secondary: 'white',
              },
            },
          }}
        />
      </AuthProvider>
    </ThemeProvider>
  );
}