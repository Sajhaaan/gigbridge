import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@providers/AuthContext';

// Mock data for job listings
const mockJobListings = [
  {
    id: '1',
    title: 'Restaurant Server',
    location: 'San Francisco, CA',
    type: 'Part-time',
    salary: '$20-25/hr',
    status: 'active',
    applicants: 12,
    postedAt: '2024-03-14',
  },
  {
    id: '2',
    title: 'Event Staff',
    location: 'Los Angeles, CA',
    type: 'Contract',
    salary: '$18-22/hr',
    status: 'active',
    applicants: 8,
    postedAt: '2024-03-13',
  },
  {
    id: '3',
    title: 'Bartender',
    location: 'San Francisco, CA',
    type: 'Full-time',
    salary: '$25-30/hr',
    status: 'closed',
    applicants: 15,
    postedAt: '2024-03-10',
  },
];

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
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  postButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3b82f6',
    padding: 12,
    borderRadius: 8,
  },
  postButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
  content: {
    padding: 20,
  },
  jobCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  jobInfo: {
    flex: 1,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  jobMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 4,
  },
  metaText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#6b7280',
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 16,
    backgroundColor: '#e5e7eb',
  },
  statusBadgeActive: {
    backgroundColor: '#dcfce7',
  },
  statusBadgeClosed: {
    backgroundColor: '#fee2e2',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
  },
  statusTextActive: {
    color: '#166534',
  },
  statusTextClosed: {
    color: '#991b1b',
  },
  applicantsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    padding: 8,
    borderRadius: 8,
    marginRight: 8,
  },
  applicantsButtonText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#374151',
  },
  actionButton: {
    padding: 8,
  },
  menuButton: {
    padding: 8,
  },
});

export default function ManageJobsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleViewApplicants = (jobId: string) => {
    router.push(`/dashboard/jobs/${jobId}/applicants`);
  };

  const handleEditJob = (jobId: string) => {
    router.push(`/dashboard/jobs/${jobId}/edit`);
  };

  const handleToggleJobStatus = async (jobId: string, currentStatus: string) => {
    try {
      setLoading(true);
      // In a real app, make an API call to update the job status
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      Alert.alert('Success', 'Job status updated successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to update job status');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteJob = (jobId: string) => {
    Alert.alert(
      'Delete Job',
      'Are you sure you want to delete this job listing? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              // In a real app, make an API call to delete the job
              await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
              Alert.alert('Success', 'Job listing deleted successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete job listing');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  if (user?.userType !== 'business') {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={styles.title}>Access Denied</Text>
        <Text style={styles.subtitle}>Only business accounts can manage jobs</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Manage Jobs</Text>
        <Text style={styles.subtitle}>View and manage your job listings</Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.postButton}
          onPress={() => router.push('/dashboard/jobs/post')}
        >
          <Ionicons name="add" size={20} color="#fff" />
          <Text style={styles.postButtonText}>Post New Job</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {mockJobListings.map(job => (
          <View key={job.id} style={styles.jobCard}>
            <View style={styles.jobHeader}>
              <View style={styles.jobInfo}>
                <Text style={styles.jobTitle}>{job.title}</Text>
                <View style={styles.jobMeta}>
                  <View style={styles.metaItem}>
                    <Ionicons name="location" size={16} color="#6b7280" />
                    <Text style={styles.metaText}>{job.location}</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Ionicons name="time" size={16} color="#6b7280" />
                    <Text style={styles.metaText}>{job.type}</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Ionicons name="cash" size={16} color="#6b7280" />
                    <Text style={styles.metaText}>{job.salary}</Text>
                  </View>
                </View>
              </View>

              <View
                style={[
                  styles.statusBadge,
                  job.status === 'active'
                    ? styles.statusBadgeActive
                    : styles.statusBadgeClosed,
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    job.status === 'active'
                      ? styles.statusTextActive
                      : styles.statusTextClosed,
                  ]}
                >
                  {job.status === 'active' ? 'Active' : 'Closed'}
                </Text>
              </View>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity
                  style={styles.applicantsButton}
                  onPress={() => handleViewApplicants(job.id)}
                >
                  <Ionicons name="people" size={16} color="#374151" />
                  <Text style={styles.applicantsButtonText}>
                    {job.applicants} Applicants
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleEditJob(job.id)}
                >
                  <Ionicons name="create" size={20} color="#6b7280" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleToggleJobStatus(job.id, job.status)}
                  disabled={loading}
                >
                  <Ionicons
                    name={job.status === 'active' ? 'close-circle' : 'checkmark-circle'}
                    size={20}
                    color="#6b7280"
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleDeleteJob(job.id)}
                  disabled={loading}
                >
                  <Ionicons name="trash" size={20} color="#ef4444" />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={styles.menuButton}
                onPress={() => router.push(`/dashboard/jobs/${job.id}`)}
              >
                <Ionicons name="chevron-forward" size={20} color="#6b7280" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
} 