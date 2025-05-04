import React, { useState, useRef, useEffect } from 'react';
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
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { MotiView } from 'moti';
import BottomNavigation from '../components/BottomNavigation';

const { width, height } = Dimensions.get('window');

// 2025 Design System Colors - Updated for local gig theme
const COLORS = {
  primary: '#FF6B00', // Vibrant orange
  primaryLight: '#FF8F3C',
  primaryDark: '#E65A00',
  secondary: '#2A4494', // Deep blue
  accent: '#FFB627', // Amber/gold
  success: '#4CAF50', // Green
  warning: '#FFB627', // Amber
  danger: '#F44336', // Red
  text: '#252C37', // Dark slate
  textSecondary: '#4E5968', // Medium slate
  textTertiary: '#8A94A3', // Light slate
  background: '#F8FAFC', // Light slate
  surfacePrimary: '#FFFFFF', // White
  surfaceSecondary: '#F1F5F9', // Light slate
  border: '#E2E8F0', // Medium-light slate
  borderLight: '#F1F5F9', // Very light slate
  shadow: 'rgba(15, 23, 42, 0.08)', // Shadow with opacity
};

// Updated job interface for hyper-local gigs
interface Job {
  id: string;
  title: string;
  company: string;
  logo: string;
  location: string;
  distance: string;
  hourlyRate: string;
  totalPay: string;
  date: string;
  time: string; 
  duration: string;
  isBookmarked: boolean;
  jobType: 'Catering' | 'Event Staff' | 'Service' | 'Kitchen' | 'Cleaning' | 'Delivery';
  experienceNeeded: 'None' | 'Basic' | 'Experienced';
  urgency?: 'urgent' | 'flexible';
  rating?: number;
  reviews?: number;
  verified?: boolean;
  paymentMethod?: 'Cash' | 'Online' | 'Both';
  transport?: boolean;
  clothingRequirements?: string[];
  slots?: { filled: number, total: number };
}

// Updated mock data for hyper-local jobs
const JOBS: Job[] = [
  {
    id: '1',
    title: 'Catering Server',
    company: 'Elite Events',
    logo: 'https://randomuser.me/api/portraits/men/41.jpg',
    location: 'Grand Plaza Hotel',
    distance: '1.2km',
    hourlyRate: '$22/hr',
    totalPay: '$110',
    date: 'Today',
    time: '5:00 PM - 10:00 PM',
    duration: '5h',
    isBookmarked: true,
    jobType: 'Catering',
    experienceNeeded: 'Basic',
    urgency: 'urgent',
    rating: 4.7,
    reviews: 32,
    verified: true,
    paymentMethod: 'Both',
    transport: false,
    clothingRequirements: ['Black pants', 'White shirt', 'Black shoes'],
    slots: { filled: 4, total: 8 }
  },
  {
    id: '2',
    title: 'Wedding Bartender',
    company: 'Premier Catering',
    logo: 'https://randomuser.me/api/portraits/women/65.jpg',
    location: 'Riverside Gardens',
    distance: '3.5km',
    hourlyRate: '$25/hr',
    totalPay: '$175',
    date: 'Tomorrow',
    time: '4:00 PM - 11:00 PM',
    duration: '7h',
    isBookmarked: false,
    jobType: 'Catering',
    experienceNeeded: 'Experienced',
    rating: 4.5,
    reviews: 18,
    verified: true,
    paymentMethod: 'Online',
    transport: true,
    clothingRequirements: ['Black pants', 'Black vest', 'White shirt'],
    slots: { filled: 1, total: 2 }
  },
  {
    id: '3',
    title: 'Food Server - Corporate Event',
    company: 'Business Catering Co.',
    logo: 'https://randomuser.me/api/portraits/men/32.jpg',
    location: 'Tech Center Downtown',
    distance: '0.7km',
    hourlyRate: '$20/hr',
    totalPay: '$80',
    date: 'Today',
    time: '11:30 AM - 3:30 PM',
    duration: '4h',
    isBookmarked: false,
    jobType: 'Catering',
    experienceNeeded: 'None',
    urgency: 'urgent',
    rating: 4.8,
    reviews: 42,
    verified: true,
    paymentMethod: 'Online',
    transport: false,
    clothingRequirements: ['Business casual'],
    slots: { filled: 3, total: 6 }
  },
  {
    id: '4',
    title: 'Dishwasher - Restaurant Support',
    company: 'Fresh Kitchens',
    logo: 'https://randomuser.me/api/portraits/women/44.jpg',
    location: 'Downtown Bistro',
    distance: '1.8km',
    hourlyRate: '$18/hr',
    totalPay: '$108',
    date: 'Tomorrow',
    time: '4:00 PM - 10:00 PM',
    duration: '6h',
    isBookmarked: true,
    jobType: 'Kitchen',
    experienceNeeded: 'None',
    rating: 4.2,
    reviews: 15,
    verified: true,
    paymentMethod: 'Cash',
    transport: false,
    slots: { filled: 1, total: 2 }
  },
  {
    id: '5',
    title: 'Event Setup Staff',
    company: 'City Events',
    logo: 'https://randomuser.me/api/portraits/men/59.jpg',
    location: 'Convention Center',
    distance: '2.3km',
    hourlyRate: '$19/hr',
    totalPay: '$95',
    date: 'In 2 days',
    time: '6:00 AM - 11:00 AM',
    duration: '5h',
    isBookmarked: false,
    jobType: 'Event Staff',
    experienceNeeded: 'None',
    rating: 4.4,
    reviews: 26,
    verified: false,
    paymentMethod: 'Cash',
    transport: true,
    clothingRequirements: ['T-shirt provided', 'Jeans', 'Comfortable shoes'],
    slots: { filled: 5, total: 10 }
  },
  {
    id: '6',
    title: 'Breakfast Buffet Attendant',
    company: 'Morning Delights Catering',
    logo: 'https://randomuser.me/api/portraits/women/33.jpg',
    location: 'Bayview Hotel',
    distance: '0.6km',
    hourlyRate: '$21/hr',
    totalPay: '$84',
    date: 'Tomorrow',
    time: '6:00 AM - 10:00 AM',
    duration: '4h',
    isBookmarked: false,
    jobType: 'Catering',
    experienceNeeded: 'Basic',
    rating: 4.3,
    reviews: 13,
    verified: true,
    paymentMethod: 'Both',
    transport: false,
    clothingRequirements: ['Black pants', 'White shirt', 'Hair net'],
    slots: { filled: 2, total: 3 }
  },
  {
    id: '7',
    title: 'Banquet Server - Wedding',
    company: 'Dream Day Events',
    logo: 'https://randomuser.me/api/portraits/men/36.jpg',
    location: 'Hilltop Vineyard',
    distance: '5.8km',
    hourlyRate: '$23/hr',
    totalPay: '$161',
    date: 'Saturday',
    time: '3:00 PM - 10:00 PM',
    duration: '7h',
    isBookmarked: true,
    jobType: 'Catering',
    experienceNeeded: 'Experienced',
    rating: 4.9,
    reviews: 48,
    verified: true,
    paymentMethod: 'Online',
    transport: true,
    clothingRequirements: ['Black formal attire', 'Black dress shoes'],
    slots: { filled: 6, total: 12 }
  },
  {
    id: '8',
    title: 'Kitchen Helper - Prep Work',
    company: 'Gourmet Solutions',
    logo: 'https://randomuser.me/api/portraits/women/68.jpg',
    location: 'Central Kitchen',
    distance: '1.4km',
    hourlyRate: '$17/hr',
    totalPay: '$85',
    date: 'Tomorrow',
    time: '9:00 AM - 2:00 PM',
    duration: '5h',
    isBookmarked: false,
    jobType: 'Kitchen',
    experienceNeeded: 'Basic',
    rating: 4.5,
    reviews: 22,
    verified: true,
    paymentMethod: 'Cash',
    transport: false,
    clothingRequirements: ['Apron provided', 'Closed-toe shoes'],
    slots: { filled: 2, total: 4 }
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
  const [applyingJob, setApplyingJob] = useState<string | null>(null);
  
  // Animation values
  const scrollY = useRef(new RNAnimated.Value(0)).current;
  const searchFocus = useSharedValue(0);
  
  // Header animations
  const headerHeight = scrollY.interpolate({
    inputRange: [0, 80],
    outputRange: [110, 70],
    extrapolate: 'clamp'
  });
  
  const headerTitleOpacity = scrollY.interpolate({
    inputRange: [0, 40, 80],
    outputRange: [0, 0.7, 1],
    extrapolate: 'clamp'
  });
  
  // Search animation
  const searchAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: withSpring(searchFocus.value ? 1.02 : 1) }],
      shadowOpacity: withSpring(searchFocus.value ? 0.15 : 0.05),
    };
  });
  
  // Handle search focus
  const handleSearchFocus = (focused: boolean) => {
    searchFocus.value = focused ? 1 : 0;
  };
  
  const handleSearch = (text: string) => {
    setSearchQuery(text);
    if (text.trim() === '') {
      applyFilters();
    } else {
      const searchResults = JOBS.filter(job => 
        job.title.toLowerCase().includes(text.toLowerCase()) ||
        job.company.toLowerCase().includes(text.toLowerCase()) ||
        job.jobType.toLowerCase().includes(text.toLowerCase()) ||
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
        job.jobType.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
        selectedJobTypes.includes(job.jobType)
      );
    }
    
    // Apply experience level filter
    if (selectedExperienceLevels.length > 0) {
      filteredResults = filteredResults.filter(job => 
        selectedExperienceLevels.includes(job.experienceNeeded)
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
  
  // Add new function for apply now button
  const handleApplyNow = (jobId: string) => {
    setApplyingJob(jobId);
    // Simulate API call
    setTimeout(() => {
      setApplyingJob(null);
      // Navigate to job details or application page
      router.push({
        pathname: '/dashboard/job-details',
        params: { job: JSON.stringify(JOBS.find(job => job.id === jobId)) }
      });
    }, 1500);
  };
  
  // Add a function to get card style based on job urgency
  const getJobCardStyle = (job: Job) => {
    const baseStyle = [styles.jobCard];
    if (job.urgency === 'urgent') {
      baseStyle.push(styles.urgentJobCard);
    }
    return baseStyle;
  };
  
  // Add a function to get appropriate job type icon
  const getJobTypeIcon = (jobType: string) => {
    switch(jobType) {
      case 'Catering':
        return 'restaurant-outline';
      case 'Event Staff':
        return 'people-outline';
      case 'Service':
        return 'happy-outline';
      case 'Kitchen':
        return 'fast-food-outline';
      case 'Cleaning':
        return 'sparkles-outline';
      case 'Delivery':
        return 'bicycle-outline';
      default:
        return 'briefcase-outline';
    }
  };

  // Format time until job starts
  const getTimeUntilJob = (jobDate: string) => {
    if (jobDate === 'Today') return 'Today';
    if (jobDate === 'Tomorrow') return 'Tomorrow';
    return jobDate;
  };
  
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" />
      
      <RNAnimated.View style={[
        styles.headerContainer,
        { height: headerHeight }
      ]}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="chevron-back" size={22} color={COLORS.text} />
          </TouchableOpacity>
          <RNAnimated.Text style={[
            styles.headerTitle,
            { opacity: headerTitleOpacity }
          ]}>
            Nearby Gigs
          </RNAnimated.Text>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => setFilterModalVisible(true)}
          >
            <Ionicons name="options-outline" size={22} color={COLORS.text} />
          </TouchableOpacity>
        </View>
        
        <Animated.View style={[styles.searchContainer, searchAnimatedStyle]}>
          <View style={styles.searchInputContainer}>
            <Ionicons name="search-outline" size={20} color={COLORS.textTertiary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search catering jobs nearby..."
              placeholderTextColor={COLORS.textTertiary}
              value={searchQuery}
              onChangeText={handleSearch}
              onFocus={() => handleSearchFocus(true)}
              onBlur={() => handleSearchFocus(false)}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity 
                onPress={() => handleSearch('')}
                style={styles.clearButton}
              >
                <Ionicons name="close-circle" size={18} color={COLORS.textTertiary} />
              </TouchableOpacity>
            )}
          </View>
        </Animated.View>
        
        <LinearGradient
          colors={['rgba(248,250,252,1)', 'rgba(248,250,252,0)']}
          style={styles.headerGradient}
          pointerEvents="none"
        />
      </RNAnimated.View>

      <FlatList
        data={filteredJobs}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        onScroll={RNAnimated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Ionicons name="restaurant-outline" size={60} color={COLORS.textTertiary} />
            <Text style={styles.emptyTitle}>No gigs found nearby</Text>
            <Text style={styles.emptySubtitle}>Try expanding your search area or check back later</Text>
            <TouchableOpacity 
              style={styles.resetSearchButton}
              onPress={resetFilters}
            >
              <Text style={styles.resetSearchText}>Reset filters</Text>
            </TouchableOpacity>
          </View>
        )}
        renderItem={({ item, index }) => (
          <MotiView
            from={{ opacity: 0, translateY: 20, scale: 0.95 }}
            animate={{ opacity: 1, translateY: 0, scale: 1 }}
            transition={{ 
              type: 'timing',
              duration: 350,
              delay: index * 80,
            }}
            style={getJobCardStyle(item)}
          >
            <TouchableOpacity 
              onPress={() => router.push({
                pathname: '/dashboard/job-details',
                params: { job: JSON.stringify(item) }
              })}
              activeOpacity={0.9}
            >
              <BlurView intensity={10} tint="light" style={styles.jobCardBlur}>
                <View style={styles.cardContent}>
                  {/* Job Type Badge */}
                  <View style={styles.jobTypeBadge}>
                    <Ionicons name={getJobTypeIcon(item.jobType)} size={14} color={COLORS.primary} />
                    <Text style={styles.jobTypeText}>{item.jobType}</Text>
                  </View>
                  
                  {/* Company Logo */}
                  <View style={styles.companyLogoContainer}>
                    <Image 
                      source={{ uri: item.logo }} 
                      style={styles.companyLogo} 
                      resizeMode="cover"
                    />
                    {item.verified && (
                      <View style={styles.verifiedBadge}>
                        <Ionicons name="checkmark" size={10} color="#FFF" />
                      </View>
                    )}
                  </View>
                
                  {/* Job Title and Company */}
                  <View style={styles.jobMainInfo}>
                    <View style={styles.jobTitleRow}>
                      <Text style={styles.jobTitle} numberOfLines={1}>
                        {item.title}
                      </Text>
                      
                      {item.urgency === 'urgent' && (
                        <View style={styles.urgentBadge}>
                          <Ionicons name="flash" size={10} color="#FFF" />
                          <Text style={styles.urgentText}>URGENT</Text>
                        </View>
                      )}
                    </View>
                    
                    <View style={styles.companyRow}>
                      <Text style={styles.companyName}>{item.company}</Text>
                      {item.rating && (
                        <View style={styles.ratingContainer}>
                          <Ionicons name="star" size={12} color={COLORS.accent} />
                          <Text style={styles.ratingText}>{item.rating}</Text>
                        </View>
                      )}
                    </View>
                  </View>
                  
                  {/* Divider */}
                  <View style={styles.divider} />
                  
                  {/* Location and Time (Most Important for Gig Workers) */}
                  <View style={styles.jobMetaSection}>
                    <View style={styles.metaItem}>
                      <View style={styles.metaIconContainer}>
                        <Ionicons name="location-outline" size={14} color={COLORS.primary} />
                      </View>
                      <Text style={styles.metaText} numberOfLines={1}>
                        {item.location} • <Text style={styles.highlightText}>{item.distance}</Text> away
                      </Text>
                    </View>
                    
                    <View style={styles.metaItem}>
                      <View style={styles.metaIconContainer}>
                        <Ionicons name="calendar-outline" size={14} color={COLORS.primary} />
                      </View>
                      <Text style={styles.metaText} numberOfLines={1}>
                        <Text style={styles.highlightText}>{getTimeUntilJob(item.date)}</Text> • {item.time}
                      </Text>
                    </View>
                    
                    <View style={styles.metaItem}>
                      <View style={styles.metaIconContainer}>
                        <Ionicons name="time-outline" size={14} color={COLORS.primary} />
                      </View>
                      <Text style={styles.metaText} numberOfLines={1}>
                        Duration: <Text style={styles.highlightText}>{item.duration}</Text>
                      </Text>
                    </View>
                  </View>
                  
                  {/* Requirements Tags */}
                  {item.clothingRequirements && (
                    <View style={styles.requirementsContainer}>
                      <Text style={styles.requirementsLabel}>Requirements:</Text>
                      <View style={styles.tagsContainer}>
                        {item.clothingRequirements.map((req, i) => (
                          <View key={i} style={styles.tagItem}>
                            <Ionicons name="shirt-outline" size={12} color={COLORS.textSecondary} />
                            <Text style={styles.tagText}>{req}</Text>
                          </View>
                        ))}
                        
                        {item.experienceNeeded !== 'None' && (
                          <View style={styles.tagItem}>
                            <Ionicons name="briefcase-outline" size={12} color={COLORS.textSecondary} />
                            <Text style={styles.tagText}>{item.experienceNeeded} exp.</Text>
                          </View>
                        )}
                        
                        {item.transport && (
                          <View style={styles.tagItem}>
                            <Ionicons name="car-outline" size={12} color={COLORS.textSecondary} />
                            <Text style={styles.tagText}>Transport</Text>
                          </View>
                        )}
                      </View>
                    </View>
                  )}
                  
                  {/* Salary & Apply */}
                  <View style={styles.salaryApplyRow}>
                    <View style={styles.salaryContainer}>
                      <Text style={styles.salaryLabel}>Earnings ({item.duration})</Text>
                      <View style={styles.paymentMethodContainer}>
                        <Text style={styles.salaryAmount}>{item.totalPay}</Text>
                        {item.paymentMethod && (
                          <View style={styles.paymentMethodBadge}>
                            <Ionicons 
                              name={item.paymentMethod === 'Cash' ? 'cash-outline' : 
                                   item.paymentMethod === 'Online' ? 'card-outline' : 'wallet-outline'} 
                              size={12} 
                              color={COLORS.textSecondary} 
                            />
                            <Text style={styles.paymentMethodText}>{item.paymentMethod}</Text>
                          </View>
                        )}
                      </View>
                    </View>
                    
                    <TouchableOpacity 
                      style={styles.applyButton}
                      onPress={() => handleApplyNow(item.id)}
                      disabled={applyingJob === item.id}
                    >
                      {applyingJob === item.id ? (
                        <ActivityIndicator size="small" color="#FFFFFF" />
                      ) : (
                        <>
                          <Text style={styles.applyButtonText}>Quick Apply</Text>
                          <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
                        </>
                      )}
                    </TouchableOpacity>
                  </View>
                  
                  {/* Slots Info */}
                  {item.slots && (
                    <View style={styles.slotsContainer}>
                      <View style={styles.slotsProgressBar}>
                        <View 
                          style={[
                            styles.slotsProgress, 
                            { width: `${(item.slots.filled / item.slots.total) * 100}%` }
                          ]} 
                        />
                      </View>
                      <Text style={styles.slotsText}>
                        {item.slots.filled}/{item.slots.total} positions filled • {item.slots.total - item.slots.filled} left
                      </Text>
                    </View>
                  )}
                </View>
              </BlurView>
            </TouchableOpacity>
          </MotiView>
        )}
      />

      <Modal
        visible={isFilterModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <BlurView intensity={30} tint="dark" style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHandle} />
            
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filter Gigs</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setFilterModalVisible(false)}
              >
                <Ionicons name="close" size={22} color={COLORS.text} />
              </TouchableOpacity>
            </View>
            
            <ScrollView 
              style={styles.filterContent}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Job Type</Text>
                <View style={styles.filterOptions}>
                  {['Catering', 'Event Staff', 'Service', 'Kitchen', 'Cleaning', 'Delivery'].map((type) => (
                    <TouchableOpacity
                      key={type}
                      style={[
                        styles.filterOption,
                        selectedJobTypes.includes(type) && styles.filterOptionSelected
                      ]}
                      onPress={() => toggleJobType(type)}
                    >
                      {selectedJobTypes.includes(type) && (
                        <View style={styles.filterSelectedIcon}>
                          <Ionicons name="checkmark" size={12} color="#FFFFFF" />
                        </View>
                      )}
                      <Ionicons 
                        name={getJobTypeIcon(type)} 
                        size={14} 
                        color={selectedJobTypes.includes(type) ? "#FFFFFF" : COLORS.textSecondary} 
                        style={{marginRight: 6}}
                      />
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
                  {['None', 'Basic', 'Experienced'].map((level) => (
                    <TouchableOpacity
                      key={level}
                      style={[
                        styles.filterOption,
                        selectedExperienceLevels.includes(level) && styles.filterOptionSelected
                      ]}
                      onPress={() => toggleExperienceLevel(level)}
                    >
                      {selectedExperienceLevels.includes(level) && (
                        <View style={styles.filterSelectedIcon}>
                          <Ionicons name="checkmark" size={12} color="#FFFFFF" />
                        </View>
                      )}
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
                <Text style={styles.filterSectionTitle}>Distance</Text>
                <View style={styles.distanceSlider}>
                  <View style={styles.sliderLabels}>
                    <Text style={styles.sliderLabel}>0 km</Text>
                    <Text style={styles.sliderLabelCurrent}>Within 5 km</Text>
                    <Text style={styles.sliderLabel}>10+ km</Text>
                  </View>
                  <View style={styles.sliderTrack}>
                    <View style={styles.sliderFill} />
                    <View style={styles.sliderThumb}>
                      <View style={styles.sliderThumbInner} />
                    </View>
                  </View>
                </View>
              </View>
              
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Timing</Text>
                <View style={styles.timingOptions}>
                  <TouchableOpacity style={[styles.timingOption, styles.timingOptionSelected]}>
                    <Text style={[styles.timingOptionText, styles.timingOptionTextSelected]}>Today</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.timingOption}>
                    <Text style={styles.timingOptionText}>Tomorrow</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.timingOption}>
                    <Text style={styles.timingOptionText}>This Week</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.timingOption}>
                    <Text style={styles.timingOptionText}>Any Time</Text>
                  </TouchableOpacity>
                </View>
              </View>
              
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Shift Duration</Text>
                <View style={styles.filterOptions}>
                  {['Under 4h', '4-6h', '6-8h', '8h+'].map((duration) => (
                    <TouchableOpacity
                      key={duration}
                      style={styles.filterOption}
                    >
                      <Text style={styles.filterOptionText}>
                        {duration}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Payment</Text>
                <View style={styles.filterOptions}>
                  {['Cash', 'Online', 'Both'].map((payment) => (
                    <TouchableOpacity
                      key={payment}
                      style={styles.filterOption}
                    >
                      <Ionicons 
                        name={payment === 'Cash' ? 'cash-outline' : 
                            payment === 'Online' ? 'card-outline' : 'wallet-outline'} 
                        size={14} 
                        color={COLORS.textSecondary} 
                        style={{marginRight: 6}}
                      />
                      <Text style={styles.filterOptionText}>
                        {payment}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Additional Filters</Text>
                <View style={styles.optionSwitches}>
                  <View style={styles.switchOption}>
                    <Text style={styles.switchLabel}>Verified Employers Only</Text>
                    <TouchableOpacity style={styles.switchTrack}>
                      <View style={styles.switchThumb} />
                    </TouchableOpacity>
                  </View>
                  
                  <View style={styles.switchOption}>
                    <Text style={styles.switchLabel}>Transport Provided</Text>
                    <TouchableOpacity style={[styles.switchTrack, styles.switchActive]}>
                      <View style={[styles.switchThumb, styles.switchThumbActive]} />
                    </TouchableOpacity>
                  </View>
                  
                  <View style={styles.switchOption}>
                    <Text style={styles.switchLabel}>Urgent Jobs Only</Text>
                    <TouchableOpacity style={styles.switchTrack}>
                      <View style={styles.switchThumb} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              
              <View style={styles.spacing} />
            </ScrollView>
            
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.resetButton}
                onPress={resetFilters}
              >
                <Text style={styles.resetButtonText}>Reset All</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.applyFilterButton}
                onPress={applyFilters}
              >
                <Text style={styles.applyFilterButtonText}>Find Gigs</Text>
              </TouchableOpacity>
            </View>
          </View>
        </BlurView>
      </Modal>

      <BottomNavigation />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.background,
    paddingHorizontal: 20,
    paddingBottom: 20,
    zIndex: 10,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: COLORS.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
    letterSpacing: -0.3,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: COLORS.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    marginTop: 16,
    shadowColor: COLORS.text,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 4,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfacePrimary,
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 48,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: COLORS.text,
    height: '100%',
    fontWeight: '400',
  },
  clearButton: {
    padding: 4,
  },
  headerGradient: {
    position: 'absolute',
    bottom: -30,
    left: 0,
    right: 0,
    height: 30,
    zIndex: 5,
  },
  listContent: {
    padding: 16,
    paddingTop: 140,
    paddingBottom: 100,
  },
  jobCard: {
    marginBottom: 20,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 5,
  },
  urgentJobCard: {
    borderWidth: 1.5,
    borderColor: COLORS.accent,
  },
  jobCardBlur: {
    borderRadius: 20,
  },
  cardContent: {
    padding: 16,
  },
  jobTypeBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 107, 0, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    zIndex: 5,
  },
  jobTypeText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primary,
    marginLeft: 4,
  },
  companyLogoContainer: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 50,
    height: 50,
    borderRadius: 15,
    backgroundColor: COLORS.surfaceSecondary,
    overflow: 'hidden',
    zIndex: 1,
  },
  companyLogo: {
    width: '100%',
    height: '100%',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    backgroundColor: COLORS.success,
    borderRadius: 10,
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  jobMainInfo: {
    marginTop: 30,
    marginRight: 60,
    marginBottom: 12,
  },
  jobTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    flex: 1,
    marginRight: 8,
    letterSpacing: -0.3,
  },
  urgentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.accent,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  urgentText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
    marginLeft: 2,
    letterSpacing: 0.5,
  },
  companyRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  companyName: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginRight: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 182, 39, 0.1)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.accent,
    marginLeft: 2,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.borderLight,
    marginVertical: 12,
  },
  jobMetaSection: {
    marginBottom: 14,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  metaIconContainer: {
    width: 26,
    height: 26,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 107, 0, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  metaText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    flex: 1,
  },
  highlightText: {
    color: COLORS.text,
    fontWeight: '600',
  },
  requirementsContainer: {
    marginBottom: 14,
  },
  requirementsLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tagItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceSecondary,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginLeft: 4,
    fontWeight: '500',
  },
  salaryApplyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  salaryContainer: {
    flex: 1,
  },
  salaryLabel: {
    fontSize: 12,
    color: COLORS.textTertiary,
    marginBottom: 2,
  },
  paymentMethodContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  salaryAmount: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.primary,
    marginRight: 8,
  },
  paymentMethodBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceSecondary,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  paymentMethodText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginLeft: 4,
    fontWeight: '500',
  },
  applyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
  },
  applyButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  slotsContainer: {
    width: '100%',
  },
  slotsProgressBar: {
    height: 6,
    backgroundColor: 'rgba(255, 107, 0, 0.1)',
    borderRadius: 3,
    marginBottom: 8,
    overflow: 'hidden',
  },
  slotsProgress: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 3,
  },
  slotsText: {
    fontSize: 12,
    color: COLORS.textTertiary,
    textAlign: 'right',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 22,
  },
  resetSearchButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: COLORS.surfaceSecondary,
    borderRadius: 12,
  },
  resetSearchText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.primary,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.surfacePrimary,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    maxHeight: height * 0.85,
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.borderLight,
    alignSelf: 'center',
    marginBottom: 12,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    letterSpacing: -0.3,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: COLORS.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  filterSection: {
    marginBottom: 28,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  filterOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: COLORS.borderLight,
    backgroundColor: COLORS.surfacePrimary,
    marginBottom: 4,
  },
  filterOptionSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterSelectedIcon: {
    marginRight: 6,
  },
  filterOptionText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.textSecondary,
  },
  filterOptionTextSelected: {
    color: '#FFFFFF',
  },
  distanceSlider: {
    marginTop: 8,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sliderLabel: {
    fontSize: 12,
    color: COLORS.textTertiary,
  },
  sliderLabelCurrent: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },
  sliderTrack: {
    height: 6,
    backgroundColor: 'rgba(255, 107, 0, 0.1)',
    borderRadius: 3,
    position: 'relative',
  },
  sliderFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    height: '100%',
    width: '50%',
    backgroundColor: COLORS.primary,
    borderRadius: 3,
  },
  sliderThumb: {
    position: 'absolute',
    top: -8,
    left: '50%',
    marginLeft: -12,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    shadowColor: COLORS.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sliderThumbInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
  },
  timingOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 8,
  },
  timingOption: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: COLORS.borderLight,
    backgroundColor: COLORS.surfacePrimary,
  },
  timingOptionSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  timingOptionText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.textSecondary,
  },
  timingOptionTextSelected: {
    color: '#FFFFFF',
  },
  optionSwitches: {
    gap: 16,
  },
  switchOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  switchLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.text,
  },
  switchTrack: {
    width: 46,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.surfaceSecondary,
    padding: 3,
  },
  switchActive: {
    backgroundColor: COLORS.primary,
  },
  switchThumb: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: COLORS.surfacePrimary,
    shadowColor: COLORS.text,
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  switchThumbActive: {
    transform: [{ translateX: 18 }],
  },
  spacing: {
    height: 20,
  },
  modalFooter: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    gap: 12,
  },
  resetButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: COLORS.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  applyFilterButton: {
    flex: 2,
    paddingVertical: 14,
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyFilterButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});