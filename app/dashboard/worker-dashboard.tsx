import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  RefreshControl,
  TextInput,
  Dimensions,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../providers/AuthContext';
import Animated, { 
  FadeInDown, 
  FadeIn,
  useSharedValue, 
  withSpring,
  withTiming,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';
import BottomNavigation from '../components/BottomNavigation';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Mock data for demonstration
const STATS = {
  balance: 0.00,
  upcomingJobs: 0,
  hireRequests: 2,
  jobsApplied: 5
};

const SUGGESTED_JOBS = [
  {
    id: '1',
    title: 'Warehouse Associate',
    location: 'Mumbai',
    hourlyRate: '₹250/hr',
    logo: 'https://ui-avatars.com/api/?name=WH&background=E0E0E0&color=3498DB',
    company: 'LogiCorp',
    postedDate: '2 hours ago',
    type: 'Full-time'
  },
  {
    id: '2',
    title: 'Office Assistant',
    location: 'Delhi',
    hourlyRate: '₹300/hr',
    logo: 'https://ui-avatars.com/api/?name=OA&background=E0E0E0&color=3498DB',
    company: 'AdminPro',
    postedDate: '5 hours ago',
    type: 'Part-time'
  },
  {
    id: '3',
    title: 'Delivery Driver',
    location: 'Bangalore',
    hourlyRate: '₹280/hr',
    logo: 'https://ui-avatars.com/api/?name=DD&background=E0E0E0&color=3498DB',
    company: 'QuickDeliver',
    postedDate: '1 day ago',
    type: 'Full-time'
  }
];

// Get the current time to display appropriate greeting
const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning!';
  if (hour < 18) return 'Good Afternoon!';
  return 'Good Evening!';
};

export default function WorkerDashboard() {
  const router = useRouter();
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isBalanceExpanded, setIsBalanceExpanded] = useState(false);
  const [applyingJob, setApplyingJob] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Animation values
  const balanceScale = useSharedValue(1);
  const searchBarWidth = useSharedValue(SCREEN_WIDTH - 48);
  const scrollY = useSharedValue(0);
  
  // Animated styles
  const headerAnimatedStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      scrollY.value,
      [0, 100],
      [0, -50],
      'clamp'
    );
    return {
      transform: [{ translateY }],
    };
  });

  const searchBarAnimatedStyle = useAnimatedStyle(() => {
    const width = interpolate(
      scrollY.value,
      [0, 100],
      [SCREEN_WIDTH - 48, SCREEN_WIDTH - 96],
      'clamp'
    );
    return {
      width,
    };
  });
  
  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  const onRefresh = () => {
    setRefreshing(true);
    // Simulate a data refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };
  
  const handlePressBalanceCard = () => {
    setIsBalanceExpanded(!isBalanceExpanded);
    balanceScale.value = withSpring(0.98, {}, () => {
      balanceScale.value = withSpring(1);
    });
  };

  const handleApplyNow = (jobId: string) => {
    setApplyingJob(jobId);
    // Simulate API call
    setTimeout(() => {
      setApplyingJob(null);
      // Here you would handle the success state or navigate to a confirmation page
    }, 1500);
  };

  const handleScroll = (event: any) => {
    scrollY.value = event.nativeEvent.contentOffset.y;
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Animated Header */}
      <Animated.View 
        style={[styles.headerContainer, headerAnimatedStyle]}
      >
        <LinearGradient
          colors={['#FFFFFF', '#F8F9FA']}
          style={styles.headerGradient}
        >
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>
                {getGreeting()} {user?.fullName || 'User'}
              </Text>
              <Text style={styles.subtitle}>What Jobs are you searching?</Text>
            </View>
          </View>
        </LinearGradient>
      </Animated.View>
      
      {/* Main Content */}
      <Animated.ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 90, paddingTop: insets.top + 20 } 
        ]}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {/* Search Bar */}
        <Animated.View 
          entering={FadeInDown.delay(300).duration(600)}
          style={[styles.searchContainer, searchBarAnimatedStyle]}
        >
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color="#9CA3AF" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search for your job"
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={setSearchQuery}
              editable={!isLoading}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity 
                onPress={() => setSearchQuery('')}
                style={styles.clearButton}
              >
                <Ionicons name="close-circle" size={20} color="#9CA3AF" />
              </TouchableOpacity>
            )}
          </View>
        </Animated.View>

        {/* Balance Card */}
        <Animated.View 
          entering={FadeInDown.delay(400).duration(600)} 
          style={styles.balanceCardContainer}
        >
          <TouchableOpacity 
            activeOpacity={0.9}
            onPress={handlePressBalanceCard}
            disabled={isLoading}
            style={styles.balanceCard}
          >
            <LinearGradient
              colors={['#1A1A1A', '#2D2D2D']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.balanceGradient}
            >
              {isLoading ? (
                <ActivityIndicator size="large" color="#FFFFFF" />
              ) : (
                <>
                  <View style={styles.balanceHeader}>
                    <Text style={styles.balanceLabel}>Current Balance</Text>
                    <Ionicons name="chevron-down" size={20} color="#FFFFFF" style={[
                      styles.balanceExpandIcon,
                      isBalanceExpanded && styles.balanceExpandIconRotated
                    ]} />
                  </View>
                  <Text style={styles.balanceValue}>₹{STATS.balance.toFixed(2)}</Text>
                  
                  {isBalanceExpanded && (
                    <View style={styles.balanceBreakdown}>
                      <View style={styles.breakdownItem}>
                        <Text style={styles.breakdownLabel}>Earnings</Text>
                        <Text style={styles.breakdownValue}>₹0.00</Text>
                      </View>
                      <View style={styles.breakdownItem}>
                        <Text style={styles.breakdownLabel}>Deductions</Text>
                        <Text style={styles.breakdownValue}>₹0.00</Text>
                      </View>
                    </View>
                  )}
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        {/* Quick Access Cards */}
        <Animated.View 
          entering={FadeInDown.delay(500).duration(600)}
          style={styles.quickAccessContainer}
        >
          <TouchableOpacity style={styles.quickAccessCard}>
            <View style={styles.quickAccessIconContainer}>
              <Ionicons name="calendar-outline" size={24} color="#3498DB" />
            </View>
            <Text style={styles.quickAccessLabel}>Upcoming Job</Text>
            <Text style={styles.quickAccessValue}>{STATS.upcomingJobs}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.quickAccessCard}>
            <View style={styles.quickAccessIconContainer}>
              <Ionicons name="mail-outline" size={24} color="#3498DB" />
              {STATS.hireRequests > 0 && (
                <View style={styles.notificationBadge}>
                  <Text style={styles.notificationText}>{STATS.hireRequests}</Text>
                </View>
              )}
            </View>
            <Text style={styles.quickAccessLabel}>Hire Requests</Text>
            <Text style={styles.quickAccessValue}>{STATS.hireRequests}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.quickAccessCard}>
            <View style={styles.quickAccessIconContainer}>
              <Ionicons name="document-text-outline" size={24} color="#3498DB" />
            </View>
            <Text style={styles.quickAccessLabel}>Jobs Applied</Text>
            <Text style={styles.quickAccessValue}>{STATS.jobsApplied} Applied</Text>
          </TouchableOpacity>
        </Animated.View>
        
        {/* View All Link */}
        <Animated.View 
          entering={FadeInDown.delay(600).duration(600)}
          style={styles.viewAllContainer}
        >
          <TouchableOpacity 
            onPress={() => router.push('/dashboard/job-listings')}
            style={styles.viewAllButton}
          >
            <Text style={styles.viewAllText}>View All</Text>
            <Ionicons name="chevron-forward" size={16} color="#3498DB" />
          </TouchableOpacity>
        </Animated.View>

        {/* Suggested Jobs Section */}
        <Animated.View 
          entering={FadeInDown.delay(700).duration(600)}
          style={styles.section}
        >
          <Text style={styles.sectionTitle}>Suggested Jobs</Text>
          
          {SUGGESTED_JOBS.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="document-outline" size={48} color="#636E72" />
              <Text style={styles.emptyStateText}>No data found</Text>
              <Text style={styles.emptyStateTip}>Complete your profile to get more jobs!</Text>
            </View>
          ) : (
            SUGGESTED_JOBS.map((job, index) => (
              <Animated.View
                key={job.id}
                entering={FadeInDown.delay(800 + index * 100).duration(600)}
                style={styles.jobCard}
              >
                <View style={styles.jobCardContent}>
                  <Image source={{ uri: job.logo }} style={styles.companyLogo} />
                  <View style={styles.jobInfo}>
                    <View style={styles.jobHeader}>
                      <Text style={styles.jobTitle}>{job.title}</Text>
                      <View style={styles.jobTypeBadge}>
                        <Text style={styles.jobTypeText}>{job.type}</Text>
                      </View>
                    </View>
                    <Text style={styles.companyName}>{job.company}</Text>
                    <View style={styles.jobMeta}>
                      <View style={styles.metaItem}>
                        <Ionicons name="location-outline" size={14} color="#636E72" />
                        <Text style={styles.metaText}>{job.location}</Text>
                      </View>
                      <View style={styles.metaItem}>
                        <Ionicons name="time-outline" size={14} color="#636E72" />
                        <Text style={styles.metaText}>{job.postedDate}</Text>
                      </View>
                    </View>
                    <Text style={styles.hourlyRate}>{job.hourlyRate}</Text>
                  </View>
                </View>
                <TouchableOpacity 
                  style={styles.applyButton}
                  onPress={() => handleApplyNow(job.id)}
                  disabled={applyingJob === job.id}
                >
                  {applyingJob === job.id ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <Text style={styles.applyButtonText}>Apply Now</Text>
                  )}
                </TouchableOpacity>
              </Animated.View>
            ))
          )}
        </Animated.View>
      </Animated.ScrollView>
      
      <BottomNavigation />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  headerGradient: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: 24,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1A1A1A',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: '#666666',
    marginTop: 6,
    letterSpacing: 0.2,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 0,
  },
  searchContainer: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    height: 52,
    paddingHorizontal: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F1F3F5',
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    color: '#1A1A1A',
    fontSize: 16,
    letterSpacing: 0.2,
  },
  clearButton: {
    padding: 4,
  },
  balanceCardContainer: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  balanceCard: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  balanceGradient: {
    padding: 24,
    backgroundColor: '#1A1A1A',
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  balanceLabel: {
    fontSize: 15,
    color: '#FFFFFF',
    opacity: 0.9,
    letterSpacing: 0.3,
  },
  balanceExpandIcon: {
    transform: [{ rotate: '0deg' }],
  },
  balanceExpandIconRotated: {
    transform: [{ rotate: '180deg' }],
  },
  balanceValue: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
    letterSpacing: -0.5,
  },
  balanceBreakdown: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.15)',
    paddingTop: 20,
  },
  breakdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  breakdownLabel: {
    fontSize: 15,
    color: '#FFFFFF',
    opacity: 0.9,
    letterSpacing: 0.2,
  },
  breakdownValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  quickAccessContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  quickAccessCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginHorizontal: 6,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F1F3F5',
  },
  quickAccessIconContainer: {
    position: 'relative',
    marginBottom: 16,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#FF3B30',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#FF3B30',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  notificationText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
  quickAccessLabel: {
    fontSize: 13,
    color: '#666666',
    marginBottom: 6,
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  quickAccessValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  viewAllContainer: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingVertical: 8,
  },
  viewAllText: {
    fontSize: 15,
    color: '#1A1A1A',
    fontWeight: '600',
    marginRight: 6,
    letterSpacing: 0.2,
  },
  section: {
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 20,
    letterSpacing: -0.5,
  },
  jobCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    padding: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F1F3F5',
  },
  jobCardContent: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  companyLogo: {
    width: 56,
    height: 56,
    borderRadius: 12,
    marginRight: 16,
    backgroundColor: '#F8F9FA',
  },
  jobInfo: {
    flex: 1,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  jobTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1A1A1A',
    flex: 1,
    letterSpacing: -0.3,
  },
  jobTypeBadge: {
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    marginLeft: 10,
  },
  jobTypeText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#1A1A1A',
    letterSpacing: 0.2,
  },
  companyName: {
    fontSize: 15,
    color: '#666666',
    marginBottom: 10,
    letterSpacing: 0.2,
  },
  jobMeta: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 10,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 13,
    color: '#666666',
    marginLeft: 6,
    letterSpacing: 0.2,
  },
  hourlyRate: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    letterSpacing: -0.3,
  },
  applyButton: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  applyButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 15,
    letterSpacing: 0.3,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    marginTop: 8,
  },
  emptyStateText: {
    fontSize: 17,
    color: '#666666',
    marginTop: 16,
    letterSpacing: 0.2,
  },
  emptyStateTip: {
    fontSize: 15,
    color: '#1A1A1A',
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 32,
    letterSpacing: 0.2,
  },
});