import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
  ImageBackground,
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
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.statsSection}>
          <View style={styles.statCard}>
            <LinearGradient
              colors={['#4F78FF', '#558BFF']}
              style={styles.statCardGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <View>
                <Text style={styles.statTitle}>Active Jobs</Text>
                <Text style={styles.statValue}>{activeJobs.length}</Text>
              </View>
              <Ionicons name="briefcase" size={32} color="rgba(255,255,255,0.3)" />
            </LinearGradient>
          </View>
          
          <View style={styles.statCard}>
            <LinearGradient
              colors={['#4F78FF', '#558BFF']}
              style={styles.statCardGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <View>
                <Text style={styles.statTitle}>New Applicants</Text>
                <Text style={styles.statValue}>{applicants.filter(a => a.status === 'applied').length}</Text>
              </View>
              <Ionicons name="people" size={32} color="rgba(255,255,255,0.3)" />
            </LinearGradient>
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
                <Image source={{ uri: applicant.avatar }} style={styles.applicantAvatar} />
                <Text style={styles.applicantName}>{applicant.name}</Text>
                <Text style={styles.applicantPosition}>{applicant.position}</Text>
                
                <View style={styles.applicantMeta}>
                  <View style={styles.ratingContainer}>
                    <Ionicons name="star" size={12} color="#FFC107" />
                    <Text style={styles.ratingText}>{applicant.rating}</Text>
                  </View>
                  <Text style={styles.divider}>•</Text>
                  <Text style={styles.jobsCompleted}>{applicant.jobsCompleted} jobs</Text>
                </View>
                
                <View style={[
                  styles.statusBadge, 
                  applicant.status === 'applied' ? styles.appliedBadge :
                  applicant.status === 'shortlisted' ? styles.shortlistedBadge : 
                  styles.hiredBadge
                ]}>
                  <Text style={styles.statusText}>
                    {applicant.status.charAt(0).toUpperCase() + applicant.status.slice(1)}
                  </Text>
                </View>
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
                  <Text style={styles.jobTitle}>{job.title}</Text>
                  <Text style={styles.jobRate}>{job.rate}</Text>
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
                  <Ionicons name="people-outline" size={16} color="#767676" />
                  <Text style={styles.applicantsCount}>{job.applicantsCount} Applicants</Text>
                  <Text style={styles.viewButtonText}>View Applicants</Text>
                  <Ionicons name="chevron-forward" size={16} color="#4F78FF" />
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
            <Ionicons name="home" size={24} color="#4F78FF" />
            <Text style={styles.tabBarText}>Home</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.tabBarItem}
            onPress={() => router.push({pathname: '/dashboard/jobs/manage'} as any)}
          >
            <Ionicons name="briefcase-outline" size={24} color="#767676" />
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
            <Ionicons name="chatbubble-outline" size={24} color="#767676" />
            <Text style={styles.tabBarTextInactive}>Chats</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.tabBarItem}
            onPress={() => router.push({pathname: '/dashboard/profile'} as any)}
          >
            <Ionicons name="person-outline" size={24} color="#767676" />
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  logoContainer: {
    width: 36,
    height: 36,
    backgroundColor: '#4F78FF',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
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
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    marginHorizontal: 5,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#4F78FF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statCardGradient: {
    padding: 16,
    height: 90,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statTitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
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
    width: 170,
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
  applicantAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 12,
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
  applicantMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
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
    fontSize: 12,
    fontWeight: '600',
    color: '#4F78FF',
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
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  applicantsCount: {
    fontSize: 14,
    color: '#767676',
    marginLeft: 8,
    flex: 1,
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
    width: 60,
    height: 60,
    borderRadius: 30,
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