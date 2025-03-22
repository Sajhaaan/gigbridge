import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Filter options
const DISTANCE_OPTIONS = ['Within 5km', 'Within 10km', 'Within 15km'];
const TIME_OPTIONS = ['Start within 1 hour', 'Morning shifts', 'Evening shifts'];
const PAY_OPTIONS = ['₹300-500/day', '₹500-800/day', '₹800+/day'];
const SKILL_OPTIONS = ['No skill required', 'Semi-skilled'];

interface JobCard {
  id: string;
  role: string;
  employer: string;
  pay: string;
  paymentType: 'Cash' | 'UPI';
  rating: number;
  verified: boolean;
  startTime: string;
  safetyTags: string[];
  status?: 'available' | 'applied' | 'accepted' | 'rejected';
}

// We'll simulate API calls with this mock data
const API = {
  getJobs: (): Promise<JobCard[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(MOCK_JOBS);
      }, 1000);
    });
  },
  
  applyForJob: (jobId: string): Promise<{ success: boolean, message: string }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate success
        resolve({ success: true, message: 'Successfully applied for job' });
      }, 1500);
    });
  }
};

const MOCK_JOBS: JobCard[] = [
  {
    id: '1',
    role: 'Waiters needed',
    employer: 'Sangeet Caterers',
    pay: '₹500/day',
    paymentType: 'Cash',
    rating: 4.5,
    verified: true,
    startTime: '1h 20m',
    safetyTags: ['Women-friendly workspace', 'PPE provided'],
    status: 'available',
  },
  {
    id: '2',
    role: 'Kitchen Helper',
    employer: 'Royal Restaurant',
    pay: '₹400/day',
    paymentType: 'UPI',
    rating: 4.2,
    verified: true,
    startTime: '2h',
    safetyTags: ['Meals provided', 'PPE provided'],
    status: 'available',
  },
  {
    id: '3',
    role: 'Hotel Cleaning Staff',
    employer: 'Grand Hotel',
    pay: '₹450/day',
    paymentType: 'Cash',
    rating: 4.0,
    verified: true,
    startTime: '3h',
    safetyTags: ['Regular breaks', 'PPE provided'],
    status: 'available',
  },
  // Add more mock jobs as needed
];

export default function JobListing() {
  const router = useRouter();
  const [selectedDistance, setSelectedDistance] = useState(DISTANCE_OPTIONS[0]);
  const [selectedTime, setSelectedTime] = useState(TIME_OPTIONS[0]);
  const [selectedPay, setSelectedPay] = useState(PAY_OPTIONS[0]);
  const [selectedSkill, setSelectedSkill] = useState(SKILL_OPTIONS[0]);
  
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState<JobCard[]>([]);
  const [applyingToJobId, setApplyingToJobId] = useState<string | null>(null);

  useEffect(() => {
    // Load jobs when component mounts
    loadJobs();
  }, []);

  const loadJobs = async () => {
    setLoading(true);
    try {
      const jobsData = await API.getJobs();
      setJobs(jobsData);
    } catch (error) {
      Alert.alert('Error', 'Failed to load jobs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyForJob = async (jobId: string) => {
    setApplyingToJobId(jobId);
    try {
      const result = await API.applyForJob(jobId);
      if (result.success) {
        // Update the job status in our local state
        setJobs(jobs.map(job => 
          job.id === jobId ? { ...job, status: 'applied' } : job
        ));
        Alert.alert('Success', 'You have successfully applied for this job!');
      } else {
        Alert.alert('Error', result.message);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to apply for job. Please try again.');
    } finally {
      setApplyingToJobId(null);
    }
  };

  const handlePostJob = () => {
    router.push('/dashboard/post-job');
  };

  const FilterChip = ({ 
    label, 
    selected, 
    onPress 
  }: { 
    label: string; 
    selected: boolean; 
    onPress: () => void 
  }) => (
    <TouchableOpacity
      style={[styles.filterChip, selected && styles.filterChipSelected]}
      onPress={onPress}
    >
      <Text style={[styles.filterChipText, selected && styles.filterChipTextSelected]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const FilterSection = ({ 
    title, 
    options, 
    selected, 
    onSelect 
  }: { 
    title: string; 
    options: string[]; 
    selected: string; 
    onSelect: (option: string) => void 
  }) => (
    <View style={styles.filterSection}>
      <Text style={styles.filterTitle}>{title}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {options.map((option) => (
          <FilterChip
            key={option}
            label={option}
            selected={selected === option}
            onPress={() => onSelect(option)}
          />
        ))}
      </ScrollView>
    </View>
  );

  const renderJobStatusBadge = (status?: string) => {
    if (!status || status === 'available') return null;
    
    let badgeStyle = styles.statusBadge;
    let textStyle = styles.statusText;
    let statusText = '';
    
    switch(status) {
      case 'applied':
        badgeStyle = [styles.statusBadge, styles.appliedBadge];
        textStyle = [styles.statusText, styles.appliedText];
        statusText = 'Applied';
        break;
      case 'accepted':
        badgeStyle = [styles.statusBadge, styles.acceptedBadge];
        textStyle = [styles.statusText, styles.acceptedText];
        statusText = 'Accepted';
        break;
      case 'rejected':
        badgeStyle = [styles.statusBadge, styles.rejectedBadge];
        textStyle = [styles.statusText, styles.rejectedText];
        statusText = 'Rejected';
        break;
    }
    
    return (
      <View style={badgeStyle}>
        <Text style={textStyle}>{statusText}</Text>
      </View>
    );
  };

  const JobCard = ({ job }: { job: JobCard }) => (
    <TouchableOpacity 
      style={styles.jobCard}
      onPress={() => router.push(`/dashboard/job-details/${job.id}`)}
      activeOpacity={0.7}
    >
      <View style={styles.jobHeader}>
        <View>
          <Text style={styles.jobRole}>{job.role}</Text>
          <Text style={styles.jobEmployer}>@{job.employer}</Text>
        </View>
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={16} color="#FFD700" />
          <Text style={styles.rating}>{job.rating}</Text>
          {job.verified && (
            <View style={styles.verifiedBadge}>
              <Ionicons name="checkmark-circle" size={16} color="#4F78FF" />
              <Text style={styles.verifiedText}>Verified</Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.jobDetails}>
        <View style={styles.paymentContainer}>
          <Text style={styles.payText}>{job.pay}</Text>
          <View style={styles.paymentType}>
            <Ionicons 
              name={job.paymentType === 'Cash' ? 'cash-outline' : 'phone-portrait-outline'} 
              size={16} 
              color="#666" 
            />
            <Text style={styles.paymentTypeText}>{job.paymentType}</Text>
          </View>
        </View>

        <View style={styles.startTimeContainer}>
          <Ionicons name="time-outline" size={16} color="#666" />
          <Text style={styles.startTimeText}>Starts in {job.startTime}</Text>
        </View>
      </View>

      <View style={styles.safetyTagsContainer}>
        {job.safetyTags.map((tag, index) => (
          <View key={index} style={styles.safetyTag}>
            <Ionicons name="shield-checkmark-outline" size={14} color="#4CAF50" />
            <Text style={styles.safetyTagText}>{tag}</Text>
          </View>
        ))}
      </View>

      {renderJobStatusBadge(job.status)}

      {(!job.status || job.status === 'available') && (
        <TouchableOpacity 
          style={styles.applyButton}
          onPress={() => handleApplyForJob(job.id)}
          disabled={applyingToJobId === job.id}
        >
          {applyingToJobId === job.id ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.applyButtonText}>Apply Now</Text>
          )}
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Available Jobs</Text>
        <TouchableOpacity style={styles.postJobButton} onPress={handlePostJob}>
          <Ionicons name="add-circle-outline" size={24} color="#4F78FF" />
          <Text style={styles.postJobText}>Post Job</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.filters}>
        <FilterSection
          title="Location"
          options={DISTANCE_OPTIONS}
          selected={selectedDistance}
          onSelect={setSelectedDistance}
        />
        <FilterSection
          title="Time"
          options={TIME_OPTIONS}
          selected={selectedTime}
          onSelect={setSelectedTime}
        />
        <FilterSection
          title="Pay"
          options={PAY_OPTIONS}
          selected={selectedPay}
          onSelect={setSelectedPay}
        />
        <FilterSection
          title="Skill Level"
          options={SKILL_OPTIONS}
          selected={selectedSkill}
          onSelect={setSelectedSkill}
        />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4F78FF" />
          <Text style={styles.loadingText}>Loading jobs...</Text>
        </View>
      ) : (
        <FlatList
          data={jobs}
          renderItem={({ item }) => <JobCard job={item} />}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.jobList}
          showsVerticalScrollIndicator={false}
          refreshing={loading}
          onRefresh={loadJobs}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#000',
  },
  postJobButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F4FF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  postJobText: {
    marginLeft: 4,
    color: '#4F78FF',
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  filters: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  filterSection: {
    marginBottom: 16,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  filterChipSelected: {
    backgroundColor: '#4F78FF',
    borderColor: '#4F78FF',
  },
  filterChipText: {
    color: '#666',
    fontSize: 14,
  },
  filterChipTextSelected: {
    color: '#fff',
  },
  jobList: {
    padding: 16,
  },
  jobCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  jobRole: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  jobEmployer: {
    fontSize: 14,
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
  },
  verifiedText: {
    marginLeft: 4,
    fontSize: 12,
    color: '#4F78FF',
    fontWeight: '500',
  },
  jobDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  paymentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  payText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4CAF50',
    marginRight: 8,
  },
  paymentType: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  paymentTypeText: {
    marginLeft: 4,
    fontSize: 12,
    color: '#666',
  },
  startTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  startTimeText: {
    marginLeft: 4,
    fontSize: 12,
    color: '#FF9800',
    fontWeight: '500',
  },
  safetyTagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
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
  statusBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#E0E0E0',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  appliedBadge: {
    backgroundColor: '#E1F5FE',
  },
  appliedText: {
    color: '#0288D1',
  },
  acceptedBadge: {
    backgroundColor: '#E8F5E9',
  },
  acceptedText: {
    color: '#4CAF50',
  },
  rejectedBadge: {
    backgroundColor: '#FFEBEE',
  },
  rejectedText: {
    color: '#F44336',
  },
  applyButton: {
    backgroundColor: '#4F78FF',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  applyButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
}); 