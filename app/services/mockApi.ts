import AsyncStorage from '@react-native-async-storage/async-storage';

// Job type definition
interface Job {
  id: string;
  title: string;
  description: string;
  location: string;
  pay: string;
  paymentType: string;
  startTime: string;
  safetyTags?: string[];
  createdAt?: string;
  updatedAt?: string;
}

// Mock job data
let MOCK_JOBS: Job[] = [];

// Helper function to simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Initialize jobs from AsyncStorage if available
const initializeMockData = async () => {
  try {
    const storedJobs = await AsyncStorage.getItem('mockJobs');
    if (storedJobs) {
      MOCK_JOBS = JSON.parse(storedJobs);
    }
  } catch (error) {
    console.error('Error initializing mock data:', error);
  }
};

// Initialize on import
initializeMockData();

export const mockJobsAPI = {
  // Get all jobs
  getAllJobs: async () => {
    await delay(500);
    return { jobs: MOCK_JOBS };
  },
  
  // Get job by ID
  getJobById: async (jobId: string) => {
    await delay(300);
    const job = MOCK_JOBS.find(job => job.id === jobId);
    if (!job) {
      throw new Error('Job not found');
    }
    return { job };
  },
  
  // Create a new job
  createJob: async (jobData: Omit<Job, 'id' | 'createdAt' | 'updatedAt'>) => {
    await delay(800);
    
    const newJob: Job = {
      id: Date.now().toString(),
      ...jobData,
      createdAt: new Date().toISOString(),
    };
    
    MOCK_JOBS.push(newJob);
    
    // Store in AsyncStorage
    try {
      await AsyncStorage.setItem('mockJobs', JSON.stringify(MOCK_JOBS));
    } catch (error) {
      console.error('Error saving job data:', error);
    }
    
    return { success: true, job: newJob };
  },
  
  // Update a job
  updateJob: async (jobId: string, jobData: Partial<Job>) => {
    await delay(600);
    
    const jobIndex = MOCK_JOBS.findIndex(job => job.id === jobId);
    if (jobIndex === -1) {
      throw new Error('Job not found');
    }
    
    MOCK_JOBS[jobIndex] = {
      ...MOCK_JOBS[jobIndex],
      ...jobData,
      updatedAt: new Date().toISOString(),
    };
    
    // Store in AsyncStorage
    try {
      await AsyncStorage.setItem('mockJobs', JSON.stringify(MOCK_JOBS));
    } catch (error) {
      console.error('Error updating job data:', error);
    }
    
    return { success: true, job: MOCK_JOBS[jobIndex] };
  },
  
  // Delete a job
  deleteJob: async (jobId: string) => {
    await delay(400);
    
    const jobIndex = MOCK_JOBS.findIndex(job => job.id === jobId);
    if (jobIndex === -1) {
      throw new Error('Job not found');
    }
    
    MOCK_JOBS = MOCK_JOBS.filter(job => job.id !== jobId);
    
    // Store in AsyncStorage
    try {
      await AsyncStorage.setItem('mockJobs', JSON.stringify(MOCK_JOBS));
    } catch (error) {
      console.error('Error deleting job data:', error);
    }
    
    return { success: true };
  }
}; 