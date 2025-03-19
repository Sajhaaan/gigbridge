import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
  StatusBar,
  FlatList,
  Animated as RNAnimated,
  Dimensions,
  Modal,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import BottomNavigation from '../components/BottomNavigation';

const { width, height } = Dimensions.get('window');

interface Job {
  id: string;
  title: string;
  company: string;
  logo: string;
  location: string;
  rate: string;
  date: string;
  isBookmarked: boolean;
  tags: string[];
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Freelance';
  experience: 'Entry' | 'Intermediate' | 'Senior';
}

// Mock data
const JOBS: Job[] = [
  {
    id: '1',
    title: 'Senior React Developer',
    company: 'Tech Solutions Inc.',
    logo: 'https://randomuser.me/api/portraits/men/41.jpg',
    location: 'Remote',
    rate: '$50-60/hr',
    date: '2 days ago',
    isBookmarked: true,
    tags: ['React', 'TypeScript', 'Redux'],
    type: 'Full-time',
    experience: 'Senior'
  },
  {
    id: '2',
    title: 'UI/UX Designer',
    company: 'Creative Studio',
    logo: 'https://randomuser.me/api/portraits/women/65.jpg',
    location: 'New York, NY',
    rate: '$45-55/hr',
    date: '5 days ago',
    isBookmarked: false,
    tags: ['Figma', 'Adobe XD', 'UI Design'],
    type: 'Freelance',
    experience: 'Intermediate'
  },
  {
    id: '3',
    title: 'Mobile Developer',
    company: 'App Innovators',
    logo: 'https://randomuser.me/api/portraits/men/32.jpg',
    location: 'San Francisco, CA',
    rate: '$55-70/hr',
    date: '1 week ago',
    isBookmarked: false,
    tags: ['React Native', 'iOS', 'Android'],
    type: 'Contract',
    experience: 'Senior'
  },
  {
    id: '4',
    title: 'Backend Engineer',
    company: 'Data Systems',
    logo: 'https://randomuser.me/api/portraits/women/44.jpg',
    location: 'Chicago, IL',
    rate: '$60-75/hr',
    date: '3 days ago',
    isBookmarked: true,
    tags: ['Node.js', 'PostgreSQL', 'AWS'],
    type: 'Full-time',
    experience: 'Senior'
  },
  {
    id: '5',
    title: 'DevOps Specialist',
    company: 'Cloud Solutions',
    logo: 'https://randomuser.me/api/portraits/men/59.jpg',
    location: 'Remote',
    rate: '$65-80/hr',
    date: '4 days ago',
    isBookmarked: false,
    tags: ['Docker', 'Kubernetes', 'CI/CD'],
    type: 'Contract',
    experience: 'Intermediate'
  },
  {
    id: '6',
    title: 'Junior Web Developer',
    company: 'Web Creators',
    logo: 'https://randomuser.me/api/portraits/women/33.jpg',
    location: 'Boston, MA',
    rate: '$30-40/hr',
    date: '1 day ago',
    isBookmarked: false,
    tags: ['HTML', 'CSS', 'JavaScript'],
    type: 'Part-time',
    experience: 'Entry'
  },
  {
    id: '7',
    title: 'Data Scientist',
    company: 'Analytics Pro',
    logo: 'https://randomuser.me/api/portraits/men/36.jpg',
    location: 'Remote',
    rate: '$70-85/hr',
    date: '3 days ago',
    isBookmarked: true,
    tags: ['Python', 'Machine Learning', 'SQL'],
    type: 'Full-time',
    experience: 'Senior'
  },
  {
    id: '8',
    title: 'Product Manager',
    company: 'Product Innovations',
    logo: 'https://randomuser.me/api/portraits/women/68.jpg',
    location: 'Austin, TX',
    rate: '$65-75/hr',
    date: '6 days ago',
    isBookmarked: false,
    tags: ['Product', 'Agile', 'Roadmap'],
    type: 'Full-time',
    experience: 'Intermediate'
  }
];

export default function JobListings() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredJobs, setFilteredJobs] = useState<Job[]>(JOBS);
  const [isFilterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedJobTypes, setSelectedJobTypes] = useState<string[]>([]);
  const [selectedExperienceLevels, setSelectedExperienceLevels] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  
  // For scroll-based header animation
  const scrollY = useRef(new RNAnimated.Value(0)).current;
  const headerHeight = scrollY.interpolate({
    inputRange: [0, 80],
    outputRange: [120, 70],
    extrapolate: 'clamp'
  });
  
  const headerTitleOpacity = scrollY.interpolate({
    inputRange: [0, 50, 80],
    outputRange: [0, 0.5, 1],
    extrapolate: 'clamp'
  });
  
  const handleSearch = (text: string) => {
    setSearchQuery(text);
    if (text.trim() === '') {
      applyFilters();
    } else {
      const searchResults = JOBS.filter(job => 
        job.title.toLowerCase().includes(text.toLowerCase()) ||
        job.company.toLowerCase().includes(text.toLowerCase()) ||
        job.tags.some(tag => tag.toLowerCase().includes(text.toLowerCase())) ||
        job.location.toLowerCase().includes(text.toLowerCase())
      );
      
      // Apply other filters to search results
      applyFiltersToJobs(searchResults);
    }
  };
  
  const toggleJobType = (type: string) => {
    if (selectedJobTypes.includes(type)) {
      setSelectedJobTypes(selectedJobTypes.filter(t => t !== type));
    } else {
      setSelectedJobTypes([...selectedJobTypes, type]);
    }
  };
  
  const toggleExperienceLevel = (level: string) => {
    if (selectedExperienceLevels.includes(level)) {
      setSelectedExperienceLevels(selectedExperienceLevels.filter(l => l !== level));
    } else {
      setSelectedExperienceLevels([...selectedExperienceLevels, level]);
    }
  };
  
  const toggleLocation = (location: string) => {
    if (selectedLocations.includes(location)) {
      setSelectedLocations(selectedLocations.filter(l => l !== location));
    } else {
      setSelectedLocations([...selectedLocations, location]);
    }
  };
  
  const applyFilters = () => {
    // Start with all jobs if search is empty, otherwise use search results
    let results = JOBS;
    if (searchQuery.trim() !== '') {
      results = JOBS.filter(job => 
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
        job.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    applyFiltersToJobs(results);
    setFilterModalVisible(false);
  };
  
  const applyFiltersToJobs = (jobs: Job[]) => {
    let filteredResults = [...jobs];
    
    // Apply job type filter
    if (selectedJobTypes.length > 0) {
      filteredResults = filteredResults.filter(job => 
        selectedJobTypes.includes(job.type)
      );
    }
    
    // Apply experience level filter
    if (selectedExperienceLevels.length > 0) {
      filteredResults = filteredResults.filter(job => 
        selectedExperienceLevels.includes(job.experience)
      );
    }
    
    // Apply location filter
    if (selectedLocations.length > 0) {
      filteredResults = filteredResults.filter(job => 
        selectedLocations.includes(job.location)
      );
    }
    
    setFilteredJobs(filteredResults);
  };
  
  const resetFilters = () => {
    setSelectedJobTypes([]);
    setSelectedExperienceLevels([]);
    setSelectedLocations([]);
    setSearchQuery('');
    setFilteredJobs(JOBS);
  };
  
  const navigateToJob = (jobId: string) => {
    router.push({pathname: `/dashboard/jobs/${jobId}`} as any);
  };
  
  const toggleBookmark = (jobId: string) => {
    const updatedJobs = filteredJobs.map(job => 
      job.id === jobId ? {...job, isBookmarked: !job.isBookmarked} : job
    );
    setFilteredJobs(updatedJobs);
  };
  
  // Get unique locations for filter
  const uniqueLocations = Array.from(new Set(JOBS.map(job => job.location)));
  
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Jobs</Text>
          <View style={styles.searchContainer}>
            <View style={styles.searchBar}>
              <Ionicons name="search" size={20} color="#666666" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search jobs..."
                placeholderTextColor="#666666"
                value={searchQuery}
                onChangeText={handleSearch}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity
                  style={styles.clearButton}
                  onPress={() => handleSearch('')}
                >
                  <Ionicons name="close-circle" size={20} color="#666666" />
                </TouchableOpacity>
              )}
            </View>
            <TouchableOpacity
              style={styles.filterButton}
              onPress={() => setFilterModalVisible(true)}
            >
              <Ionicons name="options-outline" size={24} color="#1A1A1A" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <FlatList
        data={filteredJobs}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Ionicons name="search-outline" size={48} color="#666666" />
            <Text style={styles.emptyTitle}>No jobs found</Text>
            <Text style={styles.emptySubtitle}>Try adjusting your search</Text>
          </View>
        )}
        renderItem={({ item, index }) => (
          <Animated.View
            entering={FadeInDown.delay(index * 100)}
            style={styles.jobCard}
          >
            <TouchableOpacity
              style={styles.jobCardContent}
              onPress={() => navigateToJob(item.id)}
              activeOpacity={0.7}
            >
              <View style={styles.jobCardHeader}>
                <Image source={{ uri: item.logo }} style={styles.companyLogo} />
                <View style={styles.jobInfo}>
                  <Text style={styles.jobTitle} numberOfLines={1}>{item.title}</Text>
                  <Text style={styles.companyName}>{item.company}</Text>
                </View>
                <TouchableOpacity
                  style={styles.bookmarkButton}
                  onPress={() => toggleBookmark(item.id)}
                >
                  <Ionicons
                    name={item.isBookmarked ? 'bookmark' : 'bookmark-outline'}
                    size={20}
                    color={item.isBookmarked ? '#1A1A1A' : '#666666'}
                  />
                </TouchableOpacity>
              </View>
              
              <View style={styles.jobMeta}>
                <View style={styles.metaItem}>
                  <Ionicons name="location-outline" size={16} color="#666666" />
                  <Text style={styles.metaText}>{item.location}</Text>
                </View>
                <View style={styles.metaItem}>
                  <Ionicons name="cash-outline" size={16} color="#666666" />
                  <Text style={styles.metaText}>{item.rate}</Text>
                </View>
              </View>

              <View style={styles.tagsContainer}>
                <View style={styles.tag}>
                  <Text style={styles.tagText}>{item.type}</Text>
                </View>
                <View style={styles.tag}>
                  <Text style={styles.tagText}>{item.experience}</Text>
                </View>
              </View>
            </TouchableOpacity>
          </Animated.View>
        )}
      />

      <Modal
        visible={isFilterModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filters</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setFilterModalVisible(false)}
              >
                <Ionicons name="close" size={24} color="#1A1A1A" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.filterContent}>
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Job Type</Text>
                <View style={styles.filterOptions}>
                  {['Full-time', 'Part-time', 'Contract', 'Freelance'].map((type) => (
                    <TouchableOpacity
                      key={type}
                      style={[
                        styles.filterOption,
                        selectedJobTypes.includes(type) && styles.filterOptionSelected
                      ]}
                      onPress={() => toggleJobType(type)}
                    >
                      <Text style={[
                        styles.filterOptionText,
                        selectedJobTypes.includes(type) && styles.filterOptionTextSelected
                      ]}>
                        {type}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Experience Level</Text>
                <View style={styles.filterOptions}>
                  {['Entry', 'Intermediate', 'Senior'].map((level) => (
                    <TouchableOpacity
                      key={level}
                      style={[
                        styles.filterOption,
                        selectedExperienceLevels.includes(level) && styles.filterOptionSelected
                      ]}
                      onPress={() => toggleExperienceLevel(level)}
                    >
                      <Text style={[
                        styles.filterOptionText,
                        selectedExperienceLevels.includes(level) && styles.filterOptionTextSelected
                      ]}>
                        {level}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Location</Text>
                <View style={styles.filterOptions}>
                  {['Remote', 'New York, NY', 'San Francisco, CA', 'Chicago, IL', 'Boston, MA', 'Austin, TX'].map((location) => (
                    <TouchableOpacity
                      key={location}
                      style={[
                        styles.filterOption,
                        selectedLocations.includes(location) && styles.filterOptionSelected
                      ]}
                      onPress={() => toggleLocation(location)}
                    >
                      <Text style={[
                        styles.filterOptionText,
                        selectedLocations.includes(location) && styles.filterOptionTextSelected
                      ]}>
                        {location}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </ScrollView>
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.resetButton}
                onPress={resetFilters}
              >
                <Text style={styles.resetButtonText}>Reset</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.applyFilterButton}
                onPress={applyFilters}
              >
                <Text style={styles.applyFilterButtonText}>Apply</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <BottomNavigation />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F3F5',
  },
  headerContent: {
    gap: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    height: 44,
    paddingHorizontal: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: '#1A1A1A',
    fontSize: 15,
  },
  clearButton: {
    padding: 4,
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F8F9FA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    padding: 20,
  },
  jobCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F1F3F5',
  },
  jobCardContent: {
    padding: 16,
  },
  jobCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  companyLogo: {
    width: 48,
    height: 48,
    borderRadius: 8,
    marginRight: 12,
  },
  jobInfo: {
    flex: 1,
    marginRight: 8,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  companyName: {
    fontSize: 14,
    color: '#666666',
  },
  bookmarkButton: {
    padding: 4,
  },
  jobMeta: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 13,
    color: '#666666',
    marginLeft: 4,
  },
  tagsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  tag: {
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  tagText: {
    fontSize: 12,
    color: '#666666',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  closeButton: {
    padding: 4,
  },
  filterContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  filterSection: {
    marginBottom: 20,
  },
  filterSectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#F8F9FA',
  },
  filterOptionSelected: {
    backgroundColor: '#1A1A1A',
  },
  filterOptionText: {
    fontSize: 13,
    color: '#666666',
  },
  filterOptionTextSelected: {
    color: '#FFFFFF',
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F3F5',
  },
  resetButton: {
    flex: 1,
    height: 44,
    borderRadius: 8,
    backgroundColor: '#F8F9FA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#666666',
  },
  applyFilterButton: {
    flex: 1,
    height: 44,
    borderRadius: 8,
    backgroundColor: '#1A1A1A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyFilterButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginTop: 12,
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#666666',
  },
});