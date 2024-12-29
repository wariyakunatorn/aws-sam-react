import { Button } from "@/components/ui/button"
import { useNavigate } from 'react-router-dom';
import { Link as RouterLink } from 'react-router-dom';
import { signOut } from 'aws-amplify/auth';
import { useState, useCallback, memo } from 'react';

interface NavbarProps {
  title: string;
  backLink?: {
    to: string;
    label: string;
  };
}

export const Navbar = memo(({ title, backLink }: NavbarProps) => {
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
    <nav className="border-b">
      <div className="container flex h-14 items-center justify-between">
        <h1 className="font-medium">{title}</h1>
        <div className="flex items-center gap-4">
          {backLink && (
            <RouterLink 
              to={backLink.to}
              className="text-sm text-muted-foreground hover:text-primary"
            >
              {backLink.label}
            </RouterLink>
          )}
          <Button 
            variant="destructive"
            size="sm"
            onClick={handleSignOut}
            disabled={isLoading}
          >
            Sign Out
          </Button>
        </div>
      </div>
    </nav>
  );
});

Navbar.displayName = 'Navbar';
