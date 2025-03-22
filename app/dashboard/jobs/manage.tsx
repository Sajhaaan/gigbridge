import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Platform,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeIn, interpolate, useAnimatedStyle, withSpring, useSharedValue, withTiming } from 'react-native-reanimated';
import { Stack } from 'expo-router';

export default function ManageJobsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('active');
  const tabAnimation = useSharedValue(0);

  const handleTabChange = (tab: 'active' | 'past') => {
    setActiveTab(tab);
    tabAnimation.value = withSpring(tab === 'active' ? 0 : 1);
  };

  const indicatorStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      tabAnimation.value,
      [0, 1],
      [0, 100]
    );

    return {
      transform: [{ translateX: `${translateX}%` }],
    };
  });

  // Mock data
  const activeJobs = [
    {
      id: '1',
      title: 'Bartender Needed',
      location: 'San Francisco, CA',
      date: 'Saturday, June 25',
      time: '6:00 PM - 11:00 PM',
      applicantsCount: 12,
      status: 'active',
      rate: 'AED 25/hr',
      applicants: {
        total: 12,
        new: 3,
        shortlisted: 4,
        hired: 2
      }
    },
    {
      id: '2',
      title: 'Event Staff for Corporate Party',
      location: 'Dubai Marina',
      date: 'Friday, June 24',
      time: '4:00 PM - 10:00 PM',
      applicantsCount: 8,
      status: 'active',
      rate: 'AED 22/hr',
      applicants: {
        total: 8,
        new: 2,
        shortlisted: 3,
        hired: 1
      }
    },
  ];

  const pastJobs = [
    {
      id: '3',
      title: 'Restaurant Server',
      location: 'Downtown Dubai',
      date: 'Monday, June 20',
      time: '6:00 PM - 11:00 PM',
      applicantsCount: 15,
      status: 'completed',
      rate: 'AED 20/hr',
      applicants: {
        total: 15,
        new: 0,
        shortlisted: 5,
        hired: 3
      }
    },
    {
      id: '4',
      title: 'Catering Staff',
      location: 'Jumeirah Beach Hotel',
      date: 'Saturday, June 18',
      time: '3:00 PM - 9:00 PM',
      applicantsCount: 10,
      status: 'completed',
      rate: 'AED 22/hr',
      applicants: {
        total: 10,
        new: 0,
        shortlisted: 4,
        hired: 2
      }
    },
  ];

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={24} color="#4F78FF" />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Manage Jobs</Text>
          <Text style={styles.headerSubtitle}>
            {activeTab === 'active' ? '2 Active Jobs' : '2 Past Jobs'}
          </Text>
        </View>

        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => {}}
        >
          <LinearGradient
            colors={['#4F78FF', '#3B5FE3']}
            style={styles.filterGradient}
          >
            <Ionicons name="options-outline" size={20} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <View style={styles.tabsWrapper}>
        <Animated.View 
          entering={FadeIn}
          style={styles.tabsContainer}
        >
          <TouchableOpacity 
            style={[styles.tab]}
            onPress={() => handleTabChange('active')}
          >
            <Text style={[styles.tabText, activeTab === 'active' && styles.activeTabText]}>
              Active Jobs
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab]}
            onPress={() => handleTabChange('past')}
          >
            <Text style={[styles.tabText, activeTab === 'past' && styles.activeTabText]}>
              Past Jobs
            </Text>
          </TouchableOpacity>
          <Animated.View style={[styles.activeIndicator, indicatorStyle]} />
        </Animated.View>
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#4F78FF"
          />
        }
      >
        {(activeTab === 'active' ? activeJobs : pastJobs).map((job, index) => (
          <Animated.View
            key={job.id}
            entering={FadeInDown.delay(index * 100).springify()}
            style={styles.jobCard}
          >
            <TouchableOpacity
              onPress={() => router.push(`/dashboard/jobs/${job.id}/applicants` as any)}
              style={styles.jobCardContent}
            >
              <LinearGradient
                colors={['#F8FAFF', '#FFFFFF']}
                style={styles.cardGradient}
              >
                <View style={styles.jobHeader}>
                  <View style={styles.jobTitleContainer}>
                    <Text style={styles.jobTitle}>{job.title}</Text>
                    <Text style={styles.jobRate}>{job.rate}</Text>
                  </View>
                </View>

                <View style={styles.jobDetails}>
                  <View style={styles.jobDetail}>
                    <View style={styles.iconContainer}>
                      <Ionicons name="location-outline" size={18} color="#4F78FF" />
                    </View>
                    <Text style={styles.jobDetailText}>{job.location}</Text>
                  </View>

                  <View style={styles.jobDetail}>
                    <View style={styles.iconContainer}>
                      <Ionicons name="calendar-outline" size={18} color="#4F78FF" />
                    </View>
                    <Text style={styles.jobDetailText}>{job.date}</Text>
                  </View>

                  <View style={styles.jobDetail}>
                    <View style={styles.iconContainer}>
                      <Ionicons name="time-outline" size={18} color="#4F78FF" />
                    </View>
                    <Text style={styles.jobDetailText}>{job.time}</Text>
                  </View>
                </View>

                <View style={styles.applicantsStats}>
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>{job.applicants.total}</Text>
                    <Text style={styles.statLabel}>Total</Text>
                  </View>
                  <View style={styles.statDivider} />
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>{job.applicants.new}</Text>
                    <Text style={styles.statLabel}>New</Text>
                  </View>
                  <View style={styles.statDivider} />
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>{job.applicants.shortlisted}</Text>
                    <Text style={styles.statLabel}>Shortlisted</Text>
                  </View>
                  <View style={styles.statDivider} />
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>{job.applicants.hired}</Text>
                    <Text style={styles.statLabel}>Hired</Text>
                  </View>
                </View>

                <View style={styles.cardActions}>
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => router.push(`/dashboard/jobs/${job.id}/edit` as any)}
                  >
                    <Ionicons name="create-outline" size={20} color="#4F78FF" />
                    <Text style={styles.actionButtonText}>Edit</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => router.push(`/dashboard/jobs/${job.id}/applicants` as any)}
                  >
                    <Ionicons name="people-outline" size={20} color="#4F78FF" />
                    <Text style={styles.actionButtonText}>View Applicants</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={[styles.actionButton, job.status === 'completed' && styles.disabledButton]}
                    onPress={() => {}}
                    disabled={job.status === 'completed'}
                  >
                    <Ionicons name="share-outline" size={20} color={job.status === 'completed' ? '#9CA3AF' : '#4F78FF'} />
                    <Text style={[styles.actionButtonText, job.status === 'completed' && styles.disabledText]}>Share</Text>
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </ScrollView>

      <TouchableOpacity
        style={styles.fabButton}
        onPress={() => router.push('/dashboard/jobs/post' as any)}
      >
        <LinearGradient
          colors={['#4F78FF', '#3B5FE3']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.fabGradient}
        >
          <Ionicons name="add" size={24} color="#fff" />
          <Text style={styles.fabText}>Post New Job</Text>
        </LinearGradient>
      </TouchableOpacity>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: '#fff',
  },
  headerCenter: {
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 15,
    color: '#4B5563',
    fontWeight: '500',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F3FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
  },
  filterGradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabsWrapper: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#4F78FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    position: 'relative',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    position: 'relative',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 0,
    left: '25%',
    width: '50%',
    height: 3,
    backgroundColor: '#4F78FF',
    borderRadius: 1.5,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  activeTabText: {
    color: '#4F78FF',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  jobCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#4F78FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardGradient: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  jobCardContent: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  jobHeader: {
    padding: 16,
  },
  jobTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    flex: 1,
    marginRight: 8,
  },
  jobRate: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4F78FF',
    backgroundColor: '#F0F3FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  jobDetails: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  jobDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F0F3FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  jobDetailText: {
    fontSize: 14,
    color: '#4B5563',
    flex: 1,
  },
  applicantsStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8FAFF',
    padding: 16,
    marginHorizontal: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 8,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    padding: 16,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 8,
    backgroundColor: '#F0F3FF',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4F78FF',
    marginLeft: 4,
  },
  disabledButton: {
    backgroundColor: '#F3F4F6',
  },
  disabledText: {
    color: '#9CA3AF',
  },
  fabButton: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 40 : 24,
    right: 24,
    shadowColor: '#4F78FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    borderRadius: 28,
    overflow: 'hidden',
  },
  fabGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 28,
  },
  fabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 8,
  },
}); 