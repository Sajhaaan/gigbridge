import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  StatusBar,
  RefreshControl,
  TextInput,
  Dimensions,
  ActivityIndicator,
  Platform,
  useColorScheme,
  Animated,
} from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../providers/AuthContext';
import { BlurView } from 'expo-blur';
import { MotiView } from 'moti';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BottomNavigation from '../components/BottomNavigation';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Professional color palette
const COLORS = {
  primary: '#0A1A2F', // Deep navy blue
  secondary: '#4F78FF', // Bright blue
  accent: '#2ECC71', // Emerald
  background: '#F8F9FA', // Soft gray
  text: '#2D3436',
  textSecondary: '#6C757D',
  overlay: 'rgba(255, 255, 255, 0.9)', // More opaque white
  success: '#2ECC71', // Emerald
  warning: '#FF6B6B', // Coral red
  verified: '#2ECC71', // Emerald
  card: '#FFFFFF', // Pure white for cards
  cardShadow: 'rgba(0, 0, 0, 0.05)', // Subtle shadow
  gradient: ['#4F78FF', '#2ECC71'], // Blue to Emerald gradient
  highlight: '#4F78FF', // Bright blue for highlights
  danger: '#FF4757', // Professional red for warnings
  info: '#3498DB', // Professional blue for info
};

const STATS = [
  { 
    id: 1, 
    value: '₹0.00', 
    label: 'Balance', 
    icon: 'wallet', 
    color: COLORS.primary,
    goal: '₹5,000/₹10k',
    goalLabel: 'Weekly Goal'
  },
  { 
    id: 2, 
    value: '0', 
    label: 'Upcoming', 
    icon: 'calendar-alt', 
    color: COLORS.accent 
  },
  { 
    id: 3, 
    value: '2', 
    label: 'Requests', 
    icon: 'handshake', 
    color: COLORS.secondary 
  },
];

type QuickFilter = {
  id: number;
  title: string;
  icon: 'sunny-outline' | 'moon-outline' | 'flash-outline' | 'navigate-outline';
  color: string;
};

const QUICK_FILTERS: QuickFilter[] = [
  { id: 1, title: 'Morning', icon: 'sunny-outline', color: COLORS.primary },
  { id: 2, title: 'Night', icon: 'moon-outline', color: COLORS.primary },
  { id: 3, title: 'Urgent', icon: 'flash-outline', color: COLORS.warning },
  { id: 4, title: 'Nearest', icon: 'navigate-outline', color: COLORS.primary },
];

const SUGGESTED_JOBS = [
  {
    id: '1',
    title: 'Warehouse Associate',
    location: 'Mumbai',
    distance: '1.2km',
    hourlyRate: '₹250/hr',
    totalPay: '₹1,000',
    company: 'LogiCorp',
    postedDate: '2h ago',
    type: 'Full-time',
    urgency: 'urgent',
    category: 'warehouse',
    rating: 4.8,
    reviews: 12,
    slots: { filled: 3, total: 5 },
    verified: true,
    escrow: true,
    transport: true,
    shift: { day: 'Tue', time: '2pm-6pm', duration: '4h' }
  },
  {
    id: '2',
    title: 'Office Assistant',
    location: 'Delhi',
    distance: '3.5km',
    hourlyRate: '₹300/hr',
    totalPay: '₹1,200',
    company: 'AdminPro',
    postedDate: '5h ago',
    type: 'Part-time',
    urgency: 'flexible',
    category: 'office',
    rating: 4.5,
    reviews: 8,
    slots: { filled: 2, total: 3 },
    verified: true,
    escrow: true,
    transport: false,
    shift: { day: 'Wed', time: '10am-2pm', duration: '4h' }
  },
  {
    id: '3',
    title: 'Delivery Driver',
    location: 'Bangalore',
    distance: '2.1km',
    hourlyRate: '₹280/hr',
    totalPay: '₹1,120',
    company: 'QuickDeliver',
    postedDate: '1d ago',
    type: 'Full-time',
    urgency: 'urgent',
    category: 'delivery',
    rating: 4.7,
    reviews: 15,
    slots: { filled: 4, total: 5 },
    verified: true,
    escrow: true,
    transport: true,
    shift: { day: 'Thu', time: '9am-5pm', duration: '8h' }
  }
];

export default function WorkerDashboard() {
  const router = useRouter();
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);
  const [applyingJob, setApplyingJob] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const colorScheme = useColorScheme();
  
  const scrollY = new Animated.Value(0);
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.8],
    extrapolate: 'clamp',
  });

  const handleApplyNow = (jobId: string) => {
    setApplyingJob(jobId);
    setTimeout(() => setApplyingJob(null), 1500);
  };

  const getJobCardStyle = (job: any) => {
    const baseStyle = {
      backgroundColor: COLORS.card,
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
      overflow: 'hidden' as const,
      shadowColor: COLORS.cardShadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 4,
    };

    if (job.urgency === 'urgent') {
      return {
        ...baseStyle,
        borderLeftWidth: 4,
        borderLeftColor: COLORS.warning,
      };
    }

    return baseStyle;
  };

  return (
    <View style={[styles.container, { backgroundColor: COLORS.background }]}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <Animated.View style={[styles.header, { opacity: headerOpacity }]}>
        <BlurView intensity={20} tint="light" style={styles.headerBlur}>
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.userName}>
                Welcome, {user?.fullName?.split(' ')[0] || 'User'}!
              </Text>
              <Text style={styles.subtitle}>Find your next opportunity</Text>
            </View>
            <TouchableOpacity 
              style={styles.profileButton}
              onPress={() => router.push('/dashboard/profile')}
            >
              <BlurView intensity={20} tint="light" style={styles.profileBlur}>
                <Image 
                  source={{ uri: 'https://ui-avatars.com/api/?name=User&background=random' }}
                  style={styles.profileImage}
                />
              </BlurView>
            </TouchableOpacity>
          </View>
        </BlurView>
      </Animated.View>
      
      {/* Main Content */}
      <Animated.ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 90 } 
        ]}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => {}} />
        }
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <LinearGradient
            colors={[COLORS.primary, '#1A2A3F']}
            style={styles.balanceGradient}
          >
            <View style={styles.balanceContent}>
              <Text style={styles.balanceLabel}>Your Balance</Text>
              <Text style={styles.balanceValue}>₹0.00</Text>
              <View style={styles.goalContainer}>
                <Text style={styles.goalLabel}>Weekly Goal</Text>
                <Text style={styles.goalValue}>₹5,000/₹10k</Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <BlurView intensity={20} tint="light" style={styles.searchBar}>
            <Ionicons name="search" size={20} color={COLORS.textSecondary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search jobs, roles, or locations..."
              placeholderTextColor={COLORS.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </BlurView>
        </View>

        {/* Quick Filters */}
        <View style={styles.filtersContainer}>
          <Text style={styles.filtersTitle}>Quick Filters</Text>
          <View style={styles.filtersGrid}>
            {QUICK_FILTERS.map((filter, index) => (
              <MotiView
                key={filter.id}
                from={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 100 }}
                style={styles.filterButton}
              >
                <TouchableOpacity style={styles.filterContent}>
                  <Ionicons name={filter.icon} size={20} color={filter.color} />
                  <Text style={styles.filterText}>{filter.title}</Text>
                </TouchableOpacity>
              </MotiView>
            ))}
          </View>
        </View>

        {/* Stats Overview */}
        <View style={styles.statsContainer}>
          {STATS.map((stat, index) => (
            <MotiView
              key={stat.id}
              from={{ opacity: 0, translateY: 10 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ delay: index * 100 }}
              style={styles.statCard}
            >
              <BlurView intensity={20} tint="light" style={styles.statBlur}>
                <View style={[styles.statIconContainer, { backgroundColor: stat.color + '20' }]}>
                  <FontAwesome5 name={stat.icon} size={16} color={stat.color} />
                </View>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
                {stat.goal && (
                  <View style={styles.goalContainer}>
                    <Text style={styles.goalLabel}>{stat.goalLabel}</Text>
                    <Text style={styles.goalValue}>{stat.goal}</Text>
                  </View>
                )}
              </BlurView>
            </MotiView>
          ))}
        </View>

        {/* Suggested Jobs */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Suggested Jobs</Text>
            <TouchableOpacity onPress={() => router.push('/dashboard/job-listings')}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          
          {SUGGESTED_JOBS.map((job, index) => (
            <MotiView
              key={job.id}
              from={{ opacity: 0, translateY: 10 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ delay: index * 100 }}
              style={getJobCardStyle(job)}
            >
              <TouchableOpacity 
                onPress={() => router.push({
                  pathname: '/dashboard/job-details',
                  params: { job: JSON.stringify(job) }
                })}
              >
                <BlurView intensity={20} tint="light" style={styles.jobCardBlur}>
                  {job.urgency === 'urgent' && (
                    <View style={styles.urgentBadge}>
                      <Ionicons name="flash" size={12} color={COLORS.warning} />
                      <Text style={styles.urgentText}>URGENT HIRING</Text>
                    </View>
                  )}
                  
                  <View style={styles.jobHeader}>
                    <View>
                      <Text style={styles.jobTitle}>{job.title}</Text>
                      <View style={styles.ratingContainer}>
                        <Ionicons name="star" size={12} color={COLORS.warning} />
                        <Text style={styles.ratingText}>{job.rating} ({job.reviews} reviews)</Text>
                      </View>
                    </View>
                    {job.verified && (
                      <View style={styles.verifiedBadge}>
                        <Ionicons name="checkmark-circle" size={16} color={COLORS.success} />
                        <Text style={styles.verifiedText}>Verified</Text>
                      </View>
                    )}
                  </View>
                  
                  <View style={styles.jobMeta}>
                    <View style={styles.metaItem}>
                      <Ionicons name="location-outline" size={14} color={COLORS.textSecondary} />
                      <Text style={styles.metaText}>{job.company} • {job.distance} from you</Text>
                    </View>
                    <View style={styles.metaItem}>
                      <Ionicons name="time-outline" size={14} color={COLORS.textSecondary} />
                      <Text style={styles.metaText}>{job.shift.day}, {job.shift.time} ({job.shift.duration})</Text>
                    </View>
                  </View>

                  <View style={styles.jobDetails}>
                    <View style={styles.detailRow}>
                      <Text style={styles.totalPay}>💸 {job.totalPay} total</Text>
                      {job.escrow && (
                        <View style={styles.escrowBadge}>
                          <Ionicons name="lock-closed" size={12} color={COLORS.success} />
                          <Text style={styles.escrowText}>Escrow</Text>
                        </View>
                      )}
                    </View>
                    {job.transport && (
                      <View style={styles.transportBadge}>
                        <Ionicons name="car" size={12} color={COLORS.success} />
                        <Text style={styles.transportText}>Transport Provided</Text>
                      </View>
                    )}
                    <View style={styles.slotsContainer}>
                      <Text style={styles.slotsText}>
                        🎯 {job.slots.filled}/{job.slots.total} slots filled
                      </Text>
                      <Text style={styles.applyTimeText}>Apply in 15:00 ⏳</Text>
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
                </BlurView>
              </TouchableOpacity>
            </MotiView>
          ))}
        </View>
      </Animated.ScrollView>
      
      <BottomNavigation />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  headerBlur: {
    paddingTop: Platform.OS === 'ios' ? 50 : 40,
    paddingBottom: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  userName: {
    fontSize: 24,
    fontWeight: '600',
    color: COLORS.text,
    fontFamily: 'Inter-SemiBold',
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
    fontFamily: 'SFProText-Regular',
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
  },
  profileBlur: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: Platform.OS === 'ios' ? 120 : 100,
  },
  balanceCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
  },
  balanceGradient: {
    padding: 20,
  },
  balanceContent: {
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: 14,
    color: '#FFFFFF80',
    fontFamily: 'SFProText-Regular',
  },
  balanceValue: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    marginVertical: 8,
    fontFamily: 'Inter-SemiBold',
  },
  goalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  goalLabel: {
    fontSize: 12,
    color: '#FFFFFF80',
    marginRight: 8,
    fontFamily: 'SFProText-Regular',
  },
  goalValue: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
    fontFamily: 'SFProText-Medium',
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    height: 46,
    paddingHorizontal: 16,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 15,
    color: COLORS.text,
    fontFamily: 'SFProText-Regular',
  },
  filtersContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  filtersTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 12,
    fontFamily: 'Inter-SemiBold',
  },
  filtersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  filterButton: {
    width: (SCREEN_WIDTH - 60) / 2,
  },
  filterContent: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.overlay,
    padding: 12,
    borderRadius: 12,
  },
  filterText: {
    marginLeft: 8,
    fontSize: 14,
    color: COLORS.text,
    fontFamily: 'SFProText-Regular',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    borderRadius: 16,
    marginHorizontal: 4,
    overflow: 'hidden',
  },
  statBlur: {
    padding: 12,
    alignItems: 'center',
  },
  statIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 4,
    fontFamily: 'Inter-SemiBold',
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontFamily: 'SFProText-Regular',
  },
  section: {
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    fontFamily: 'Inter-SemiBold',
  },
  viewAllText: {
    fontSize: 14,
    color: COLORS.secondary,
    fontWeight: '600',
    fontFamily: 'SFProText-Medium',
  },
  jobCardBlur: {
    padding: 16,
    backgroundColor: COLORS.card,
  },
  urgentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.danger + '15',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 12,
    alignSelf: 'flex-start',
  },
  urgentText: {
    fontSize: 12,
    color: COLORS.warning,
    marginLeft: 4,
    fontWeight: '600',
    fontFamily: 'SFProText-Medium',
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: 4,
    fontFamily: 'Inter-SemiBold',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginLeft: 4,
    fontFamily: 'SFProText-Regular',
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.verified + '15',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  verifiedText: {
    fontSize: 12,
    color: COLORS.success,
    marginLeft: 4,
    fontWeight: '600',
    fontFamily: 'SFProText-Medium',
  },
  jobMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginLeft: 4,
    fontFamily: 'SFProText-Regular',
  },
  jobDetails: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  totalPay: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    fontFamily: 'SFProText-Medium',
  },
  escrowBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.verified + '15',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  escrowText: {
    fontSize: 12,
    color: COLORS.success,
    marginLeft: 4,
    fontFamily: 'SFProText-Regular',
  },
  transportBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.verified + '15',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  transportText: {
    fontSize: 12,
    color: COLORS.success,
    marginLeft: 4,
    fontFamily: 'SFProText-Regular',
  },
  slotsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  slotsText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontFamily: 'SFProText-Regular',
  },
  applyTimeText: {
    fontSize: 12,
    color: COLORS.warning,
    fontFamily: 'SFProText-Regular',
  },
  applyButton: {
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: COLORS.secondary,
    shadowColor: COLORS.secondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  applyButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
    fontFamily: 'SFProText-Medium',
  },
});