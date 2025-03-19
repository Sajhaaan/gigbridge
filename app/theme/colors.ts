import { Platform } from 'react-native';

export const darkTheme = {
  // Base colors
  background: '#0A0A0C',
  card: '#16161A',
  cardLight: '#1C1C22',
  text: '#FFFFFF',
  subtext: '#8E8E93',
  border: 'rgba(255, 255, 255, 0.1)',

  // Accent colors
  accent: '#6C5CE7',
  accentLight: '#A29BFE',
  
  // Status colors
  success: '#00D2D3',
  warning: '#FFA502',
  danger: '#FF4757',
  info: '#74B9FF',

  // Gradients
  gradients: {
    primary: ['#6C5CE7', '#A29BFE'],
    success: ['#00B894', '#00CEC9'],
    warning: ['#FDCB6E', '#FFA502'],
    info: ['#74B9FF', '#0984E3'],
    danger: ['#FF4757', '#FF6B81'],
    purple: ['#9B59B6', '#8E44AD'],
    blue: ['#3498DB', '#2980B9'],
    green: ['#A8E6CF', '#55EFC4'],
  },

  // Input and form
  input: '#1C1C22',
  placeholder: '#8E8E93',
  disabled: 'rgba(255, 255, 255, 0.3)',

  // Shadows
  shadow: {
    small: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 3,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 5,
    },
    large: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 6,
      },
      shadowOpacity: 0.35,
      shadowRadius: 12,
      elevation: 8,
    },
  },

  // Navigation
  navigation: {
    background: '#16161A',
    border: 'rgba(255, 255, 255, 0.1)',
    tint: '#6C5CE7',
    tabBar: {
      background: '#16161A',
      border: 'rgba(255, 255, 255, 0.1)',
      height: Platform.OS === 'ios' ? 88 : 60,
      paddingBottom: Platform.OS === 'ios' ? 28 : 8,
      active: '#6C5CE7',
      inactive: '#8E8E93',
    },
  },
};

export const lightTheme = {
  // Base colors
  background: '#F7F9FC',
  card: '#FFFFFF',
  cardLight: '#F5F7FA',
  text: '#1A1D1E',
  subtext: '#6C7072',
  border: 'rgba(0, 0, 0, 0.1)',

  // Accent colors
  accent: '#6C5CE7',
  accentLight: '#A29BFE',
  
  // Status colors
  success: '#00B894',
  warning: '#FDCB6E',
  danger: '#FF4757',
  info: '#74B9FF',

  // Gradients
  gradients: {
    primary: ['#6C5CE7', '#A29BFE'],
    success: ['#00B894', '#00CEC9'],
    warning: ['#FDCB6E', '#FFA502'],
    info: ['#74B9FF', '#0984E3'],
    danger: ['#FF4757', '#FF6B81'],
    purple: ['#9B59B6', '#8E44AD'],
    blue: ['#3498DB', '#2980B9'],
    green: ['#A8E6CF', '#55EFC4'],
  },

  // Input and form
  input: '#F5F7FA',
  placeholder: '#A0A0A0',
  disabled: 'rgba(0, 0, 0, 0.3)',

  // Shadows
  shadow: {
    small: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
    },
    large: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 6,
      },
      shadowOpacity: 0.2,
      shadowRadius: 12,
      elevation: 6,
    },
  },

  // Navigation
  navigation: {
    background: '#FFFFFF',
    border: 'rgba(0, 0, 0, 0.1)',
    tint: '#6C5CE7',
    tabBar: {
      background: '#FFFFFF',
      border: 'rgba(0, 0, 0, 0.1)',
      height: Platform.OS === 'ios' ? 88 : 60,
      paddingBottom: Platform.OS === 'ios' ? 28 : 8,
      active: '#6C5CE7',
      inactive: '#6C7072',
    },
  },
};

const colors = {
  darkTheme,
  lightTheme,
};

export default colors; 