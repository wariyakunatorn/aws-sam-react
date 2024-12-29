import { create } from 'zustand';
import { getCurrentUser, signIn, signOut } from 'aws-amplify/auth';

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<boolean>;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  isLoading: false,
  error: null,
  login: async (username: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      await signIn({ 
        username, 
        password,
        options: {
          authFlowType: "USER_PASSWORD_AUTH"
        }
      });
      set({ isAuthenticated: true });
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
  logout: async () => {
    set({ isLoading: true });
    try {
      await signOut();
      set({ isAuthenticated: false });
    } finally {
      set({ isLoading: false });
    }
  },
  checkAuth: async () => {
    try {
      await getCurrentUser();
      set({ isAuthenticated: true });
      return true;
    } catch {
      set({ isAuthenticated: false });
      return false;
    }
  }
}));
