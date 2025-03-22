import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Redirect } from 'expo-router';
import { useAuth } from '../providers/AuthContext';

export default function Dashboard() {
  const { user, isBusiness } = useAuth();

  if (isBusiness()) {
    return <Redirect href="/dashboard/hirer-dashboard" />;
  }
  
  return <Redirect href="/dashboard/worker-dashboard" />;
} 