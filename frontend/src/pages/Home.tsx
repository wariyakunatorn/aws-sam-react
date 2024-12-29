import { Navbar, NavbarBrand, NavbarContent, Button, Link } from '@nextui-org/react';
import { useNavigate } from 'react-router-dom';
import { Link as RouterLink } from 'react-router-dom';
import { signOut } from 'aws-amplify/auth';
import { useState, useCallback, memo } from 'react';

// Memoized Navbar component
const AppNavbar = memo(() => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = useCallback(async () => {
    try {
      setIsLoading(true);
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  return (
    <Navbar className="border-b border-divider bg-background/70 backdrop-blur-sm">
      <NavbarBrand>
        <h1 className="font-bold text-inherit text-xl">Dashboard</h1>
      </NavbarBrand>
      <NavbarContent justify="end" className="gap-4">
        <Link 
          as={RouterLink} 
          to="/list"
          className="text-foreground hover:text-primary transition-colors"
        >
          View List
        </Link>
        <Button 
          color="danger" 
          variant="flat" 
          onClick={handleSignOut}
          isLoading={isLoading}
          size="sm"
          className="font-medium"
        >
          Sign Out
        </Button>
      </NavbarContent>
    </Navbar>
  )
});

export function Home() {
  return (
    <div className="w-screen min-h-screen bg-gradient-to-br from-blue-50 to-violet-50">
      <AppNavbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome to Dashboard</h1>
          <p className="text-gray-600">Manage your data and settings here</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-2">Quick Actions</h2>
            <div className="space-y-2">
              <Button color="primary" variant="flat" className="w-full justify-start">
                View Profile
              </Button>
              <Button color="secondary" variant="flat" className="w-full justify-start">
                Settings
              </Button>
            </div>
          </div>
          
          <div className="p-6 bg-white rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-2">Getting Started</h2>
            <p className="text-gray-600">View the documentation to learn more about the features.</p>
          </div>
          
          <div className="p-6 bg-white rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-2">Need Help?</h2>
            <p className="text-gray-600">Contact support for assistance with your account.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
