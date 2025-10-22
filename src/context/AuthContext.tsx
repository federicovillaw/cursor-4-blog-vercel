'use client';

import { createContext, useContext, useEffect, ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';

// Define the shape of the context data
interface AuthContextType {
  user: ReturnType<typeof useAuth>['user'];
  loading: boolean;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

/**
 * Provider component that wraps the application and makes auth state available to any child component.
 * It also handles the initial sign-in attempt using the global token.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const { user, loading, signIn } = useAuth();

  useEffect(() => {
    // This simulates the check for the global token mentioned in the PRD.
    // In a real Canvas environment, this might be immediately available.
    const initialAuthToken = (window as any).__initial_auth_token;
    
    if (initialAuthToken) {
      signIn(initialAuthToken);
    }
  }, [signIn]);

  const value = { user, loading };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Custom hook to use the AuthContext.
 * This allows any component to easily access the authentication state.
 */
export const useAuthContext = () => {
  return useContext(AuthContext);
};
