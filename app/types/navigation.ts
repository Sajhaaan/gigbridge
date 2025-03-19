import { NavigatorScreenParams } from '@react-navigation/native';
import { User, Job } from './index';

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainTabParamList>;
};

export type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
  ForgotPassword: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Search: undefined;
  Messages: undefined;
  Profile: undefined;
};

export type HomeStackParamList = {
  HomeScreen: undefined;
  JobDetails: { jobId: string };
  CreateJob: undefined;
  EditJob: { jobId: string };
  JobApplications: { jobId: string };
  WorkerProfile: { userId: string };
  BusinessProfile: { userId: string };
};

export type SearchStackParamList = {
  SearchScreen: undefined;
  JobDetails: { jobId: string };
  WorkerProfile: { userId: string };
  BusinessProfile: { userId: string };
};

export type MessagesStackParamList = {
  MessagesList: undefined;
  Chat: { 
    jobId: string;
    otherUserId: string;
    otherUserName: string;
  };
};

export type ProfileStackParamList = {
  ProfileScreen: undefined;
  EditProfile: undefined;
  Settings: undefined;
  JobHistory: undefined;
  Reviews: undefined;
}; 