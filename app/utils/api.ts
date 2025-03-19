import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'https://api.gigbridge.com/v1'; // When we have a real backend, we'll use this

/**
 * Utility function to make authenticated API requests
 * 
 * @param endpoint - The API endpoint to call
 * @param options - Request options (method, body, headers)
 * @returns Promise with the API response
 */
export const apiRequest = async (
  endpoint: string,
  options: RequestInit = {}
) => {
  try {
    // Get the auth token from AsyncStorage
    const token = await AsyncStorage.getItem('token');
    
    // Set up headers with authentication
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...options.headers,
    };
    
    // Make the API request
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });
    
    // Parse the JSON response
    const data = await response.json();
    
    // Check if the request was successful
    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }
    
    return data;
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
}; 