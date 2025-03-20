import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { Platform } from 'react-native';

// Base URL for the API
const getApiBaseUrl = () => {
  if (Platform.OS === 'ios') {
    // For iOS devices, use the machine's IP address
    return 'http://192.0.0.2:8000';
  } else if (Platform.OS === 'android') {
    // For Android emulator
    return 'http://10.0.2.2:8000';
  }
  // For web
  return 'http://localhost:8000';
};

export const API_BASE_URL = getApiBaseUrl();

// API endpoints
export const endpoints = {
  auth: {
    login: '/api/auth/login',
    register: '/api/auth/signup',
    logout: '/api/auth/logout',
    refreshToken: '/api/auth/refresh-token'
  },
  profile: {
    setup: '/api/profile/setup',
    get: '/api/profile',
    update: '/api/profile/update'
  },
  jobs: {
    list: '/api/jobs',
    create: '/api/jobs/create',
    update: (id: string) => `/api/jobs/${id}/update`,
    delete: (id: string) => `/api/jobs/${id}/delete`,
    apply: (id: string) => `/api/jobs/${id}/apply`
  },
  messages: {
    send: '/api/messages',
    list: '/api/messages',
    conversations: '/api/conversations'
  }
};

// Create an axios instance with default config
export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // Increased timeout to 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
  // Add retry configuration
  validateStatus: function (status) {
    return status >= 200 && status < 500; // Handle only server errors
  },
});

// Add a request interceptor to include the auth token
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    } catch (error) {
      return Promise.reject(error);
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.code === 'ECONNABORTED') {
      // Handle timeout error
      throw new Error('Server is not responding. Please try again later.');
    }
    
    if (!error.response) {
      // Network error
      throw new Error('Unable to connect to server. Please check your internet connection.');
    }

    if (error.response.status === 401) {
      // Handle unauthorized access
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
      router.replace('/auth/login');
    }
    
    throw error;
  }
); 