/**
 * Authentication Hook
 * Provides authentication methods and state
 */

'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect } from 'react';

import { strapiClient } from '@attaqwa/api-client';
import { useAuthStore } from '@/lib/store/auth-store';

export function useAuth() {
  const router = useRouter();
  const { user, token, isAuthenticated, isLoading, login, logout, setUser, setLoading } =
    useAuthStore();

  // Initialize auth state on mount
  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          strapiClient.setAuth(token);
          const userData = await strapiClient.getMe();
          setUser(userData);
          setLoading(false);
        } catch (error) {
          console.error('Failed to initialize auth:', error);
          logout();
          strapiClient.clearAuth();
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const signIn = useCallback(
    async (identifier: string, password: string) => {
      try {
        const { user: userData, token: authToken } = await strapiClient.login(
          identifier,
          password
        );
        login(userData, authToken);
        router.push('/dashboard');
        return { success: true };
      } catch (error: any) {
        return {
          success: false,
          error: error.message || 'Login failed',
        };
      }
    },
    [login, router]
  );

  const signOut = useCallback(async () => {
    logout();
    strapiClient.clearAuth();
    router.push('/login');
  }, [logout, router]);

  const checkRole = useCallback(
    (allowedRoles: string[]) => {
      if (!user || !user.role) return false;
      return allowedRoles.includes(user.role.type);
    },
    [user]
  );

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    signIn,
    signOut,
    checkRole,
  };
}
