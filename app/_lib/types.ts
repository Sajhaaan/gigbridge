export interface User {
  id: string;
  email: string;
  name: string;
  displayName: string;
  avatar?: string;
  userType: 'worker' | 'business';
  pushToken?: string;
  profile?: {
    bio?: string;
    skills?: string[];
    experience?: string;
  };
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  createdAt: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  postedDate: string;
  companyLogo?: string;
  description: string;
  status?: 'active' | 'closed';
  applicantsCount?: number;
} 