import { NextUIProvider, Spinner } from '@nextui-org/react';
import { Amplify } from 'aws-amplify';
import { fetchAuthSession } from 'aws-amplify/auth';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from './store/authStore';

// Lazy load components
const Home = lazy(() => import('./pages/Home').then(module => ({ default: module.Home })));
const List = lazy(() => import('./pages/List').then(module => ({ default: module.List })));
const Login = lazy(() => import('./pages/Login').then(module => ({ default: module.Login })));

// Amplify config
const amplifyConfig = {
  Auth: {
    Cognito: {
      userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID,
      userPoolClientId: import.meta.env.VITE_COGNITO_CLIENT_ID
    }
  },
  API: {
    REST: {
      myApi: {
        endpoint: import.meta.env.VITE_API_ENDPOINT,
        headers: async () => {
          const session = await fetchAuthSession();
          return {
            Authorization: `Bearer ${session.tokens?.idToken?.toString() || ''}`
          };
        }
      }
    }
  }
};

Amplify.configure(amplifyConfig);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
      retry: 1,
      refetchOnWindowFocus: false
    }
  }
});

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, checkAuth } = useAuthStore();
  
  useEffect(() => {
    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-violet-50">
        <Spinner size="lg" />
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export default function App() {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <NextUIProvider>
        <BrowserRouter>
          <Suspense fallback={
            <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-violet-50">
              <Spinner size="lg" />
            </div>
          }>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<Navigate to="/home" replace />} />
              <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
              <Route path="/list" element={<ProtectedRoute><List /></ProtectedRoute>} />
              <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </NextUIProvider>
    </QueryClientProvider>
  );
}
