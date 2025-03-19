import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { NavigatorScreenParams } from '@react-navigation/native';

export type MainStackParamList = {
  MainTabs: undefined;
  JobDetails: {
    job: {
      id: string;
      title: string;
      company: string;
      location: string;
      salary: string;
      type: string;
      postedDate: string;
      companyLogo: string | null;
      description: string;
    };
  };
  PostJob: undefined;
  ManageJobs: undefined;
  JobApplicants: { jobId: string };
  Chat: {
    name: string;
    avatar: string;
    userId: string;
  };
  Profile: undefined;
  Auth: NavigatorScreenParams<AuthStackParamList>;
};

export type MainStackNavigationProp = NativeStackNavigationProp<MainStackParamList>;

export type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Signup: undefined;
  ProfileSetup: undefined;
};

export type AuthStackNavigationProp = NativeStackNavigationProp<AuthStackParamList>;

export type RootStackParamList = {
  Main: NavigatorScreenParams<MainStackParamList>;
  Auth: NavigatorScreenParams<AuthStackParamList>;
};

export type RootStackNavigationProp = NativeStackNavigationProp<RootStackParamList>; 