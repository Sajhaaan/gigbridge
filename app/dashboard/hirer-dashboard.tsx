import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useAuth } from '../providers/AuthContext';

export default function HirerDashboard() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('Active');
  
  // Mock data
  const applicants = [
    {
      id: '1',
      name: 'John Smith',
      position: 'Bartender',
      location: 'San Francisco, CA',
      avatar: 'https://ui-avatars.com/api/?name=John+Smith&background=4F78FF&color=fff',
      rating: 4.8,
      jobsCompleted: 24,
      status: 'applied',
      timeAgo: '2 hours ago',
    },
    {
      id: '2',
      name: 'Emma Wilson',
      position: 'Event Staff',
      location: 'Oakland, CA',
      avatar: 'https://ui-avatars.com/api/?name=Emma+Wilson&background=4F78FF&color=fff',
      rating: 4.6,
      jobsCompleted: 18,
      status: 'shortlisted',
      timeAgo: '5 hours ago',
    },
    {
      id: '3',
      name: 'Michael Brown',
      position: 'Restaurant Server',
      location: 'San Francisco, CA',
      avatar: 'https://ui-avatars.com/api/?name=Michael+Brown&background=4F78FF&color=fff',
      rating: 4.9,
      jobsCompleted: 32,
      status: 'hired',
      timeAgo: '1 day ago',
    },
  ];
  
  // Mock active jobs
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
    },
  ];
  
  // Mock past jobs
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
    },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.headerContainer}>
        <LinearGradient
          colors={['#f8f9ff', '#ffffff']}
          style={styles.headerGradient}
        >
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Text style={styles.logoText}>G</Text>
            </View>
            
            <Text style={styles.greeting}>Hello, {user?.fullName?.split(' ')[0] || 'Business'}</Text>
            
            <TouchableOpacity 
              style={styles.profileButton}
              onPress={() => router.push({pathname: '/dashboard/profile'} as any)}
            >
              <Image 
                source={{ uri: `https://ui-avatars.com/api/?name=${user?.fullName || 'Business'}&background=4F78FF&color=fff` }} 
                style={styles.profileImage} 
              />
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Welcome Card */}
        <View style={styles.welcomeCardContainer}>
          <LinearGradient
            colors={['#4F78FF', '#558BFF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.welcomeGradient}
          >
            <View style={styles.welcomeContent}>
              <Text style={styles.welcomeText}>Grow your business</Text>
              <Text style={styles.welcomeSubtext}>Find reliable staff for your needs</Text>
              
              <TouchableOpacity 
                style={styles.postNowButton}
                onPress={() => router.push({pathname: '/dashboard/jobs/post'} as any)}
              >
                <Text style={styles.postNowButtonText}>Post a Job Now</Text>
                <Ionicons name="arrow-forward" size={16} color="#4F78FF" />
              </TouchableOpacity>
            </View>
            <View style={styles.welcomeImageContainer}>
              <Ionicons name="business" size={60} color="rgba(255,255,255,0.3)" />
            </View>
          </LinearGradient>
        </View>
        
        {/* Stats Section */}
        <View style={styles.statsSection}>
          <View style={styles.statCard}>
            <View style={styles.statCardContent}>
              <View>
                <Text style={styles.statTitle}>Active Jobs</Text>
                <Text style={styles.statValue}>{activeJobs.length}</Text>
              </View>
              <Ionicons name="briefcase" size={32} color="#4F78FF" />
            </View>
          </View>
          
          <View style={styles.statCard}>
            <View style={styles.statCardContent}>
              <View>
                <Text style={styles.statTitle}>New Applicants</Text>
                <Text style={styles.statValue}>{applicants.filter(a => a.status === 'applied').length}</Text>
              </View>
              <Ionicons name="people" size={32} color="#4F78FF" />
            </View>
          </View>
        </View>
        
        <TouchableOpacity 
          style={styles.postJobButton}
          onPress={() => router.push({pathname: '/dashboard/jobs/post'} as any)}
        >
          <Ionicons name="add-circle" size={24} color="#fff" style={styles.postJobIcon} />
          <Text style={styles.postJobText}>Post a New Job</Text>
        </TouchableOpacity>
        
        <View style={styles.recentApplications}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Applications</Text>
            <TouchableOpacity onPress={() => router.push({pathname: '/dashboard/applications'} as any)}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.applicantsScroll}>
            {applicants.map((applicant) => (
              <TouchableOpacity 
                key={applicant.id} 
                style={styles.applicantCard}
                onPress={() => router.push({pathname: `/dashboard/applicants/${applicant.id}`} as any)}
              >
                <View style={styles.applicantCardHeader}>
                  <Image source={{ uri: applicant.avatar }} style={styles.applicantAvatar} />
                  <View style={[
                    styles.statusBadge, 
                    applicant.status === 'applied' ? styles.appliedBadge :
                    applicant.status === 'shortlisted' ? styles.shortlistedBadge : 
                    styles.hiredBadge
                  ]}>
                    <Text style={[
                      styles.statusText,
                      applicant.status === 'applied' ? styles.appliedText :
                      applicant.status === 'shortlisted' ? styles.shortlistedText : 
                      styles.hiredText
                    ]}>
                      {applicant.status.charAt(0).toUpperCase() + applicant.status.slice(1)}
                    </Text>
                  </View>
                </View>

                <Text style={styles.applicantName}>{applicant.name}</Text>
                <Text style={styles.applicantPosition}>{applicant.position}</Text>
                
                <View style={styles.applicantLocation}>
                  <Ionicons name="location-outline" size={14} color="#767676" />
                  <Text style={styles.locationText}>{applicant.location}</Text>
                </View>
                
                <View style={styles.applicantMeta}>
                  <View style={styles.ratingContainer}>
                    <Ionicons name="star" size={12} color="#FFC107" />
                    <Text style={styles.ratingText}>{applicant.rating}</Text>
                  </View>
                  <Text style={styles.divider}>•</Text>
                  <Text style={styles.jobsCompleted}>{applicant.jobsCompleted} jobs</Text>
                </View>
                
                <View style={styles.timeAgoContainer}>
                  <Ionicons name="time-outline" size={12} color="#767676" />
                  <Text style={styles.timeAgoText}>{applicant.timeAgo}</Text>
                </View>
                
                <TouchableOpacity style={styles.viewProfileButton}>
                  <Text style={styles.viewProfileText}>View Profile</Text>
                  <Ionicons name="chevron-forward" size={12} color="#4F78FF" />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        
        <View style={styles.jobsSection}>
          <View style={styles.tabHeader}>
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'Active' && styles.activeTab]} 
              onPress={() => setActiveTab('Active')}
            >
              <Text style={[styles.tabText, activeTab === 'Active' && styles.activeTabText]}>
                Active Jobs
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'Past' && styles.activeTab]} 
              onPress={() => setActiveTab('Past')}
            >
              <Text style={[styles.tabText, activeTab === 'Past' && styles.activeTabText]}>
                Past Jobs
              </Text>
            </TouchableOpacity>
            <View style={styles.spacer} />
            <TouchableOpacity onPress={() => router.push({pathname: '/dashboard/jobs/manage'} as any)}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.jobsList}>
            {(activeTab === 'Active' ? activeJobs : pastJobs).map((job) => (
              <TouchableOpacity 
                key={job.id} 
                style={styles.jobCard}
                onPress={() => router.push({pathname: `/dashboard/jobs/${job.id}/applicants`} as any)}
              >
                <View style={styles.jobHeader}>
                  <View style={styles.jobTitleContainer}>
                    <Text style={styles.jobTitle}>{job.title}</Text>
                    <Text style={styles.jobRate}>{job.rate}</Text>
                  </View>
                </View>
                
                <View style={styles.jobDetails}>
                  <View style={styles.jobDetail}>
                    <Ionicons name="location-outline" size={16} color="#767676" />
                    <Text style={styles.jobDetailText}>{job.location}</Text>
                  </View>
                  
                  <View style={styles.jobDetail}>
                    <Ionicons name="calendar-outline" size={16} color="#767676" />
                    <Text style={styles.jobDetailText}>{job.date}</Text>
                  </View>
                  
                  <View style={styles.jobDetail}>
                    <Ionicons name="time-outline" size={16} color="#767676" />
                    <Text style={styles.jobDetailText}>{job.time}</Text>
                  </View>
                </View>
                
                <View style={styles.applicantsInfo}>
                  <View style={styles.applicantsCountContainer}>
                    <Ionicons name="people-outline" size={16} color="#767676" />
                    <Text style={styles.applicantsCount}>{job.applicantsCount} Applicants</Text>
                  </View>
                  <TouchableOpacity style={styles.viewButtonContainer}>
                    <Text style={styles.viewButtonText}>View Applicants</Text>
                    <Ionicons name="chevron-forward" size={16} color="#4F78FF" />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        <View style={{ height: 100 }} />
      </ScrollView>
      
      <View style={[styles.tabBarContainer, { paddingBottom: insets.bottom }]}>
        <View style={styles.tabBar}>
          <TouchableOpacity 
            style={styles.tabBarItem} 
            onPress={() => router.replace('/dashboard/hirer-dashboard')}
          >
            <View style={styles.activeIndicator} />
            <View style={styles.tabBarIconContainer}>
              <Ionicons name="home" size={22} color="#4F78FF" />
            </View>
            <Text style={styles.tabBarText}>Home</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.tabBarItem}
            onPress={() => router.push({pathname: '/dashboard/jobs/manage'} as any)}
          >
            <View style={styles.inactiveIndicator} />
            <View style={styles.tabBarIconContainer}>
              <Ionicons name="briefcase-outline" size={22} color="#767676" />
            </View>
            <Text style={styles.tabBarTextInactive}>Jobs</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.chatButton}
            onPress={() => router.push({pathname: '/dashboard/jobs/post'} as any)}
          >
            <View style={styles.chatButtonInner}>
              <Ionicons name="add" size={32} color="#fff" />
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.tabBarItem}
            onPress={() => router.push('/dashboard/messages')}
          >
            <View style={styles.inactiveIndicator} />
            <View style={styles.tabBarIconContainer}>
              <Ionicons name="chatbubble-outline" size={22} color="#767676" />
            </View>
            <Text style={styles.tabBarTextInactive}>Chats</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.tabBarItem}
            onPress={() => router.push({pathname: '/dashboard/profile'} as any)}
          >
            <View style={styles.inactiveIndicator} />
            <View style={styles.tabBarIconContainer}>
              <Ionicons name="person-outline" size={22} color="#767676" />
            </View>
            <Text style={styles.tabBarTextInactive}>Profile</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  headerContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    overflow: 'hidden',
  },
  headerGradient: {
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  logoContainer: {
    width: 36,
    height: 36,
    backgroundColor: '#4F78FF',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4F78FF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  logoText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  greeting: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  profileButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(79, 120, 255, 0.2)',
  },
  profileImage: {
    width: 36,
    height: 36,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  welcomeCardContainer: {
    marginTop: 20,
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#4F78FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  welcomeGradient: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  welcomeContent: {
    flex: 2,
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  welcomeSubtext: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 16,
  },
  welcomeImageContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  postNowButton: {
    height: 36,
    backgroundColor: '#ffffff',
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
    alignSelf: 'flex-start',
  },
  postNowButtonText: {
    color: '#4F78FF',
    fontWeight: '600',
    marginRight: 5,
  },
  balanceCardContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  balanceCard: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#4F78FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  balanceGradient: {
    padding: 20,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  balanceLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  transferButton: {
    height: 36,
    backgroundColor: '#ffffff',
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
  },
  transferButtonText: {
    color: '#4F78FF',
    fontWeight: '600',
    marginRight: 5,
  },
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    marginHorizontal: 5,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  statCardContent: {
    padding: 16,
    height: 90,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statTitle: {
    fontSize: 14,
    color: '#767676',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  postJobButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4F78FF',
    borderRadius: 12,
    paddingVertical: 16,
    marginBottom: 24,
    shadowColor: '#4F78FF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  postJobIcon: {
    marginRight: 8,
  },
  postJobText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  recentApplications: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  viewAllText: {
    fontSize: 14,
    color: '#4F78FF',
    fontWeight: '600',
  },
  applicantsScroll: {
    marginLeft: -10,
    paddingLeft: 10,
  },
  applicantCard: {
    width: 190,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  applicantCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  applicantAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  applicantName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  applicantPosition: {
    fontSize: 14,
    color: '#767676',
    marginBottom: 8,
  },
  applicantLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationText: {
    fontSize: 12,
    color: '#767676',
    marginLeft: 4,
  },
  applicantMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  timeAgoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  timeAgoText: {
    fontSize: 12,
    color: '#767676',
    marginLeft: 4,
  },
  viewProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(79, 120, 255, 0.1)',
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  viewProfileText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4F78FF',
    marginRight: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 12,
    color: '#767676',
    marginLeft: 4,
  },
  divider: {
    marginHorizontal: 6,
    color: '#767676',
    fontSize: 12,
  },
  jobsCompleted: {
    fontSize: 12,
    color: '#767676',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  appliedBadge: {
    backgroundColor: 'rgba(79, 120, 255, 0.1)',
  },
  shortlistedBadge: {
    backgroundColor: 'rgba(255, 193, 7, 0.1)',
  },
  hiredBadge: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
  },
  appliedText: {
    color: '#4F78FF',
  },
  shortlistedText: {
    color: '#FFC107',
  },
  hiredText: {
    color: '#4CAF50',
  },
  jobsSection: {
    marginBottom: 20,
  },
  tabHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#F2F2F7',
    marginRight: 10,
  },
  activeTab: {
    backgroundColor: '#4F78FF',
  },
  tabText: {
    fontSize: 14,
    color: '#767676',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#fff',
  },
  spacer: {
    flex: 1,
  },
  jobsList: {},
  jobCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  jobTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    marginRight: 8,
  },
  jobRate: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4F78FF',
  },
  jobDetails: {
    marginBottom: 12,
  },
  jobDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  jobDetailText: {
    fontSize: 14,
    color: '#767676',
    marginLeft: 8,
  },
  applicantsInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  applicantsCountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  applicantsCount: {
    fontSize: 14,
    color: '#767676',
    marginLeft: 8,
  },
  viewButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4F78FF',
    marginRight: 4,
  },
  tabBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 5,
  },
  tabBar: {
    flexDirection: 'row',
    height: 60,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  tabBarItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    height: '100%',
    paddingTop: 8,
  },
  tabBarIconContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeIndicator: {
    position: 'absolute',
    top: 0,
    height: 3,
    width: 20,
    backgroundColor: '#4F78FF',
    borderRadius: 1.5,
  },
  inactiveIndicator: {
    position: 'absolute',
    top: 0,
    height: 3,
    width: 20,
    backgroundColor: 'transparent',
  },
  tabBarText: {
    fontSize: 10,
    color: '#4F78FF',
    fontWeight: '500',
    marginTop: 2,
  },
  tabBarTextInactive: {
    fontSize: 10,
    color: '#767676',
    marginTop: 2,
  },
  chatButton: {
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -20,
  },
  chatButtonInner: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#4F78FF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4F78FF',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
}); 