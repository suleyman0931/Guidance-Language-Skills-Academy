import { create } from 'zustand';

interface User {
  id: number;
  username: string;
  name_en: string;
  name_am: string;
  phone: string;
  role: 'admin' | 'student';
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAdmin: boolean;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
  hydrate: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAdmin: false,

  setAuth: (user, token) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('ga_token', token);
      localStorage.setItem('ga_user', JSON.stringify(user));
    }
    set({ user, token, isAdmin: user.role === 'admin' });
  },

  clearAuth: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('ga_token');
      localStorage.removeItem('ga_user');
    }
    set({ user: null, token: null, isAdmin: false });
  },

  hydrate: () => {
    if (typeof window === 'undefined') return;
    const token = localStorage.getItem('ga_token');
    const userStr = localStorage.getItem('ga_user');
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr) as User;
        set({ user, token, isAdmin: user.role === 'admin' });
      } catch { /* ignore */ }
    }
  },
}));
