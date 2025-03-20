import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (userType: string, fullName: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isWorker: () => boolean;
  isBusiness: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userJson = await AsyncStorage.getItem('user');
      if (userJson) {
        const userData = JSON.parse(userJson);
        setUser(userData);
      }
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setError(null);
      const response = await fetch('http://localhost:8000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to sign in');
      }

      if (data.success && data.data.user) {
        await AsyncStorage.setItem('user', JSON.stringify(data.data.user));
        await AsyncStorage.setItem('token', data.data.token);
        setUser(data.data.user);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An error occurred';
      setError(message);
      throw error;
    }
  };

  const signUp = async (userType: string, fullName: string, email: string, password: string) => {
    try {
      setError(null);
      const response = await fetch('http://localhost:8000/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userType, fullName, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to sign up');
      }

      if (data.success && data.data.user) {
        await AsyncStorage.setItem('user', JSON.stringify(data.data.user));
        await AsyncStorage.setItem('token', data.data.token);
        setUser(data.data.user);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An error occurred';
      setError(message);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await AsyncStorage.removeItem('user');
      await AsyncStorage.removeItem('token');
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const isWorker = () => {
    return user?.userType === 'worker';
  };

  const isBusiness = () => {
    return user?.userType === 'hirer';
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        error,
        signIn,
        signUp,
        signOut,
        isWorker,
        isBusiness,
      }}
    >
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

export default AuthProvider; 