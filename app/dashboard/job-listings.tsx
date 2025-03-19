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
      <StatusBar barStyle="light-content" />
      <RNAnimated.View 
        style={[
          styles.header, 
          { 
            height: headerHeight, 
            paddingTop: insets.top 
          }
        ]}
      >
        <LinearGradient
          colors={['#4F78FF', '#3B5EDD']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          
          <RNAnimated.Text style={[styles.headerTitle, { opacity: headerTitleOpacity }]}>
            Job Listings
          </RNAnimated.Text>
          
          <TouchableOpacity style={styles.filterButton} onPress={() => setFilterModalVisible(true)}>
            <Ionicons name="options-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
        
        <Text style={styles.largeTitle}>Find Your Next Job</Text>
      </RNAnimated.View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#4F78FF" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search jobs, skills..."
            placeholderTextColor="#64748B"
            value={searchQuery}
            onChangeText={handleSearch}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => handleSearch('')} style={styles.clearButton}>
              <Ionicons name="close-circle" size={20} color="#64748B" />
            </TouchableOpacity>
          )}
        </View>
        
        {(selectedJobTypes.length > 0 || selectedExperienceLevels.length > 0 || selectedLocations.length > 0) && (
          <View style={styles.filtersApplied}>
            <Text style={styles.filtersAppliedText}>
              Filters applied: {selectedJobTypes.length + selectedExperienceLevels.length + selectedLocations.length}
            </Text>
            <TouchableOpacity onPress={resetFilters}>
              <Text style={styles.clearFiltersText}>Clear</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <Animated.View 
        entering={FadeInDown.duration(500)}
        style={styles.resultsContainer}
      >
        <Text style={styles.resultsCount}>{filteredJobs.length} jobs found</Text>
        
        <FlatList
          data={filteredJobs}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.jobsList,
            { paddingBottom: insets.bottom + 70 }
          ]}
          onScroll={RNAnimated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={16}
          renderItem={({ item, index }) => (
            <Animated.View
              entering={FadeInDown.delay(index * 50).duration(400)}
            >
              <TouchableOpacity 
                style={styles.jobCard}
                onPress={() => navigateToJob(item.id)}
                activeOpacity={0.7}
              >
                <View style={styles.jobCardHeader}>
                  <Image source={{ uri: item.logo }} style={styles.companyLogo} />
                  <View style={styles.jobInfo}>
                    <Text style={styles.jobTitle} numberOfLines={1}>{item.title}</Text>
                    <Text style={styles.companyName}>{item.company}</Text>
                    <View style={styles.typeContainer}>
                      <Text style={[
                        styles.jobType,
                        item.type === 'Full-time' && styles.fullTimeType,
                        item.type === 'Part-time' && styles.partTimeType,
                        item.type === 'Contract' && styles.contractType,
                        item.type === 'Freelance' && styles.freelanceType,
                      ]}>
                        {item.type}
                      </Text>
                      <Text style={styles.experienceLevel}>{item.experience}</Text>
                    </View>
                  </View>
                  <TouchableOpacity 
                    style={styles.bookmarkButton}
                    onPress={() => toggleBookmark(item.id)}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Ionicons 
                      name={item.isBookmarked ? "bookmark" : "bookmark-outline"} 
                      size={22} 
                      color={item.isBookmarked ? "#4F78FF" : "#94A3B8"}
                    />
                  </TouchableOpacity>
                </View>
                
                <View style={styles.divider} />
                
                <View style={styles.jobDetails}>
                  <View style={styles.jobDetailItem}>
                    <Ionicons name="location-outline" size={16} color="#94A3B8" />
                    <Text style={styles.jobDetailText}>{item.location}</Text>
                  </View>
                  <View style={styles.jobDetailItem}>
                    <Ionicons name="cash-outline" size={16} color="#94A3B8" />
                    <Text style={styles.jobDetailText}>{item.rate}</Text>
                  </View>
                  <View style={styles.jobDetailItem}>
                    <Ionicons name="time-outline" size={16} color="#94A3B8" />
                    <Text style={styles.jobDetailText}>{item.date}</Text>
                  </View>
                </View>
                
                <View style={styles.tagsContainer}>
                  {item.tags.map((tag, index) => (
                    <View key={index} style={styles.tag}>
                      <Text style={styles.tagText}>{tag}</Text>
                    </View>
                  ))}
                </View>
              </TouchableOpacity>
            </Animated.View>
          )}
        />
      </Animated.View>
      
      {/* Filter Modal */}
      <Modal
        visible={isFilterModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity 
            style={styles.modalBackdrop} 
            activeOpacity={1} 
            onPress={() => setFilterModalVisible(false)}
          />
          <View style={[styles.modalContent, { paddingBottom: insets.bottom + 20 }]}>
            <View style={styles.modalHandle} />
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filter Jobs</Text>
              <TouchableOpacity 
                style={styles.closeButton} 
                onPress={() => setFilterModalVisible(false)}
              >
                <Ionicons name="close" size={24} color="#94A3B8" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Job Type</Text>
                <View style={styles.filterOptions}>
                  {['Full-time', 'Part-time', 'Contract', 'Freelance'].map((type) => (
                    <TouchableOpacity 
                      key={type}
                      style={[
                        styles.filterOption,
                        selectedJobTypes.includes(type) ? styles.filterOptionSelected : {}
                      ]}
                      onPress={() => toggleJobType(type)}
                    >
                      <Text 
                        style={[
                          styles.filterOptionText,
                          selectedJobTypes.includes(type) ? styles.filterOptionTextSelected : {}
                        ]}
                      >
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
                        selectedExperienceLevels.includes(level) ? styles.filterOptionSelected : {}
                      ]}
                      onPress={() => toggleExperienceLevel(level)}
                    >
                      <Text 
                        style={[
                          styles.filterOptionText,
                          selectedExperienceLevels.includes(level) ? styles.filterOptionTextSelected : {}
                        ]}
                      >
                        {level}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Location</Text>
                <View style={styles.filterOptions}>
                  {uniqueLocations.map((location) => (
                    <TouchableOpacity 
                      key={location}
                      style={[
                        styles.filterOption,
                        selectedLocations.includes(location) ? styles.filterOptionSelected : {}
                      ]}
                      onPress={() => toggleLocation(location)}
                    >
                      <Text 
                        style={[
                          styles.filterOptionText,
                          selectedLocations.includes(location) ? styles.filterOptionTextSelected : {}
                        ]}
                      >
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
                style={styles.applyButton}
                onPress={applyFilters}
              >
                <Text style={styles.applyButtonText}>Apply Filters</Text>
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
    backgroundColor: '#121212',
  },
  header: {
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    overflow: 'hidden',
    paddingHorizontal: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  largeTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginTop: -20,
    marginBottom: 10,
    zIndex: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    backgroundColor: '#1E1E1E',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingLeft: 16,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: '#FFFFFF',
  },
  clearButton: {
    padding: 4,
  },
  filtersApplied: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  filtersAppliedText: {
    fontSize: 14,
    color: '#94A3B8',
  },
  clearFiltersText: {
    fontSize: 14,
    color: '#4F78FF',
    fontWeight: '600',
  },
  resultsContainer: {
    flex: 1,
    paddingTop: 10,
  },
  resultsCount: {
    fontSize: 14,
    fontWeight: '500',
    color: '#94A3B8',
    marginHorizontal: 20,
    marginBottom: 16,
  },
  jobsList: {
    paddingHorizontal: 20,
  },
  jobCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 16,
    marginBottom: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2A2A2A',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 2,
  },
  jobCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  companyLogo: {
    width: 56,
    height: 56,
    borderRadius: 12,
    marginRight: 12,
  },
  jobInfo: {
    flex: 1,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  companyName: {
    fontSize: 14,
    color: '#94A3B8',
    marginBottom: 8,
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  jobType: {
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    overflow: 'hidden',
    marginRight: 8,
  },
  fullTimeType: {
    backgroundColor: 'rgba(79, 120, 255, 0.2)',
    color: '#4F78FF',
  },
  partTimeType: {
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
    color: '#22C55E',
  },
  contractType: {
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    color: '#F59E0B',
  },
  freelanceType: {
    backgroundColor: 'rgba(147, 51, 234, 0.2)',
    color: '#9333EA',
  },
  experienceLevel: {
    fontSize: 12,
    color: '#94A3B8',
    backgroundColor: '#2A2A2A',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
  },
  bookmarkButton: {
    padding: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#2A2A2A',
    marginVertical: 12,
  },
  jobDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  jobDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 4,
  },
  jobDetailText: {
    marginLeft: 4,
    fontSize: 13,
    color: '#94A3B8',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#2A2A2A',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 12,
    color: '#4F78FF',
    fontWeight: '500',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    backgroundColor: '#1E1E1E',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 16,
    paddingBottom: 40,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#2A2A2A', 
    borderBottomWidth: 0,
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#3A3A3A',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2A2A2A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBody: {
    maxHeight: height * 0.6,
  },
  filterSection: {
    marginBottom: 24,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  filterOption: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2A2A2A',
    backgroundColor: '#1E1E1E',
    marginRight: 12,
    marginBottom: 12,
  },
  filterOptionSelected: {
    backgroundColor: '#4F78FF',
    borderColor: '#4F78FF',
  },
  filterOptionText: {
    fontSize: 14,
    color: '#94A3B8',
  },
  filterOptionTextSelected: {
    color: '#FFFFFF',
  },
  modalFooter: {
    flexDirection: 'row',
    marginTop: 24,
  },
  resetButton: {
    flex: 1,
    backgroundColor: '#2A2A2A',
    borderRadius: 12,
    paddingVertical: 14,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetButtonText: {
    color: '#94A3B8',
    fontSize: 16,
    fontWeight: '600',
  },
  applyButton: {
    flex: 2,
    backgroundColor: '#4F78FF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});