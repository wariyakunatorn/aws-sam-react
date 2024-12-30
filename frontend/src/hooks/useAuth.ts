import { useAuthStore } from "@/store/authStore"

export function useAuth() {
  const { user, signOut, isAuthenticated } = useAuthStore()
  return { user, signOut, isAuthenticated }
}
