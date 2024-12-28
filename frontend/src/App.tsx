import { NextUIProvider } from '@nextui-org/react';
import { Amplify } from 'aws-amplify';
import { fetchAuthSession } from 'aws-amplify/auth';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';

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

export default function App() {
  return (
    <NextUIProvider>
      <BrowserRouter>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/people" element={<People />} />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </NextUIProvider>
  );
}
