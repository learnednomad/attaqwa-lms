/**
 * Authentication Store
 * Thin Zustand wrapper around BetterAuth session for compatibility.
 */

import { create } from 'zustand';

interface AuthState {
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
  isLoading: true,
  setLoading: (loading) => set({ isLoading: loading }),
}));
