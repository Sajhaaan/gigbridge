import React, { useEffect, useState } from 'react';
import { Redirect, Stack } from 'expo-router';
import { useAuth } from '../providers/AuthContext';
import { View, ActivityIndicator } from 'react-native';

export default function DashboardLayout() {
  const { user, loading } = useAuth();

  // Show loading indicator while auth is loading
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' }}>
        <ActivityIndicator size="large" color="#6C5CE7" />
      </View>
    );
  }

  // If not logged in, redirect to welcome screen
  if (!user) {
    return <Redirect href="/welcome" />;
  }

  // Show the stack navigator for all users
  // The redirect to hirer-dashboard will happen inside the index.tsx for business users
  // This prevents the infinite recursion that was happening with redirects
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="profile" />
      <Stack.Screen name="edit-profile" />
      <Stack.Screen name="messages" />
      <Stack.Screen name="job-listings" />
      <Stack.Screen name="jobs/[id]" />
      <Stack.Screen name="hirer-dashboard" />
    </Stack>
  );
} 