import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { NavigatorScreenParams } from '@react-navigation/native';

export type MainStackParamList = {
  MainTabs: undefined;
  Jobs: undefined;
  JobDetails: {
    job: {
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
    };
  };
  PostJob: undefined;
  ManageJobs: undefined;
  JobApplicants: {
    jobId: string;
  };
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Chat: {
    name: string;
    avatar: string;
    userId: string;
  };
  EditProfile: undefined;
};

export type MainTabsParamList = {
  Home: undefined;
  Jobs: undefined;
  Messages: undefined;
  Profile: undefined;
  PostJob: undefined;
  ManageJobs: undefined;
};

export type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Signup: undefined;
  ProfileSetup: undefined;
};

export type RootStackParamList = {
  Main: NavigatorScreenParams<MainStackParamList>;
  Auth: NavigatorScreenParams<AuthStackParamList>;
};

export type MainStackNavigationProp = NativeStackNavigationProp<MainStackParamList>;
export type AuthStackNavigationProp = NativeStackNavigationProp<AuthStackParamList>;
export type RootStackNavigationProp = NativeStackNavigationProp<RootStackParamList>; 