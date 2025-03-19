import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ShiftsPage() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Shifts</Text>
      <Text style={styles.subtitle}>Your upcoming and past shifts will appear here.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#111827',
  },
  subtitle: {
    fontSize: 16,
    color: '#4b5563',
  },
}); 