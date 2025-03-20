import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define theme colors
export const lightTheme = {
  background: '#FFFFFF',
  backgroundSecondary: '#F2F7FF',
  text: '#333333',
  textSecondary: '#666666',
  primary: '#007AFF',
  secondary: '#5856D6',
  accent: '#FF9500',
  border: '#E5E5E5',
  error: '#FF3B30',
  success: '#34C759',
  card: '#FFFFFF',
  shadow: 'rgba(0, 0, 0, 0.1)',
};

export const darkTheme = {
  background: '#121212',
  backgroundSecondary: '#1E1E1E',
  text: '#FFFFFF',
  textSecondary: '#BBBBBB',
  primary: '#0A84FF',
  secondary: '#5E5CE6',
  accent: '#FF9F0A',
  border: '#2C2C2E',
  error: '#FF453A',
  success: '#30D158',
  card: '#1C1C1E',
  shadow: 'rgba(0, 0, 0, 0.3)',
};

export type Theme = typeof lightTheme;

type ThemeContextType = {
  isDarkMode: boolean;
  toggleTheme: () => Promise<void>;
  theme: {
    background: string;
    text: string;
    subText: string;
    border: string;
    card: string;
    menuIcon: string;
  };
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemColorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    loadThemePreference();
  }, []);

  const loadThemePreference = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('themeMode');
      if (savedTheme !== null) {
        setIsDarkMode(savedTheme === 'dark');
      } else {
        setIsDarkMode(systemColorScheme === 'dark');
      }
    } catch (error) {
      console.log('Error loading theme:', error);
    }
  };

  const toggleTheme = async () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    try {
      await AsyncStorage.setItem('themeMode', newMode ? 'dark' : 'light');
    } catch (error) {
      console.log('Error saving theme:', error);
    }
  };

  const theme = {
    background: isDarkMode ? '#1A1A1A' : '#FFFFFF',
    text: isDarkMode ? '#FFFFFF' : '#1A1A1A',
    subText: isDarkMode ? '#A1A1AA' : '#666666',
    border: isDarkMode ? '#27272A' : '#F1F3F5',
    card: isDarkMode ? '#27272A' : '#FFFFFF',
    menuIcon: isDarkMode ? '#3D5CDB' : '#4F78FF',
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, theme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
} 