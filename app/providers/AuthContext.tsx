import React, { createContext, useState, useContext, useEffect } from 'react';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { mockApi } from '../utils/mockApi'; // Import our mock API

export type UserType = 'worker' | 'business';

export interface User {
  id: string;
  email: string;
  fullName: string;
  userType: UserType;
  token?: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (fullName: string, email: string, password: string, userType: 'worker' | 'business') => Promise<void>;
  signOut: () => Promise<void>;
  isWorker: () => boolean;
  isBusiness: () => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is logged in
    const checkUser = async () => {
      try {
        const userString = await AsyncStorage.getItem('user');
        const tokenString = await AsyncStorage.getItem('token');
        
        if (userString && tokenString) {
          const userData = JSON.parse(userString);
          // Token is stored as a string, no need to parse
          const token = tokenString;
          
          setUser({ ...userData, token } as User);
        }
      } catch (error) {
        console.error('Error loading user data', error);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // Call the mock API endpoint
      const response = await mockApi.login(email, password);
      
      // Extract user data and token from response
      const { user: userData, token } = response;
      
      if (!userData || !token) {
        throw new Error('Invalid response from server');
      }
      
      // Save user data and token to AsyncStorage
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      await AsyncStorage.setItem('token', token);
      
      setUser({ ...userData, token } as User);
      
      // Navigate based on user type
      if (userData.userType === 'business') {
        router.replace('/dashboard/hirer-dashboard');
      } else {
        router.replace('/dashboard');
      }
    } catch (error: any) {
      const errorMessage = error.message || 'An error occurred during sign in';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (fullName: string, email: string, password: string, userType: 'worker' | 'business') => {
    setLoading(true);
    setError(null);
    
    try {
      // API request to register
      const response = await mockApi.register(fullName, email, password, userType);

      const { user, token } = response;
      
      // Save user data and token
      await AsyncStorage.setItem('user', JSON.stringify(user));
      await AsyncStorage.setItem('token', token);
      
      // Set user in context
      setUser({ ...user, token } as User);
      
      // Redirect based on user type
      if (userType === 'business') {
        router.replace('/dashboard/hirer-dashboard');
      } else {
        router.replace('/dashboard');
      }
    } catch (error: any) {
      console.error('Sign up error:', error);
      setError(error.message || 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      
      // Call the logout endpoint
      await mockApi.logout();
      
      // Remove user data and token from AsyncStorage
      await AsyncStorage.removeItem('user');
      await AsyncStorage.removeItem('token');
      
      setUser(null);
      router.replace('/welcome');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  };

  const isWorker = () => {
    return user?.userType === 'worker';
  };

  const isBusiness = () => {
    return user?.userType === 'business';
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, signIn, signUp, signOut, isWorker, isBusiness }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthProvider; 