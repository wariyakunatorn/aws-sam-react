import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Navbar } from "@/components/Navbar";
import { PageLayout, PageHeader, PageContent } from "@/components/PageLayout";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { useState, useEffect } from "react";
import { fetchUserAttributes } from 'aws-amplify/auth';

interface UserAttributes {
  email?: string;
  username?: string;
}

export default function Profile() {
  const [attributes, setAttributes] = useState<UserAttributes>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getUserAttributes = async () => {
      try {
        const userAttributes = await fetchUserAttributes();
        setAttributes({
          email: userAttributes.email,
          username: userAttributes.preferred_username
        });
      } catch (err) {
        setError('Failed to fetch user attributes');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    getUserAttributes();
  }, []);

  if (isLoading) return <LoadingSpinner fullScreen />;
  if (error) return <div className="text-destructive text-center p-4">{error}</div>;

  return (
    <PageLayout>
      <Navbar 
        title="Profile" 
        backLink={{ to: "/home", label: "Back to Dashboard" }}
      />
      <PageContent>
        <PageHeader 
          title="Your Profile"
          description="View and manage your account information"
        />
        
        <Card>
          <CardHeader>
            <CardTitle>Account Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">Email Address</h3>
                <p className="text-lg">{attributes.email}</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">Username</h3>
                <p className="text-lg">{attributes.username}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </PageContent>
    </PageLayout>
  );
}