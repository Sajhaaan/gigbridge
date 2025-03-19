import { Platform } from 'react-native';

export const lightTheme = {
  background: '#FFFFFF',
  text: '#1A1A1A',
  subtext: '#666666',
  accent: '#007AFF',
  input: '#F8F9FA',
  border: '#E5E7EB',
  placeholder: '#9CA3AF',
  error: '#DC2626',
  success: '#059669',
  warning: '#D97706',
  card: '#FFFFFF',
  cardLight: '#F8F9FA',
  isDark: false,
  colors: {
    sent: '#007AFF',
    received: '#E5E7EB',
    text: '#1A1A1A',
    subtext: '#666666',
    background: '#FFFFFF',
    accent: '#007AFF',
    input: '#F8F9FA',
    border: '#E5E7EB'
  },
  gradients: {
    primary: ['#007AFF', '#00A2FF'] as const,
    secondary: ['#F8F9FA', '#FFFFFF'] as const
  },
  navigation: {
    background: '#FFFFFF',
    tint: '#007AFF',
    tabBar: '#FFFFFF'
  }
};

export const darkTheme = {
  ...lightTheme,
  background: '#1A1A1A',
  text: '#FFFFFF',
  subtext: '#A0A0A0',
  input: '#2D2D2D',
  border: '#404040',
  card: '#2D2D2D',
  cardLight: '#333333',
  isDark: true,
  colors: {
    sent: '#007AFF',
    received: '#404040',
    text: '#FFFFFF',
    subtext: '#A0A0A0',
    background: '#1A1A1A',
    accent: '#007AFF',
    input: '#2D2D2D',
    border: '#404040'
  },
  navigation: {
    background: '#1A1A1A',
    tint: '#007AFF',
    tabBar: '#2D2D2D'
  }
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const typography = {
  h1: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  h2: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  h3: {
    fontSize: 20,
    fontWeight: '600',
  },
  body: {
    fontSize: 16,
    fontWeight: 'normal',
  },
  caption: {
    fontSize: 14,
    fontWeight: 'normal',
  },
};

export const shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
}; 