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
  content: {
    fontSize: 16,
    color: '#4b5563',
  },
});

export default function ManageShiftsScreen() {
  const { user } = useAuth();

  if (user?.role !== 'business') {
    return (
      <View style={styles.container}>
        <Text style={styles.content}>
          Access denied. This page is only available for business accounts.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manage Shifts</Text>
      <Text style={styles.content}>
        Here you can manage your shifts and worker schedules.
      </Text>
    </View>
  );
} 