"use client";

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAuth } from '@providers/AuthContext';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#111827',
  },
  welcomeText: {
    fontSize: 16,
    color: '#4b5563',
  },
});

export default function DashboardScreen() {
  const { user } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>
      <Text style={styles.welcomeText}>
        Welcome back, {user?.name || 'User'}!
      </Text>
    </View>
  );
} 