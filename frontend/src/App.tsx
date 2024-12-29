import { NextUIProvider } from '@nextui-org/react';
import { Amplify } from 'aws-amplify';
import { fetchAuthSession } from 'aws-amplify/auth';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense, Component, ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Error Boundary Component
class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 text-center">
          <h2 className="text-xl font-bold text-danger">Something went wrong.</h2>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-primary text-white rounded"
          >
            Refresh Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// Lazy load components with proper types
const Home = lazy(() => import('./pages/Home').then(module => ({ default: module.Home })));
const People = lazy(() => import('./pages/People').then(module => ({ default: module.People })));
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
          try {
            const session = await fetchAuthSession();
            return {
              Authorization: `Bearer ${session.tokens?.idToken?.toString() || ''}`
            };
          } catch (error) {
            console.error('Auth header error:', error);
            return {};
          }
        }
      }
    }
  }
};

// Initialize Amplify
Amplify.configure(amplifyConfig);

// Initialize QueryClient at module level
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // 1 minute
      retry: 1,
      refetchOnWindowFocus: false
    }
  }
});

export default function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <NextUIProvider>
          <BrowserRouter>
            <Suspense fallback={
              <div className="h-screen w-screen flex items-center justify-center">
                <div className="text-center">Loading...</div>
              </div>
            }>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/people" element={<People />} />
                <Route path="/login" element={<Login />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </NextUIProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
