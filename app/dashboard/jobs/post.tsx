import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@providers/AuthContext';

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
  form: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    marginHorizontal: -8,
  },
  col: {
    flex: 1,
    paddingHorizontal: 8,
  },
  button: {
    backgroundColor: '#3b82f6',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  listInput: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addButton: {
    backgroundColor: '#3b82f6',
    padding: 8,
    borderRadius: 8,
    marginLeft: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  listItemText: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
  },
  removeButton: {
    padding: 4,
  },
  removeButtonText: {
    color: '#ef4444',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default function PostJobScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    type: '',
    salary: '',
    requirements: [] as string[],
    responsibilities: [] as string[],
    benefits: [] as string[],
  });
  const [newRequirement, setNewRequirement] = useState('');
  const [newResponsibility, setNewResponsibility] = useState('');
  const [newBenefit, setNewBenefit] = useState('');

  const handleAddItem = (field: 'requirements' | 'responsibilities' | 'benefits', value: string) => {
    if (value.trim()) {
      setFormData(prev => ({
        ...prev,
        [field]: [...prev[field], value.trim()],
      }));
      switch (field) {
        case 'requirements':
          setNewRequirement('');
          break;
        case 'responsibilities':
          setNewResponsibility('');
          break;
        case 'benefits':
          setNewBenefit('');
          break;
      }
    }
  };

  const handleRemoveItem = (field: 'requirements' | 'responsibilities' | 'benefits', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.description || !formData.location || !formData.type || !formData.salary) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      // In a real app, make an API call to create the job listing
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      Alert.alert(
        'Success',
        'Job listing created successfully',
        [
          {
            text: 'OK',
            onPress: () => router.push('/dashboard/jobs'),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to create job listing');
    } finally {
      setLoading(false);
    }
  };

  if (user?.role !== 'business') {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={styles.title}>Access Denied</Text>
        <Text style={styles.subtitle}>Only business accounts can post jobs</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Post a New Job</Text>
        <Text style={styles.subtitle}>Create a new job listing to find workers</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Information</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Job Title *</Text>
            <TextInput
              style={styles.input}
              value={formData.title}
              onChangeText={text => setFormData(prev => ({ ...prev, title: text }))}
              placeholder="e.g. Restaurant Server"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.description}
              onChangeText={text => setFormData(prev => ({ ...prev, description: text }))}
              placeholder="Describe the role and your ideal candidate..."
              multiline
              numberOfLines={6}
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.col, styles.inputGroup]}>
              <Text style={styles.label}>Location *</Text>
              <TextInput
                style={styles.input}
                value={formData.location}
                onChangeText={text => setFormData(prev => ({ ...prev, location: text }))}
                placeholder="e.g. San Francisco, CA"
              />
            </View>

            <View style={[styles.col, styles.inputGroup]}>
              <Text style={styles.label}>Job Type *</Text>
              <TextInput
                style={styles.input}
                value={formData.type}
                onChangeText={text => setFormData(prev => ({ ...prev, type: text }))}
                placeholder="e.g. Full-time"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Salary Range *</Text>
            <TextInput
              style={styles.input}
              value={formData.salary}
              onChangeText={text => setFormData(prev => ({ ...prev, salary: text }))}
              placeholder="e.g. $20-25/hr"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Requirements</Text>
          <View style={styles.listInput}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              value={newRequirement}
              onChangeText={setNewRequirement}
              placeholder="Add a requirement"
              onSubmitEditing={() => handleAddItem('requirements', newRequirement)}
            />
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => handleAddItem('requirements', newRequirement)}
            >
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          </View>
          {formData.requirements.map((req, index) => (
            <View key={index} style={styles.listItem}>
              <Text style={styles.listItemText}>{req}</Text>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => handleRemoveItem('requirements', index)}
              >
                <Text style={styles.removeButtonText}>Remove</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Responsibilities</Text>
          <View style={styles.listInput}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              value={newResponsibility}
              onChangeText={setNewResponsibility}
              placeholder="Add a responsibility"
              onSubmitEditing={() => handleAddItem('responsibilities', newResponsibility)}
            />
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => handleAddItem('responsibilities', newResponsibility)}
            >
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          </View>
          {formData.responsibilities.map((resp, index) => (
            <View key={index} style={styles.listItem}>
              <Text style={styles.listItemText}>{resp}</Text>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => handleRemoveItem('responsibilities', index)}
              >
                <Text style={styles.removeButtonText}>Remove</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Benefits</Text>
          <View style={styles.listInput}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              value={newBenefit}
              onChangeText={setNewBenefit}
              placeholder="Add a benefit"
              onSubmitEditing={() => handleAddItem('benefits', newBenefit)}
            />
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => handleAddItem('benefits', newBenefit)}
            >
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          </View>
          {formData.benefits.map((benefit, index) => (
            <View key={index} style={styles.listItem}>
              <Text style={styles.listItemText}>{benefit}</Text>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => handleRemoveItem('benefits', index)}
              >
                <Text style={styles.removeButtonText}>Remove</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.button, loading && { opacity: 0.7 }]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Creating...' : 'Create Job Listing'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
} 