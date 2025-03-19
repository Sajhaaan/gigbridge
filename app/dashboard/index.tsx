import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useRouter, Redirect } from 'expo-router';
import { useAuth } from '../providers/AuthContext';
import WorkerDashboard from './worker-dashboard';

export default function Dashboard() {
  const { user, isBusiness } = useAuth();
  const router = useRouter();
  
  // If user is a business type, redirect to hirer-dashboard
  if (user && isBusiness()) {
    return <Redirect href="/dashboard/hirer-dashboard" />;
  }
  
  // For workers, show the worker dashboard
  return <WorkerDashboard />;
} 