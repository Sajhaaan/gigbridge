import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Alert } from 'react-native';
import { User } from '../types';

// Set API URL for auth endpoints
const API_URL = 'https://api.gigbridge.com/api'; // Replace with your actual API URL

// Create a fallback mechanism for when the server is unreachable
const ENABLE_FALLBACK = true; // Set to false in production

// Fallback demo accounts for offline usage
const DEMO_ACCOUNTS = [
  { id: '1', fullName: 'Demo Worker', email: 'worker@demo.com', password: 'password', userType: 'worker', token: 'demo-worker-token' },
  { id: '2', fullName: 'Demo Business', email: 'business@demo.com', password: 'password', userType: 'business', token: 'demo-business-token' },
  { id: '3', fullName: 'Test User', email: 'test@example.com', password: 'password', userType: 'worker', token: 'test-user-token' },
  { id: '4', fullName: 'Test Business', email: 'business@example.com', password: 'password', userType: 'business', token: 'test-business-token' },
  // Add any other test accounts as needed
];

// Define context interface
interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (fullName: string, email: string, password: string, userType: 'worker' | 'business') => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
  isWorker: () => boolean;
  isBusiness: () => boolean;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize - check if user is already logged in
  useEffect(() => {
    const loadUser = async () => {
      try {
        const userJSON = await AsyncStorage.getItem('user');
        if (userJSON) {
          const userData = JSON.parse(userJSON);
          setUser(userData);
        }
      } catch (e) {
        console.error('Failed to load user from storage', e);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // Clear error message
  const clearError = () => {
    setError(null);
  };

  // Sign in function
  const signIn = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Try to authenticate with the server
      let userData: User;
      
      try {
        const response = await axios.post(`${API_URL}/auth/login`, {
          email,
          password,
        });
        
        if (response.data?.success) {
          userData = {
            id: response.data.user.id,
            fullName: response.data.user.fullName,
            email: response.data.user.email,
            userType: response.data.user.userType,
            token: response.data.token,
          };
        } else {
          throw new Error(response.data?.message || 'Login failed');
        }
      } catch (apiError) {
        console.error('API error during login:', apiError);
        
        // If fallback is enabled, try demo accounts
        if (ENABLE_FALLBACK) {
          const demoUser = DEMO_ACCOUNTS.find(
            account => account.email === email && account.password === password
          );
          
          if (demoUser) {
            // Use demo account data (only in development/testing)
            userData = {
              id: demoUser.id,
              fullName: demoUser.fullName,
              email: demoUser.email,
              userType: demoUser.userType as 'worker' | 'business',
              token: demoUser.token,
            };
          } else {
            throw new Error('Invalid email or password');
          }
        } else {
          // In production, don't use fallback
          throw new Error('Server connection failed. Please try again later.');
        }
      }
      
      // Save user data to storage
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      if (userData.token) {
        await AsyncStorage.setItem('token', userData.token);
      }
      
      // Update state
      setUser(userData);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
      Alert.alert('Login Error', error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Sign up function
  const signUp = async (fullName: string, email: string, password: string, userType: 'worker' | 'business') => {
    setLoading(true);
    setError(null);
    
    try {
      // Try to register with the server
      let userData: User;
      
      try {
        const response = await axios.post(`${API_URL}/auth/register`, {
          fullName,
          email,
          password,
          userType,
        });
        
        if (response.data?.success) {
          userData = {
            id: response.data.user.id,
            fullName: response.data.user.fullName,
            email: response.data.user.email,
            userType: response.data.user.userType,
            token: response.data.token,
          };
        } else {
          throw new Error(response.data?.message || 'Registration failed');
        }
      } catch (apiError) {
        console.error('API error during registration:', apiError);
        
        // If fallback is enabled and in development, create a "fake" registration
        if (ENABLE_FALLBACK) {
          // Check if email already exists in demo accounts
          if (DEMO_ACCOUNTS.some(account => account.email === email)) {
            throw new Error('Email already in use');
          }
          
          // Create a mock user
          userData = {
            id: `demo-${Date.now()}`,
            fullName,
            email,
            userType,
            token: `demo-token-${Date.now()}`,
          };
        } else {
          // In production, don't use fallback
          throw new Error('Server connection failed. Please try again later.');
        }
      }
      
      // Save user data to storage
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      if (userData.token) {
        await AsyncStorage.setItem('token', userData.token);
      }
      
      // Update state
      setUser(userData);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
      Alert.alert('Registration Error', error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Sign out function
  const signOut = async () => {
    setLoading(true);
    
    try {
      // Try to log out from the server
      if (user?.token && !user.token.startsWith('demo-')) {
        try {
          await axios.post(`${API_URL}/auth/logout`, {}, {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          });
        } catch (apiError) {
          console.error('API error during logout:', apiError);
          // Continue with local logout even if server logout fails
        }
      }
      
      // Clear local storage
      await AsyncStorage.removeItem('user');
      await AsyncStorage.removeItem('token');
      
      // Update state
      setUser(null);
    } catch (error) {
      console.error('Error during sign out:', error);
      // Still clear user even if there's an error
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Helper functions
  const isWorker = () => user?.userType === 'worker';
  const isBusiness = () => user?.userType === 'business';

  // Provide context
  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        signIn,
        signUp,
        signOut,
        clearError,
        isWorker,
        isBusiness,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthProvider; 