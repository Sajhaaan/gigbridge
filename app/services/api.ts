import axios from 'axios';
import { API_URL } from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create axios instance
const api = axios.create({
  baseURL: `${API_URL}/api`,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

// Request interceptor
api.interceptors.request.use(
  async (config) => {
    // Add auth token to requests if available
    const token = await AsyncStorage.getItem('userToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    if (__DEV__) {
      console.log('API Request:', {
        url: config.url,
        method: config.method,
        data: config.data,
      });
    }
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    if (__DEV__) {
      console.log('API Response:', {
        url: response.config.url,
        status: response.status,
        data: response.data,
      });
    }
    return response;
  },
  (error) => {
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      return response.data;
    } catch (error) {
      console.error('Login API Error:', error);
      throw error;
    }
  },
  
  signup: async (userData: {
    email: string;
    password: string;
    fullName: string;
    userType: 'worker' | 'business';
  }) => {
    try {
      const response = await api.post('/auth/signup', userData);
      return response.data;
    } catch (error) {
      console.error('Signup API Error:', error);
      throw error;
    }
  },

  getProfile: async () => {
    try {
      const response = await api.get('/users/me');
      return response.data;
    } catch (error) {
      console.error('Get Profile API Error:', error);
      throw error;
    }
  },
};

// Jobs API
export const jobsAPI = {
  // Get all jobs
  getAllJobs: async (filters = {}) => {
    try {
      const response = await api.get('/jobs', { params: filters });
      return response.data;
    } catch (error: any) {
      console.error('Get Jobs API Error:', error);
      
      // Fall back to mock API if server is unavailable
      if (error.message?.includes('Network Error') || error.code === 'ECONNREFUSED') {
        console.log('Falling back to mock API for getAllJobs');
        const { mockJobsAPI } = require('./mockApi');
        return mockJobsAPI.getAllJobs();
      }
      
      throw error;
    }
  },
  
  // Get job by ID
  getJobById: async (jobId: string) => {
    try {
      const response = await api.get(`/jobs/${jobId}`);
      return response.data;
    } catch (error: any) {
      console.error('Get Job API Error:', error);
      
      // Fall back to mock API if server is unavailable
      if (error.message?.includes('Network Error') || error.code === 'ECONNREFUSED') {
        console.log('Falling back to mock API for getJobById');
        const { mockJobsAPI } = require('./mockApi');
        return mockJobsAPI.getJobById(jobId);
      }
      
      throw error;
    }
  },
  
  // Create a new job
  createJob: async (jobData: {
    title: string;
    description: string;
    location: string;
    pay: string;
    paymentType: string;
    startTime: string;
    safetyTags?: string[];
  }) => {
    try {
      const response = await api.post('/jobs', jobData);
      return response.data;
    } catch (error: any) {
      console.error('Create Job API Error:', error);
      
      // Fall back to mock API if server is unavailable
      if (error.message?.includes('Network Error') || error.code === 'ECONNREFUSED') {
        console.log('Falling back to mock API for createJob');
        const { mockJobsAPI } = require('./mockApi');
        return mockJobsAPI.createJob(jobData);
      }
      
      throw error;
    }
  },
  
  // Update a job
  updateJob: async (jobId: string, jobData: any) => {
    try {
      const response = await api.put(`/jobs/${jobId}`, jobData);
      return response.data;
    } catch (error: any) {
      console.error('Update Job API Error:', error);
      
      // Fall back to mock API if server is unavailable
      if (error.message?.includes('Network Error') || error.code === 'ECONNREFUSED') {
        console.log('Falling back to mock API for updateJob');
        const { mockJobsAPI } = require('./mockApi');
        return mockJobsAPI.updateJob(jobId, jobData);
      }
      
      throw error;
    }
  },
  
  // Delete a job
  deleteJob: async (jobId: string) => {
    try {
      const response = await api.delete(`/jobs/${jobId}`);
      return response.data;
    } catch (error: any) {
      console.error('Delete Job API Error:', error);
      
      // Fall back to mock API if server is unavailable
      if (error.message?.includes('Network Error') || error.code === 'ECONNREFUSED') {
        console.log('Falling back to mock API for deleteJob');
        const { mockJobsAPI } = require('./mockApi');
        return mockJobsAPI.deleteJob(jobId);
      }
      
      throw error;
    }
  },
  
  // Get job applications
  getJobApplications: async (jobId: string) => {
    try {
      const response = await api.get(`/jobs/${jobId}/applications`);
      return response.data;
    } catch (error) {
      console.error('Get Job Applications API Error:', error);
      throw error;
    }
  }
};

// Applications API
export const applicationsAPI = {
  // Apply for a job
  applyForJob: async (jobId: string, applicationData: any = {}) => {
    try {
      const response = await api.post(`/jobs/${jobId}/apply`, applicationData);
      return response.data;
    } catch (error) {
      console.error('Apply for Job API Error:', error);
      throw error;
    }
  },
  
  // Update application status
  updateApplicationStatus: async (applicationId: string, status: 'pending' | 'shortlisted' | 'hired' | 'rejected') => {
    try {
      const response = await api.put(`/applications/${applicationId}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Update Application Status API Error:', error);
      throw error;
    }
  },
  
  // Get worker applications
  getWorkerApplications: async () => {
    try {
      const response = await api.get('/applications/worker');
      return response.data;
    } catch (error) {
      console.error('Get Worker Applications API Error:', error);
      throw error;
    }
  },
  
  // Get business applications
  getBusinessApplications: async () => {
    try {
      const response = await api.get('/applications/business');
      return response.data;
    } catch (error) {
      console.error('Get Business Applications API Error:', error);
      throw error;
    }
  }
};

export default api; 