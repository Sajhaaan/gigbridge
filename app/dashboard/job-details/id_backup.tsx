import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  StatusBar,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { jobsAPI, applicationsAPI } from '../../services/api';
import { useAuth } from '../../providers/AuthContext';

interface JobDetails {
  id: string;
  title: string;
  description: string;
  location: string;
  pay: string;
  paymentType: 'Cash' | 'UPI';
  startTime: string;
  safetyTags: string[];
  status?: 'available' | 'pending' | 'shortlisted' | 'hired' | 'rejected';
  company: {
    name: string;
    logo?: string;
    rating?: number;
    verified?: boolean;
  };
  contact?: {
    name: string;
    phone: string;
  };
  requirements?: string[];
  applicationId?: string;
}

export default function JobDetails() {
  const router = useRouter();
  const { id, job: jobParam } = useLocalSearchParams();
  const { user, isWorker } = useAuth();
  const [jobDetails, setJobDetails] = useState<JobDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [accepting, setAccepting] = useState(false);

  useEffect(() => {
    // If we have job data passed as a parameter, use it directly
    if (jobParam) {
      try {
        const parsedJob = JSON.parse(decodeURIComponent(jobParam as string));
        // Transform the job data to match our interface
        const jobDetailsObj = {
          id: parsedJob.id,
          title: parsedJob.title,
          description: parsedJob.description || "No description provided.",
          location: parsedJob.location,
          pay: parsedJob.hourlyRate || parsedJob.totalPay,
          paymentType: parsedJob.paymentMethod || 'Cash',
          startTime: `${parsedJob.date} ${parsedJob.time}`,
          safetyTags: [],
          status: 'available' as const,
          company: {
            name: parsedJob.company,
            logo: parsedJob.logo,
            rating: parsedJob.rating || 4.5,
            verified: parsedJob.verified || false
          }
        };
        
        // Add clothingRequirements if they exist
        if (parsedJob.clothingRequirements) {
          jobDetailsObj.safetyTags = parsedJob.clothingRequirements;
          jobDetailsObj.requirements = parsedJob.clothingRequirements;
        }
        
        setJobDetails(jobDetailsObj);
        setLoading(false);
        return;
      } catch (error) {
        console.error('Error parsing job data from params:', error);
        // Fall through to API fetch if parsing fails
      }
    }
    
    // Otherwise load from API
    loadJobDetails();
  }, [id, jobParam]);

  const loadJobDetails = async () => {
    setLoading(true);
    try {
      if (typeof id !== 'string') {
        throw new Error('Invalid job ID');
      }
      
      // Get job details from API
      const jobData = await jobsAPI.getJobById(id);
      
      // Transform API response to our interface if needed
      setJobDetails({
        id: jobData.id,
        title: jobData.title,
        description: jobData.description,
        location: jobData.location,
        pay: jobData.pay,
        paymentType: jobData.paymentType,
        startTime: jobData.startTime,
        safetyTags: jobData.safetyTags || [],
        status: jobData.applicationStatus || 'available',
        applicationId: jobData.applicationId,
        company: {
          name: jobData.company?.name || 'Company',
          logo: jobData.company?.logo,
          rating: jobData.company?.rating || 4.5,
          verified: jobData.company?.verified || true
        },
        contact: jobData.contact,
        requirements: jobData.requirements,
      });
    } catch (error: any) {
      console.error('Error loading job details:', error);
      Alert.alert(
        'Error', 
        error.response?.data?.message || 'Failed to load job details. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    if (!jobDetails) return;
    setApplying(true);
    
    try {
      // Call API to apply for job
      const result = await applicationsAPI.applyForJob(jobDetails.id);
      
      if (result) {
        // Update local state to show applied status
        setJobDetails({ 
          ...jobDetails, 
          status: 'pending',
          applicationId: result.id
        });
        
        Alert.alert('Success', 'You have successfully applied for this job!');
      }
    } catch (error: any) {
      console.error('Error applying for job:', error);
      Alert.alert(
        'Error', 
        error.response?.data?.message || 'Failed to apply for job. Please try again.'
      );
    } finally {
      setApplying(false);
    }
  };

  const handleAccept = async () => {
    if (!jobDetails || !jobDetails.applicationId) return;
    setAccepting(true);
    
    try {
      // Call API to update application status to hired
      const result = await applicationsAPI.updateApplicationStatus(
        jobDetails.applicationId, 
        'hired'
      );
      
      if (result) {
        // Update local state
        setJobDetails({ 
          ...jobDetails, 
          status: 'hired' 
        });
        
        Alert.alert('Success', 'You have accepted this job offer!');
      }
    } catch (error: any) {
      console.error('Error accepting job:', error);
      Alert.alert(
        'Error', 
        error.response?.data?.message || 'Failed to accept job. Please try again.'
      );
    } finally {
      setAccepting(false);
    }
  };

  const renderStatusBadge = () => {
    if (!jobDetails || jobDetails.status === 'available') return null;
    
    let badgeStyle = {};
    let textStyle = {};
    let statusText = '';
    
    switch(jobDetails.status) {
      case 'pending':
        badgeStyle = styles.appliedBadge;
        textStyle = styles.appliedText;
        statusText = 'Applied';
        break;
      case 'shortlisted':
        badgeStyle = styles.shortlistedBadge;
        textStyle = styles.shortlistedText;
        statusText = 'Shortlisted';
        break;
      case 'hired':
        badgeStyle = styles.acceptedBadge;
        textStyle = styles.acceptedText;
        statusText = 'Hired';
        break;
      case 'rejected':
        badgeStyle = styles.rejectedBadge;
        textStyle = styles.rejectedText;
        statusText = 'Rejected';
        break;
    }
    
    return (
      <View style={[styles.statusBadge, badgeStyle]}>
        <Text style={[styles.statusText, textStyle]}>{statusText}</Text>
      </View>
    );
  };

  const renderActionButton = () => {
    // No action buttons for business users
    if (!isWorker()) {
      return null;
    }
    
    if (!jobDetails) return null;
    
    // Action button based on status
    switch(jobDetails.status) {
      case 'available':
        return (
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={handleApply}
            disabled={applying}
          >
            {applying ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.actionButtonText}>Apply for Job</Text>
            )}
          </TouchableOpacity>
        );
      case 'shortlisted':
        return (
          <TouchableOpacity 
            style={styles.acceptButton} 
            onPress={handleAccept}
            disabled={accepting}
          >
            {accepting ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.actionButtonText}>Accept Offer</Text>
            )}
          </TouchableOpacity>
        );
      case 'pending':
        return (
          <View style={styles.pendingContainer}>
            <Ionicons name="time-outline" size={20} color="#4F78FF" />
            <Text style={styles.pendingText}>Application pending</Text>
          </View>
        );
      case 'hired':
        return (
          <View style={styles.hiredContainer}>
            <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
            <Text style={styles.hiredText}>You're hired!</Text>
          </View>
        );
      case 'rejected':
        return (
          <View style={styles.rejectedContainer}>
            <Ionicons name="close-circle" size={20} color="#FF3B30" />
            <Text style={styles.rejectedText}>Application rejected</Text>
          </View>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <StatusBar barStyle="dark-content" />
        <ActivityIndicator size="large" color="#4F78FF" />
        <Text style={styles.loadingText}>Loading job details...</Text>
      </SafeAreaView>
    );
  }

  if (!jobDetails) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <StatusBar barStyle="dark-content" />
        <Ionicons name="alert-circle-outline" size={64} color="#FF3B30" />
        <Text style={styles.errorText}>Job not found</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButtonHeader} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Job Details</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.jobHeader}>
          <View>
            <Text style={styles.jobRole}>{jobDetails.title}</Text>
            <Text style={styles.jobEmployer}>@{jobDetails.company.name}</Text>
          </View>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={16} color="#FFD700" />
            <Text style={styles.rating}>{jobDetails.company.rating}</Text>
            {jobDetails.company.verified && (
              <View style={styles.verifiedBadge}>
                <Ionicons name="checkmark-circle" size={16} color="#4F78FF" />
                <Text style={styles.verifiedText}>Verified</Text>
              </View>
            )}
          </View>
        </View>

        {renderStatusBadge()}

        <View style={styles.detailCard}>
          <View style={styles.detailRow}>
            <View style={styles.detailItem}>
              <Ionicons name="cash-outline" size={20} color="#4CAF50" />
              <Text style={styles.detailLabel}>Pay</Text>
              <Text style={styles.detailValue}>{jobDetails.pay}</Text>
            </View>
            <View style={styles.detailSeparator} />
            <View style={styles.detailItem}>
              <Ionicons name="card-outline" size={20} color="#4F78FF" />
              <Text style={styles.detailLabel}>Payment</Text>
              <Text style={styles.detailValue}>{jobDetails.paymentType}</Text>
            </View>
            <View style={styles.detailSeparator} />
            <View style={styles.detailItem}>
              <Ionicons name="time-outline" size={20} color="#FF9800" />
              <Text style={styles.detailLabel}>Starts in</Text>
              <Text style={styles.detailValue}>{jobDetails.startTime}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location</Text>
          <View style={styles.locationContainer}>
            <Ionicons name="location-outline" size={20} color="#666" />
            <Text style={styles.locationText}>{jobDetails.location}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Job Description</Text>
          <Text style={styles.descriptionText}>{jobDetails.description}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Requirements</Text>
          <View style={styles.requirementsContainer}>
            {jobDetails.requirements?.map((requirement, index) => (
              <View key={index} style={styles.requirementItem}>
                <Ionicons name="checkmark-circle" size={18} color="#4CAF50" />
                <Text style={styles.requirementText}>{requirement}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Safety Tags</Text>
          <View style={styles.safetyTagsContainer}>
            {jobDetails.safetyTags.map((tag, index) => (
              <View key={index} style={styles.safetyTag}>
                <Ionicons name="shield-checkmark-outline" size={14} color="#4CAF50" />
                <Text style={styles.safetyTagText}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          <View style={styles.contactContainer}>
            <View style={styles.contactItem}>
              <Ionicons name="person-outline" size={20} color="#666" />
              <Text style={styles.contactText}>{jobDetails.contact?.name}</Text>
            </View>
            <View style={styles.contactItem}>
              <Ionicons name="call-outline" size={20} color="#666" />
              <Text style={styles.contactText}>{jobDetails.contact?.phone}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        {renderActionButton()}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  backButtonHeader: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  placeholder: {
    width: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 24,
  },
  errorText: {
    fontSize: 18,
    color: '#666',
    marginTop: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  backButton: {
    backgroundColor: '#4F78FF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  scrollView: {
    flex: 1,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 16,
    backgroundColor: '#fff',
  },
  jobRole: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
    marginBottom: 4,
  },
  jobEmployer: {
    fontSize: 16,
    color: '#666',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    marginLeft: 4,
    fontSize: 14,
    color: '#000',
    fontWeight: '500',
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
    backgroundColor: '#F0F4FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  verifiedText: {
    marginLeft: 4,
    fontSize: 12,
    color: '#4F78FF',
    fontWeight: '500',
  },
  statusBadge: {
    alignSelf: 'flex-start',
    marginHorizontal: 16,
    marginBottom: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#E0E0E0',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  appliedBadge: {
    backgroundColor: 'rgba(79, 120, 255, 0.1)',
  },
  appliedText: {
    color: '#4F78FF',
  },
  shortlistedBadge: {
    backgroundColor: 'rgba(255, 193, 7, 0.1)',
  },
  shortlistedText: {
    color: '#FFC107',
  },
  acceptedBadge: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
  },
  acceptedText: {
    color: '#4CAF50',
  },
  rejectedBadge: {
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
  },
  rejectedText: {
    color: '#F44336',
  },
  detailCard: {
    margin: 16,
    backgroundColor: '#FBFBFB',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailItem: {
    flex: 1,
    alignItems: 'center',
  },
  detailSeparator: {
    width: 1,
    height: '80%',
    backgroundColor: '#E0E0E0',
  },
  detailLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginTop: 2,
  },
  section: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 12,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 8,
  },
  descriptionText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  requirementsContainer: {
    marginTop: 8,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  requirementText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 8,
  },
  safetyTagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  safetyTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  safetyTagText: {
    marginLeft: 4,
    fontSize: 12,
    color: '#4CAF50',
  },
  contactContainer: {
    marginTop: 8,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  contactText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 8,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    backgroundColor: '#fff',
  },
  actionButton: {
    backgroundColor: '#4F78FF',
    borderRadius: 8,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  },
  acceptButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pendingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingVertical: 14,
    borderRadius: 8,
  },
  pendingText: {
    color: '#4CAF50',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  },
  hiredContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingVertical: 14,
    borderRadius: 8,
  },
  hiredText: {
    color: '#4CAF50',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  },
  rejectedContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFEBEE',
    paddingVertical: 14,
    borderRadius: 8,
  },
  rejectedText: {
    color: '#F44336',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  },
}); 