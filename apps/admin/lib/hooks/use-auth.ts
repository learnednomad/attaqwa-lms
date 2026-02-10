/**
 * Authentication Hook
 * Provides authentication methods and state via BetterAuth
 */

'use client';

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { authClient } from '@/lib/auth-client';

export function useAuth() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const user = session?.user ?? null;
  const isAuthenticated = !!user;
  const isLoading = isPending;

  const signIn = useCallback(
    async (identifier: string, password: string) => {
      try {
        const { error } = await authClient.signIn.email({
          email: identifier,
          password,
        });
        if (error) {
          return { success: false, error: error.message || 'Login failed' };
        }
        router.push('/dashboard');
        return { success: true };
      } catch (error: any) {
        return {
          success: false,
          error: error.message || 'Login failed',
        };
      }
    },
    [router]
  );

  const signOut = useCallback(async () => {
    await authClient.signOut();
    router.push('/login');
  }, [router]);

  const checkRole = useCallback(
    (allowedRoles: string[]) => {
      if (!user?.role) return false;
      return allowedRoles.includes(user.role);
    },
    [user]
  );

  return {
    user,
    token: null, // No more token — sessions are cookie-based
    isAuthenticated,
    isLoading,
    signIn,
    signOut,
    checkRole,
  };
}
