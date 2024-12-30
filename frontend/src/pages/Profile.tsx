import { useAuth } from "@/hooks/useAuth"
import { PageContent, PageHeader, PageLayout } from "@/components/PageLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

export default function Profile() {
  const { user, signOut } = useAuth()

  return (
    <PageLayout>
      <PageHeader 
        title="Profile" 
        description="Manage your account settings and preferences."
      />
      <PageContent>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <Label>Email</Label>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
              <div className="space-y-1">
                <Label>Username</Label>
                <p className="text-sm text-muted-foreground">{user?.username}</p>
              </div>
              <Button variant="destructive" onClick={signOut}>
                Sign Out
              </Button>
            </CardContent>
          </Card>
        </div>
      </PageContent>
    </PageLayout>
  )
}
