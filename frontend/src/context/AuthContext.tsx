/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { apiClient, useMockData } from '@/lib/apiClient';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const AUTH_STORAGE_KEY = 'alananaya.dev::auth';

interface StoredAuthPayload {
  user: AuthUser;
  token: string;
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const payload = window.localStorage.getItem(AUTH_STORAGE_KEY);
    if (payload) {
      try {
        const parsed = JSON.parse(payload) as StoredAuthPayload;
        setUser(parsed.user);
        setToken(parsed.token);
      } catch (error) {
        console.error('Failed to parse auth payload', error);
      }
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    if (user && token) {
      apiClient.defaults.headers.common.Authorization = `Bearer ${token}`;
      window.localStorage.setItem(
        AUTH_STORAGE_KEY,
        JSON.stringify({ user, token }),
      );
    } else {
      delete apiClient.defaults.headers.common.Authorization;
      window.localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [isHydrated, token, user]);

  const login = async ({ email, password }: { email: string; password: string }) => {
    if (useMockData) {
      if (email !== 'alan@alananaya.dev' || password !== 'buildgreatapps') {
        throw new Error('Invalid credentials');
      }
      const mockPayload: StoredAuthPayload = {
        user: { id: 'admin-mock', email, name: 'Alan Anaya' },
        token: 'mock-token',
      };
      setUser(mockPayload.user);
      setToken(mockPayload.token);
      return;
    }

    const response = await apiClient.post<StoredAuthPayload>('/auth/login', {
      email,
      password,
    });
    setUser(response.data.user);
    setToken(response.data.token);
  };

  const logout = async () => {
    if (!useMockData) {
      try {
        await apiClient.post('/auth/logout');
      } catch (error) {
        console.warn('Failed to log out cleanly', error);
      }
    }
    setUser(null);
    setToken(null);
  };

  const value = {
    user,
    token,
    isAuthenticated: Boolean(user && token),
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
