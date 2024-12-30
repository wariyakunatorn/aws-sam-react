import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Navbar } from "@/components/Navbar"
import { PageLayout, PageHeader, PageContent } from "@/components/PageLayout"
import { useNavigate } from 'react-router-dom';

export function Home() {
  const navigate = useNavigate();

  return (
    <PageLayout>
      <Navbar 
        title="Dashboard" 
        backLink={{ to: "/list", label: "View List" }}
      />
      <PageContent>
        <PageHeader 
          title="Welcome to Dashboard"
          description="Manage your data and settings here"
        />
        
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                variant="secondary" 
                className="w-full justify-start"
                onClick={() => navigate('/profile')}
              >
                View Profile
              </Button>
              <Button variant="secondary" className="w-full justify-start">
                Settings
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Getting Started</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                View the documentation to learn more about the features.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Need Help?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Contact support for assistance with your account.
              </p>
            </CardContent>
          </Card>
        </div>
      </PageContent>
    </PageLayout>
  );
}
