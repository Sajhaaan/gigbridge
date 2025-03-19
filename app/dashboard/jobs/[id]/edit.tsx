import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@providers/AuthContext';

// Mock job data
const mockJob = {
  id: '1',
  title: 'Restaurant Server',
  company: 'Fine Dining Co',
  location: 'San Francisco, CA',
  type: 'Part-time',
  salary: '$20-25/hr',
  description: 'We are looking for an experienced server...',
  requirements: [
    'Previous serving experience',
    'Excellent communication skills',
    'Flexible schedule',
  ],
  responsibilities: [
    'Take customer orders',
    'Serve food and beverages',
    'Process payments',
  ],
  benefits: [
    'Flexible schedule',
    'Health insurance',
    'Employee discounts',
  ],
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
  },
  content: {
    padding: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#111827',
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  listContainer: {
    marginTop: 8,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  listItemText: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  addButtonText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#374151',
  },
  submitButton: {
    backgroundColor: '#3b82f6',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 32,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default function EditJobScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(mockJob);

  const handleUpdateJob = async () => {
    try {
      setLoading(true);
      // In a real app, make an API call to update the job
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      Alert.alert('Success', 'Job updated successfully', [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to update job');
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = (field: 'requirements' | 'responsibilities' | 'benefits') => {
    Alert.prompt(
      `Add ${field.charAt(0).toUpperCase() + field.slice(1)}`,
      'Enter the new item:',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Add',
          onPress: text => {
            if (text) {
              setFormData(prev => ({
                ...prev,
                [field]: [...prev[field], text],
              }));
            }
          },
        },
      ]
    );
  };

  const handleRemoveItem = (
    field: 'requirements' | 'responsibilities' | 'benefits',
    index: number
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  if (user?.role !== 'business') {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={styles.title}>Access Denied</Text>
        <Text style={styles.subtitle}>Only business accounts can edit jobs</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Edit Job</Text>
        <Text style={styles.subtitle}>Update your job listing details</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Job Title</Text>
          <TextInput
            style={styles.input}
            value={formData.title}
            onChangeText={text => setFormData(prev => ({ ...prev, title: text }))}
            placeholder="Enter job title"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Location</Text>
          <TextInput
            style={styles.input}
            value={formData.location}
            onChangeText={text => setFormData(prev => ({ ...prev, location: text }))}
            placeholder="Enter job location"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Job Type</Text>
          <TextInput
            style={styles.input}
            value={formData.type}
            onChangeText={text => setFormData(prev => ({ ...prev, type: text }))}
            placeholder="Enter job type"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Salary</Text>
          <TextInput
            style={styles.input}
            value={formData.salary}
            onChangeText={text => setFormData(prev => ({ ...prev, salary: text }))}
            placeholder="Enter salary range"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.description}
            onChangeText={text => setFormData(prev => ({ ...prev, description: text }))}
            placeholder="Enter job description"
            multiline
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Requirements</Text>
          <View style={styles.listContainer}>
            {formData.requirements.map((item, index) => (
              <View key={index} style={styles.listItem}>
                <Text style={styles.listItemText}>{item}</Text>
                <TouchableOpacity
                  onPress={() => handleRemoveItem('requirements', index)}
                >
                  <Ionicons name="close-circle" size={20} color="#6b7280" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => handleAddItem('requirements')}
          >
            <Ionicons name="add-circle" size={20} color="#374151" />
            <Text style={styles.addButtonText}>Add Requirement</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Responsibilities</Text>
          <View style={styles.listContainer}>
            {formData.responsibilities.map((item, index) => (
              <View key={index} style={styles.listItem}>
                <Text style={styles.listItemText}>{item}</Text>
                <TouchableOpacity
                  onPress={() => handleRemoveItem('responsibilities', index)}
                >
                  <Ionicons name="close-circle" size={20} color="#6b7280" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => handleAddItem('responsibilities')}
          >
            <Ionicons name="add-circle" size={20} color="#374151" />
            <Text style={styles.addButtonText}>Add Responsibility</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Benefits</Text>
          <View style={styles.listContainer}>
            {formData.benefits.map((item, index) => (
              <View key={index} style={styles.listItem}>
                <Text style={styles.listItemText}>{item}</Text>
                <TouchableOpacity
                  onPress={() => handleRemoveItem('benefits', index)}
                >
                  <Ionicons name="close-circle" size={20} color="#6b7280" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => handleAddItem('benefits')}
          >
            <Ionicons name="add-circle" size={20} color="#374151" />
            <Text style={styles.addButtonText}>Add Benefit</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleUpdateJob}
          disabled={loading}
        >
          <Text style={styles.submitButtonText}>
            {loading ? 'Updating...' : 'Update Job'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
} 