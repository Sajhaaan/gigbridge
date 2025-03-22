export interface User {
  id: string;
  fullName: string;
  email: string;
  userType: 'worker' | 'business';
  token?: string;
  profileImage?: string;
  avatar?: string;
  profile?: {
    bio?: string;
    skills?: string[];
    experience?: string;
    hourlyRate?: number;
    availability?: {
      [key: string]: {
        start: string;
        end: string;
      }[];
    };
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  budget: number;
  status: 'open' | 'in_progress' | 'completed' | 'cancelled';
  category: string;
  location: string;
  businessId: string;
  business: User;
  workerId?: string;
  worker?: User;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  jobId: string;
  job: Job;
  reviewerId: string;
  reviewer: User;
  revieweeId: string;
  reviewee: User;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  text: string;
  senderId: string;
  receiverId: string;
  createdAt: string;
  read: boolean;
}

export interface Conversation {
  id: string;
  participants: User[];
  lastMessage?: Message;
  updatedAt: string;
}

export interface NavigationProps {
  navigation: any;
  route: any;
}

export default {}; 