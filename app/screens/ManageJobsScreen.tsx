import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  useColorScheme,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../navigation/types';
import { useAuth } from '@providers/AuthContext';
import axios from 'axios';
import { API_URL } from '../config';

type ManageJobsScreenNavigationProp = NativeStackNavigationProp<MainStackParamList>;

interface Job {
  id: string;
  title: string;
  companyName: string;
  location: string;
  salary: string;
  type: string;
  postedDate: string;
  status: 'active' | 'closed';
  applicantsCount: number;
}

export default function ManageJobsScreen() {
  const navigation = useNavigation<ManageJobsScreenNavigationProp>();
  const { user } = useAuth();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const colors = {
    background: isDark ? '#1A1A1A' : '#F8F9FA',
    text: isDark ? '#FFFFFF' : '#2D3436',
    subtext: isDark ? '#A0A0A0' : '#636E72',
    accent: '#3498DB',
    card: isDark ? 'rgba(45, 45, 45, 0.95)' : 'rgba(255, 255, 255, 0.95)',
    border: isDark ? 'rgba(64, 64, 64, 0.5)' : 'rgba(224, 224, 224, 0.5)',
    success: '#22C55E',
    error: '#FF5252',
  };

  const fetchJobs = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/jobs/employer/${user?.id}`);
      setJobs(response.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      Alert.alert('Error', 'Failed to fetch jobs. Please try again.');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchJobs();
  };

  const handleCloseJob = async (jobId: string) => {
    Alert.alert(
      'Close Job',
      'Are you sure you want to close this job posting?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Close',
          style: 'destructive',
          onPress: async () => {
            try {
              await axios.patch(`${API_URL}/api/jobs/${jobId}`, { status: 'closed' });
              fetchJobs();
            } catch (error) {
              console.error('Error closing job:', error);
              Alert.alert('Error', 'Failed to close job. Please try again.');
            }
          },
        },
      ]
    );
  };

  const renderJobCard = ({ item }: { item: Job }) => (
    <TouchableOpacity
      style={[styles.jobCard, { backgroundColor: colors.card }]}
      onPress={() => navigation.navigate('JobDetails', { job: item })}
    >
      <View style={styles.jobHeader}>
        <View>
          <Text style={[styles.jobTitle, { color: colors.text }]}>{item.title}</Text>
          <Text style={[styles.companyName, { color: colors.subtext }]}>{item.companyName}</Text>
        </View>
        <View style={[
          styles.statusBadge,
          { backgroundColor: item.status === 'active' ? colors.success + '20' : colors.error + '20' }
        ]}>
          <Text style={[
            styles.statusText,
            { color: item.status === 'active' ? colors.success : colors.error }
          ]}>
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </Text>
        </View>
      </View>

      <View style={styles.jobDetails}>
        <View style={styles.detailItem}>
          <Ionicons name="location-outline" size={16} color={colors.subtext} />
          <Text style={[styles.detailText, { color: colors.subtext }]}>{item.location}</Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="cash-outline" size={16} color={colors.subtext} />
          <Text style={[styles.detailText, { color: colors.subtext }]}>{item.salary}</Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="people-outline" size={16} color={colors.subtext} />
          <Text style={[styles.detailText, { color: colors.subtext }]}>
            {item.applicantsCount} {item.applicantsCount === 1 ? 'Applicant' : 'Applicants'}
          </Text>
        </View>
      </View>

      {item.status === 'active' && (
        <TouchableOpacity
          style={[styles.closeButton, { backgroundColor: colors.error + '20' }]}
          onPress={() => handleCloseJob(item.id)}
        >
          <Ionicons name="close-circle-outline" size={20} color={colors.error} />
          <Text style={[styles.closeButtonText, { color: colors.error }]}>Close Job</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Manage Jobs</Text>
        <TouchableOpacity
          style={[styles.postButton, { backgroundColor: colors.accent }]}
          onPress={() => navigation.navigate('PostJob')}
        >
          <Ionicons name="add" size={24} color="#fff" />
          <Text style={styles.postButtonText}>Post Job</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={jobs}
        renderItem={renderJobCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.text}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={[styles.emptyStateText, { color: colors.subtext }]}>
              No job postings yet
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  postButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 4,
  },
  postButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  listContent: {
    padding: 16,
    gap: 16,
  },
  jobCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  companyName: {
    fontSize: 14,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  jobDetails: {
    gap: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
  },
  closeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 16,
    gap: 8,
  },
  closeButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
  },
  emptyStateText: {
    fontSize: 16,
  },
}); 