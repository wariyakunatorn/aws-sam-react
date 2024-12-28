import { NextUIProvider } from '@nextui-org/react';
import { Amplify } from 'aws-amplify';
import { fetchAuthSession } from 'aws-amplify/auth';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Home } from './pages/Home';
import { People } from './pages/People';
import { Login } from './pages/Login';
import { useEffect, useState } from 'react';

Amplify.configure(
  {
    Auth: {
      Cognito: {
        userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID,
        userPoolClientId: import.meta.env.VITE_COGNITO_CLIENT_ID
      }
    },
    API: {
      REST: {
        myApi: {
          endpoint: import.meta.env.VITE_API_ENDPOINT
        }
      }
    }
  },
  {
    API: {
      REST: {
        headers: async () => {
          const session = await fetchAuthSession();
          return {
            Authorization: `Bearer ${session.tokens?.idToken?.toString()}`
          };
        }
      }
    }
  }
);

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      await fetchAuthSession();
      setIsAuthenticated(true);
    } catch {
      setIsAuthenticated(false);
    }
  };

  if (isAuthenticated === null) {
    return null; // or loading spinner
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <NextUIProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route 
            path="/" 
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/people" 
            element={
              <PrivateRoute>
                <People />
              </PrivateRoute>
            } 
          />
        </Routes>
      </BrowserRouter>
    </NextUIProvider>
  );
}

export default App;
