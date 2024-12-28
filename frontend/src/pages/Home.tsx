import { Navbar, NavbarBrand, NavbarContent, Button, Card, CardBody, Link } from '@nextui-org/react';
import { useNavigate } from 'react-router-dom';
import { Link as RouterLink } from 'react-router-dom';
import { signOut } from 'aws-amplify/auth';

export function Home() {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="w-screen min-h-screen bg-gradient-to-br from-blue-50 to-violet-50">
      <Navbar className="border-b border-divider bg-background/70 backdrop-blur-sm">
        <NavbarBrand>
          <h1 className="font-bold text-inherit text-xl">Dashboard</h1>
        </NavbarBrand>
        <NavbarContent justify="end" className="gap-4">
          <Link 
            as={RouterLink} 
            to="/people"
            className="text-foreground hover:text-primary transition-colors"
          >
            View People
          </Link>
          <Button 
            color="danger" 
            variant="flat" 
            onClick={handleSignOut}
            className="font-medium"
          >
            Sign out
          </Button>
        </NavbarContent>
      </Navbar>
      
      <main className="max-w-[1024px] mx-auto px-6 pt-6">
        <Card className="shadow-md">
          <CardBody className="p-6">
            <h2 className="text-xl font-bold mb-4">Dashboard Overview</h2>
            <div className="space-y-4">
              <p className="text-default-600">
                Welcome to your dashboard. Here you can manage and view your data.
              </p>
              <div className="flex gap-4">
                <Button 
                  as={RouterLink}
                  to="/people" 
                  color="primary"
                  className="font-medium"
                >
                  View People List
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>
      </main>
    </div>
  );
}
