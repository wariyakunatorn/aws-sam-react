import { useAuthStore } from "@/store/authStore"
import { signOut as amplifySignOut } from 'aws-amplify/auth'

export function useAuth() {
  const { user, isAuthenticated } = useAuthStore()
  
  const signOut = async () => {
    try {
      await amplifySignOut()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return { user, signOut, isAuthenticated }
}
