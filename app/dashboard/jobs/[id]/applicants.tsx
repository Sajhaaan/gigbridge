import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@providers/AuthContext';

// Mock data for job applicants
const mockApplicants = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    experience: '3 years',
    appliedAt: '2024-03-14',
    status: 'pending',
    coverLetter: 'I am excited about this opportunity...',
    avatar: 'https://i.pravatar.cc/150?img=1',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '+1 (555) 987-6543',
    experience: '5 years',
    appliedAt: '2024-03-13',
    status: 'reviewed',
    coverLetter: 'With my extensive experience in...',
    avatar: 'https://i.pravatar.cc/150?img=2',
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike.johnson@example.com',
    phone: '+1 (555) 456-7890',
    experience: '2 years',
    appliedAt: '2024-03-12',
    status: 'contacted',
    coverLetter: 'I believe I would be a great fit...',
    avatar: 'https://i.pravatar.cc/150?img=3',
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
  content: {
    padding: 20,
  },
  applicantCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  applicantHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  applicantInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  meta: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 2,
  },
  statusBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 16,
    backgroundColor: '#e5e7eb',
  },
  statusBadgePending: {
    backgroundColor: '#fef3c7',
  },
  statusBadgeReviewed: {
    backgroundColor: '#dbeafe',
  },
  statusBadgeContacted: {
    backgroundColor: '#dcfce7',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
  },
  statusTextPending: {
    color: '#92400e',
  },
  statusTextReviewed: {
    color: '#1e40af',
  },
  statusTextContacted: {
    color: '#166534',
  },
  coverLetter: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  coverLetterText: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    padding: 8,
    borderRadius: 8,
    marginLeft: 8,
  },
  actionButtonText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#374151',
  },
});

export default function ApplicantsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleUpdateStatus = async (applicantId: string, newStatus: string) => {
    try {
      setLoading(true);
      // In a real app, make an API call to update the applicant status
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      Alert.alert('Success', 'Applicant status updated successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to update applicant status');
    } finally {
      setLoading(false);
    }
  };

  const handleContact = (applicant: any) => {
    Alert.alert(
      'Contact Applicant',
      `Would you like to contact ${applicant.name}?`,
      [
        {
          text: 'Email',
          onPress: () => {
            // In a real app, implement email functionality
            Alert.alert('Info', `Sending email to ${applicant.email}`);
          },
        },
        {
          text: 'Call',
          onPress: () => {
            // In a real app, implement phone call functionality
            Alert.alert('Info', `Calling ${applicant.phone}`);
          },
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };

  if (user?.role !== 'business') {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={styles.title}>Access Denied</Text>
        <Text style={styles.subtitle}>Only business accounts can view applicants</Text>
      </View>
    );
  }

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'pending':
        return {
          badge: styles.statusBadgePending,
          text: styles.statusTextPending,
        };
      case 'reviewed':
        return {
          badge: styles.statusBadgeReviewed,
          text: styles.statusTextReviewed,
        };
      case 'contacted':
        return {
          badge: styles.statusBadgeContacted,
          text: styles.statusTextContacted,
        };
      default:
        return {
          badge: {},
          text: {},
        };
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Job Applicants</Text>
        <Text style={styles.subtitle}>Review and manage applicants for this position</Text>
      </View>

      <View style={styles.content}>
        {mockApplicants.map(applicant => (
          <View key={applicant.id} style={styles.applicantCard}>
            <View
              style={[styles.statusBadge, getStatusStyles(applicant.status).badge]}
            >
              <Text
                style={[styles.statusText, getStatusStyles(applicant.status).text]}
              >
                {applicant.status.charAt(0).toUpperCase() + applicant.status.slice(1)}
              </Text>
            </View>

            <View style={styles.applicantHeader}>
              <Image source={{ uri: applicant.avatar }} style={styles.avatar} />
              <View style={styles.applicantInfo}>
                <Text style={styles.name}>{applicant.name}</Text>
                <Text style={styles.meta}>{applicant.email}</Text>
                <Text style={styles.meta}>{applicant.phone}</Text>
                <Text style={styles.meta}>Experience: {applicant.experience}</Text>
                <Text style={styles.meta}>
                  Applied: {new Date(applicant.appliedAt).toLocaleDateString()}
                </Text>
              </View>
            </View>

            <View style={styles.coverLetter}>
              <Text style={styles.coverLetterText}>{applicant.coverLetter}</Text>
            </View>

            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleUpdateStatus(applicant.id, 'reviewed')}
                disabled={loading}
              >
                <Ionicons name="checkmark-circle" size={20} color="#374151" />
                <Text style={styles.actionButtonText}>Mark as Reviewed</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleContact(applicant)}
                disabled={loading}
              >
                <Ionicons name="mail" size={20} color="#374151" />
                <Text style={styles.actionButtonText}>Contact</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
} 