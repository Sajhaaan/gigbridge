import { NavigatorScreenParams } from '@react-navigation/native';
import { Job } from '../types';

export type MainStackParamList = {
  Dashboard: undefined;
  Jobs: undefined;
  Messages: undefined;
  Chat: { conversationId: string; recipientId: string };
  Profile: undefined;
  EditProfile: undefined;
  JobDetails: { jobId: string };
  PostJob: undefined;
  ManageJobs: undefined;
  JobApplicants: { jobId: string };
};

export type MainTabsParamList = {
  Home: undefined;
  Jobs: undefined;
  Messages: undefined;
  Profile: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
  ForgotPassword: undefined;
  ProfileSetup: undefined;
};

export type RootStackParamList = {
  Main: NavigatorScreenParams<MainStackParamList>;
  Auth: NavigatorScreenParams<AuthStackParamList>;
}; 