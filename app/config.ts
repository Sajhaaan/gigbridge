import { Platform } from 'react-native';

// Configure API URL based on platform and environment
const getBaseUrl = () => {
  if (__DEV__) {
    if (Platform.OS === 'android') {
      return 'http://10.0.2.2:8000';
    }
    if (Platform.OS === 'ios') {
      // For iOS, we need to use localhost or the machine's IP address
      return 'http://127.0.0.1:8000';
    }
    return 'http://localhost:8000';
  }
  return 'https://your-production-api.com'; // Replace with your production API URL
};

export const API_URL = getBaseUrl();

const config = {
  API_URL,
};

export default config; 