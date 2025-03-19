import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
  StatusBar,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../navigation/types';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '@providers/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '@providers/AuthContext';
import axios from 'axios';

type JobDetailsRouteProp = RouteProp<MainStackParamList, 'JobDetails'>;
type JobDetailsNavigationProp = NativeStackNavigationProp<MainStackParamList, 'JobDetails'>;

interface User {
  id: string;
  email: string;
  type: 'worker' | 'hirer';
}

export default function JobDetailsScreen() {
  const navigation = useNavigation<JobDetailsNavigationProp>();
  const route = useRoute<JobDetailsRouteProp>();
  const theme = useAppTheme();
  const { user } = useAuth() as { user: User | null };
  const [isApplying, setIsApplying] = useState(false);
  const { job } = route.params;

  const handleApply = async () => {
    if (!user) {
      Alert.alert(
        'Sign In Required',
        'Please sign in to apply for this job',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Sign In', onPress: () => navigation.navigate('Auth', { screen: 'Login' }) }
        ]
      );
      return;
    }

    setIsApplying(true);
    try {
      await axios.post(`/api/jobs/${job.id}/apply`);
      Alert.alert('Success', 'Your application has been submitted successfully');
      navigation.goBack();
    } catch (error) {
      console.error('Error applying to job:', error);
      Alert.alert('Error', 'Failed to submit application. Please try again.');
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle="light-content" />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={[styles.backButton, { backgroundColor: theme.input }]}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={theme.text} />
          </TouchableOpacity>
          {user?.type === 'hirer' && job.status !== 'closed' && (
            <TouchableOpacity
              style={[styles.closeButton, { backgroundColor: theme.error }]}
              onPress={() => {
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
                          await axios.patch(`/api/jobs/${job.id}`, { status: 'closed' });
                          navigation.goBack();
                        } catch (error) {
                          console.error('Error closing job:', error);
                          Alert.alert('Error', 'Failed to close job. Please try again.');
                        }
                      },
                    },
                  ]
                );
              }}
            >
              <Ionicons name="close-circle" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.jobHeader}>
          <View style={styles.jobTitleContainer}>
            <Text style={[styles.jobTitle, { color: theme.text }]}>{job.title}</Text>
            <Text style={[styles.companyName, { color: theme.subtext }]}>{job.company}</Text>
          </View>
          {job.companyLogo ? (
            <View style={[styles.logoContainer, { backgroundColor: theme.input }]}>
              <Image source={{ uri: job.companyLogo }} style={styles.companyLogo} />
            </View>
          ) : (
            <View style={[styles.logoPlaceholder, { backgroundColor: theme.input }]}>
              <Ionicons name="business-outline" size={32} color={theme.subtext} />
            </View>
          )}
        </View>

        <View style={styles.jobMeta}>
          <View style={[styles.metaCard, { backgroundColor: theme.card }]}>
            <View style={styles.metaItem}>
              <Ionicons name="location-outline" size={20} color={theme.subtext} />
              <Text style={[styles.metaText, { color: theme.text }]}>{job.location}</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="cash-outline" size={20} color={theme.subtext} />
              <Text style={[styles.metaText, { color: theme.text }]}>{job.salary}</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="time-outline" size={20} color={theme.subtext} />
              <Text style={[styles.metaText, { color: theme.text }]}>{job.type}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Job Description</Text>
          <Text style={[styles.description, { color: theme.text }]}>{job.description}</Text>
        </View>

        {job.status === 'closed' ? (
          <View style={[styles.closedBanner, { backgroundColor: theme.error }]}>
            <Ionicons name="alert-circle" size={24} color="#FFFFFF" />
            <Text style={styles.closedText}>This job is no longer accepting applications</Text>
          </View>
        ) : user?.type === 'hirer' ? (
          <TouchableOpacity
            style={styles.applicantsButton}
            onPress={() => navigation.navigate('JobApplicants', { jobId: job.id })}
          >
            <LinearGradient
              colors={theme.gradients.secondary}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.applicantsButtonGradient}
            >
              <Ionicons name="people" size={24} color="#FFFFFF" />
              <Text style={styles.applicantsButtonText}>
                View Applicants ({job.applicantsCount || 0})
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.applyButton, isApplying && styles.applyButtonDisabled]}
            onPress={handleApply}
            disabled={isApplying}
          >
            <LinearGradient
              colors={theme.gradients.primary}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.applyButtonGradient}
            >
              {isApplying ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Text style={styles.applyButtonText}>Apply Now</Text>
                  <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  jobTitleContainer: {
    flex: 1,
    marginRight: 16,
  },
  jobTitle: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  companyName: {
    fontSize: 18,
    fontWeight: '500',
  },
  logoContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    overflow: 'hidden',
  },
  companyLogo: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  logoPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  jobMeta: {
    marginBottom: 32,
  },
  metaCard: {
    padding: 16,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metaText: {
    fontSize: 16,
    fontWeight: '500',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  closedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
  },
  closedText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  applicantsButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
  },
  applicantsButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    height: 56,
  },
  applicantsButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  applyButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  applyButtonDisabled: {
    opacity: 0.7,
  },
  applyButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    height: 56,
  },
  applyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
}); 