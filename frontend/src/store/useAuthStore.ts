import { create } from 'zustand';
import { api } from '../lib/api';

export interface User {
  id: string;
  fullName: string;
  name?: string;
  email: string;
  username?: string;
  role: 'USER' | 'ADMIN' | string;
  avatar?: string;
  lastLogin?: string;
  streak: number;
  longestStreak: number;
  completedTopics: string[];
  completedProblems: string[];
  progressData?: Record<string, any>;
  isEmailVerified?: boolean;
  learningHours?: number;
  xp?: number;
  level?: number;
  createdAt?: string;
  updatedAt?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  setUser: (user: User) => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => {
  const savedToken = localStorage.getItem('token');
  const savedUser = localStorage.getItem('user');
  const initialUser = savedUser ? JSON.parse(savedUser) : null;

  return {
    user: initialUser,
    token: savedToken,
    isLoading: !!savedToken, // start in loading state if token exists to re-verify
    isAuthenticated: !!savedToken && !!initialUser,

    login: (token, user) => {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      set({ user, token, isAuthenticated: true, isLoading: false });
    },

    logout: () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      set({ user: null, token: null, isAuthenticated: false, isLoading: false });
      // Call logout endpoint silently
      api.post('/auth/logout').catch(() => {});
    },

    setUser: (user) => {
      localStorage.setItem('user', JSON.stringify(user));
      set({ user });
    },

    checkAuth: async () => {
      const token = get().token || localStorage.getItem('token');
      if (!token) {
        set({ user: null, token: null, isAuthenticated: false, isLoading: false });
        return;
      }

      try {
        set({ isLoading: true });
        const res = await api.get('/auth/me');
        if (res.data && res.data.user) {
          const freshUser = res.data.user;
          localStorage.setItem('user', JSON.stringify(freshUser));
          set({ user: freshUser, isAuthenticated: true, isLoading: false });
        } else {
          get().logout();
        }
      } catch (error) {
        console.warn('Session verification failed, logging out:', error);
        get().logout();
      }
    },
  };
});
