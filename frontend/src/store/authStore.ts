import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { signIn, getCurrentUser, type SignInOutput } from 'aws-amplify/auth';

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  user: SignInOutput | null;
  checkAuth: () => Promise<void>;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      isLoading: true,
      error: null,
      user: null,
      checkAuth: async () => {
        try {
          set({ isLoading: true });
          const user = await getCurrentUser();
          set({ isAuthenticated: !!user, isLoading: false });
        } catch (error) {
          set({ isAuthenticated: false, isLoading: false });
        }
      },
      login: async (username: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const user = await signIn({
            username, 
            password,
            options: {
              authFlowType: "USER_PASSWORD_AUTH"
            }});
          set({ isAuthenticated: true, user, isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to sign in',
            isLoading: false 
          });
          throw error;
        }
      },
      logout: () => {
        set({ isAuthenticated: false, user: null, error: null });
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        isAuthenticated: state.isAuthenticated,
        user: state.user 
      })
    }
  )
);
