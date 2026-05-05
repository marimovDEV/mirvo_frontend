import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '../lib/api';

export interface User {
  id: string;
  phone: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  avatar?: string;
  role: 'customer' | 'ambassador' | 'admin' | 'superadmin';
  language: string;
  region?: string;
  city?: string;
  referralCode?: string;
  bonusBalance?: number;
  isLoggedIn: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  pendingPhone: string;
  sendOtp: (phone: string) => Promise<void>;
  verifyOtp: (code: string, registrationData?: any) => Promise<boolean>;
  passwordLogin: (phone: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
  updateProfile: (data: any) => Promise<boolean>;
  adminLogin: (phone: string, password: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'mirvo_token';
const USER_KEY = 'mirvo_user';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem(USER_KEY);
    const token = localStorage.getItem(TOKEN_KEY);
    if (savedUser && token) {
      try {
        return { ...JSON.parse(savedUser), isLoggedIn: true };
      } catch {}
    }
    return null;
  });
  const [isLoading, setIsLoading] = useState(false);
  const [pendingPhone, setPendingPhone] = useState('');

  useEffect(() => {
    // any extra initialization
  }, []);

  const sendOtp = useCallback(async (phone: string) => {
    setIsLoading(true);
    try {
      await authApi.sendOtp(phone);
      setPendingPhone(phone);
    } catch (err) {
      console.error('Send OTP error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const verifyOtp = useCallback(async (code: string, registrationData?: any): Promise<boolean> => {
    setIsLoading(true);
    try {
      const result = await authApi.verifyOtp(pendingPhone, code, registrationData) as any;
      if (result?.token && result?.user) {
        localStorage.setItem(TOKEN_KEY, result.token);
        const userData = { ...result.user, isLoggedIn: true };
        localStorage.setItem(USER_KEY, JSON.stringify(result.user));
        setUser(userData);
        return true;
      }
      return false;
    } catch (err) {
      console.error('OTP verification error:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [pendingPhone]);

  const passwordLogin = useCallback(async (phone: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const result = await authApi.login(phone, password) as any;
      if (result?.token && result?.user) {
        localStorage.setItem(TOKEN_KEY, result.token);
        const userData = { ...result.user, isLoggedIn: true };
        localStorage.setItem(USER_KEY, JSON.stringify(result.user));
        setUser(userData);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Login error:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const adminLogin = useCallback(async (phone: string, password: string) => {
    setIsLoading(true);
    try {
      const result = await authApi.adminLogin(phone, password) as any;
      if (result?.token && result?.user) {
        localStorage.setItem(TOKEN_KEY, result.token);
        const userData = { ...result.user, isLoggedIn: true };
        localStorage.setItem(USER_KEY, JSON.stringify(result.user));
        setUser(userData);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Admin login error:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
  }, []);

  const updateUser = useCallback((data: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, ...data };
      localStorage.setItem(USER_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const updateProfile = useCallback(async (data: any) => {
    setIsLoading(true);
    try {
      const { usersApi } = await import('../lib/api');
      const updatedUser = await usersApi.updateMe(data) as any;
      if (updatedUser) {
        updateUser(updatedUser);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Update profile error:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [updateUser]);

  return (
    <AuthContext.Provider value={{
      user, isLoading, pendingPhone,
      sendOtp, verifyOtp, passwordLogin,
      logout, updateUser, updateProfile, adminLogin
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
