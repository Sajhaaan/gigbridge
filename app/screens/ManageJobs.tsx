import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../navigation/types';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '@providers/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '@providers/AuthContext';
import axios from 'axios';

type ManageJobsNavigationProp = NativeStackNavigationProp<MainStackParamList, 'ManageJobs'>;

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  description: string;
  postedDate: string;
  companyLogo?: string;
  status: 'active' | 'closed';
  applicantsCount: number;
}

export default function ManageJobsScreen() {
  const navigation = useNavigation<ManageJobsNavigationProp>();
  const theme = useAppTheme();
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<'active' | 'closed'>('active');

  const fetchJobs = useCallback(async () => {
    try {
      const response = await axios.get('/api/jobs/my-jobs');
      setJobs(response.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      Alert.alert('Error', 'Failed to load jobs. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleCloseJob = async (jobId: string) => {
    Alert.alert(
      'Close Job',
      'Are you sure you want to close this job posting?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Close',
          style: 'destructive',
          onPress: async () => {
            try {
              await axios.patch(`/api/jobs/${jobId}`, { status: 'closed' });
              setJobs(current =>
                current.map(job =>
                  job.id === jobId
                    ? { ...job, status: 'closed' }
                    : job
                )
              );
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
    <View style={[styles.jobCard, { backgroundColor: theme.card }]}>
      <View style={styles.jobHeader}>
        <View style={styles.jobTitleContainer}>
          <Text style={[styles.jobTitle, { color: theme.text }]} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={[styles.companyName, { color: theme.subtext }]} numberOfLines={1}>
            {item.company}
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.statusBadge, { backgroundColor: theme.input }]}
          onPress={() => item.status === 'active' && handleCloseJob(item.id)}
        >
          <Text
            style={[
              styles.statusText,
              { color: item.status === 'active' ? theme.success : theme.error },
            ]}
          >
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.jobDetails}>
        <View style={styles.detailItem}>
          <Ionicons name="location-outline" size={16} color={theme.subtext} />
          <Text style={[styles.detailText, { color: theme.subtext }]} numberOfLines={1}>
            {item.location}
          </Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="cash-outline" size={16} color={theme.subtext} />
          <Text style={[styles.detailText, { color: theme.subtext }]} numberOfLines={1}>
            {item.salary}
          </Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="time-outline" size={16} color={theme.subtext} />
          <Text style={[styles.detailText, { color: theme.subtext }]} numberOfLines={1}>
            {item.type}
          </Text>
        </View>
      </View>

      <View style={styles.jobFooter}>
        <Text style={[styles.postedDate, { color: theme.subtext }]}>
          Posted {item.postedDate}
        </Text>
        <TouchableOpacity
          style={styles.applicantsButton}
          onPress={() => navigation.navigate('JobApplicants', { jobId: item.id })}
        >
          <LinearGradient
            colors={theme.gradients.secondary}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.applicantsButtonGradient}
          >
            <Ionicons name="people" size={20} color="#FFFFFF" />
            <Text style={styles.applicantsButtonText}>
              {item.applicantsCount} Applicant{item.applicantsCount !== 1 ? 's' : ''}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <TouchableOpacity
          style={[styles.backButton, { backgroundColor: theme.input }]}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.text }]}>Manage Jobs</Text>
      </View>

      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            selectedFilter === 'active' && { backgroundColor: theme.accent },
          ]}
          onPress={() => setSelectedFilter('active')}
        >
          <Text
            style={[
              styles.filterButtonText,
              { color: selectedFilter === 'active' ? '#FFFFFF' : theme.text },
            ]}
          >
            Active
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            selectedFilter === 'closed' && { backgroundColor: theme.accent },
          ]}
          onPress={() => setSelectedFilter('closed')}
        >
          <Text
            style={[
              styles.filterButtonText,
              { color: selectedFilter === 'closed' ? '#FFFFFF' : theme.text },
            ]}
          >
            Closed
          </Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.accent} />
        </View>
      ) : (
        <FlatList
          data={jobs.filter(job => job.status === selectedFilter)}
          renderItem={renderJobCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.jobsList}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="briefcase-outline" size={48} color={theme.subtext} />
              <Text style={[styles.emptyText, { color: theme.subtext }]}>
                No {selectedFilter} jobs found
              </Text>
            </View>
          }
        />
      )}

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('PostJob')}
      >
        <LinearGradient
          colors={theme.gradients.primary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.addButtonGradient}
        >
          <Ionicons name="add" size={24} color="#FFFFFF" />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
  },
  filterContainer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  jobsList: {
    padding: 24,
    gap: 16,
  },
  jobCard: {
    borderRadius: 16,
    padding: 16,
    gap: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  jobTitleContainer: {
    flex: 1,
    marginRight: 16,
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
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  jobDetails: {
    flexDirection: 'row',
    gap: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: 14,
  },
  jobFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  postedDate: {
    fontSize: 12,
  },
  applicantsButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  applicantsButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  applicantsButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  addButton: {
    position: 'absolute',
    right: 24,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
  addButtonGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    paddingTop: 48,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
  },
}); 