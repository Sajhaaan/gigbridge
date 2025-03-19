import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  logo: string;
  rate: string;
  date: string;
  postedAt: string;
  description: string;
  requirements: string[];
  tags: string[];
  rating: string;
  distance: string;
  isBookmarked: boolean;
}

interface JobsData {
  [key: string]: Job;
}

// Mock job data
const JOBS: JobsData = {
  '1': {
    id: '1',
    title: 'Restaurant Server',
    company: 'Fine Dining Co.',
    location: 'San Francisco, CA',
    logo: 'https://ui-avatars.com/api/?name=Fine+Dining&background=FF5858&color=fff',
    rate: '$20-25/hr',
    date: 'Today, 7:00 PM - 11:00 PM',
    postedAt: '2 days ago',
    description: 'We are looking for an experienced restaurant server to join our team at Fine Dining Co. The ideal candidate will provide exceptional customer service, take orders accurately, and ensure our guests have a great dining experience.',
    requirements: [
      'Previous serving experience (1+ years preferred)',
      'Knowledge of food and wine pairing',
      'Excellent communication and customer service skills',
      'Ability to work evenings and weekends',
      'Food handler\'s certificate is a plus'
    ],
    tags: ['Food Service', 'Evening Shift'],
    rating: '4.8',
    distance: '1.2 miles',
    isBookmarked: false,
  },
  '2': {
    id: '2',
    title: 'Event Staff',
    company: 'Events R Us',
    location: 'Oakland, CA',
    logo: 'https://ui-avatars.com/api/?name=Events+R+Us&background=5885FF&color=fff',
    rate: '$22/hr',
    date: 'Tomorrow, 10:00 AM - 6:00 PM',
    postedAt: '1 day ago',
    description: 'Join our team as event staff for various high-profile events in the Bay Area. Responsibilities include setup, guest check-in, assistance during the event, and cleanup. This is a great opportunity for those looking for flexible work and networking opportunities.',
    requirements: [
      'Customer service experience',
      'Ability to stand for long periods',
      'Professional appearance and demeanor',
      'Reliable transportation',
      'Available on weekends and evenings'
    ],
    tags: ['Events', 'Weekend'],
    rating: '4.5',
    distance: '3.7 miles',
    isBookmarked: true,
  },
  '3': {
    id: '3',
    title: 'Bartender',
    company: 'Nightlife Inc',
    location: 'San Francisco, CA',
    logo: 'https://ui-avatars.com/api/?name=Nightlife+Inc&background=58FFBE&color=fff',
    rate: '$25-30/hr + tips',
    date: 'Thu, Jun 24, 8:00 PM - 2:00 AM',
    postedAt: '3 days ago',
    description: 'Experienced bartender needed for upscale cocktail bar in downtown San Francisco. Must have knowledge of classic and contemporary cocktails, ability to work in a fast-paced environment, and excellent customer service skills.',
    requirements: [
      'Minimum 2 years bartending experience',
      'Knowledge of cocktail recipes and techniques',
      'Ability to work late nights and weekends',
      'Food handler\'s certificate',
      'Positive attitude and team player'
    ],
    tags: ['Nightlife', 'Evening Shift'],
    rating: '4.2',
    distance: '0.8 miles',
    isBookmarked: false,
  },
};

export default function JobDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [isBookmarked, setIsBookmarked] = useState(false);
  
  // Get job data based on ID
  const job = JOBS[id as string];
  
  if (!job) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.title}>Job Details</Text>
        </View>
        <View style={styles.notFoundContainer}>
          <Ionicons name="alert-circle-outline" size={80} color="#ccc" />
          <Text style={styles.notFoundText}>Job not found</Text>
        </View>
      </View>
    );
  }

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const handleApply = () => {
    Alert.alert(
      "Apply for Job",
      `Would you like to apply for the ${job.title} position at ${job.company}?`,
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Apply", 
          onPress: () => {
            Alert.alert("Application Submitted", "Your application has been submitted successfully!");
          }
        }
      ]
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.bookmarkButton} onPress={toggleBookmark}>
            <Ionicons 
              name={isBookmarked ? "bookmark" : "bookmark-outline"} 
              size={24} 
              color={isBookmarked ? "#007AFF" : "#333"} 
            />
          </TouchableOpacity>
        </View>

        <Animated.View 
          entering={FadeIn.duration(500)}
          style={styles.companyHeader}
        >
          <Image source={{ uri: job.logo }} style={styles.companyLogo} />
          <View style={styles.companyInfo}>
            <Text style={styles.jobTitle}>{job.title}</Text>
            <Text style={styles.companyName}>{job.company}</Text>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={14} color="#FFB400" />
              <Text style={styles.ratingText}>{job.rating}</Text>
            </View>
          </View>
        </Animated.View>

        <Animated.View 
          entering={FadeInDown.delay(200).duration(500)}
          style={styles.jobDetails}
        >
          <View style={styles.detailItem}>
            <View style={styles.detailIcon}>
              <Ionicons name="cash-outline" size={20} color="#007AFF" />
            </View>
            <View>
              <Text style={styles.detailLabel}>Pay Rate</Text>
              <Text style={styles.detailValue}>{job.rate}</Text>
            </View>
          </View>

          <View style={styles.detailItem}>
            <View style={styles.detailIcon}>
              <Ionicons name="location-outline" size={20} color="#007AFF" />
            </View>
            <View>
              <Text style={styles.detailLabel}>Location</Text>
              <Text style={styles.detailValue}>{job.location}</Text>
              <Text style={styles.detailSubvalue}>{job.distance} away</Text>
            </View>
          </View>

          <View style={styles.detailItem}>
            <View style={styles.detailIcon}>
              <Ionicons name="calendar-outline" size={20} color="#007AFF" />
            </View>
            <View>
              <Text style={styles.detailLabel}>Date & Time</Text>
              <Text style={styles.detailValue}>{job.date}</Text>
            </View>
          </View>
        </Animated.View>

        <Animated.View 
          entering={FadeInDown.delay(300).duration(500)}
          style={styles.section}
        >
          <Text style={styles.sectionTitle}>Job Description</Text>
          <Text style={styles.descriptionText}>{job.description}</Text>
        </Animated.View>

        <Animated.View 
          entering={FadeInDown.delay(400).duration(500)}
          style={styles.section}
        >
          <Text style={styles.sectionTitle}>Requirements</Text>
          {job.requirements.map((requirement: string, index: number) => (
            <View key={index} style={styles.requirementItem}>
              <View style={styles.bulletPoint} />
              <Text style={styles.requirementText}>{requirement}</Text>
            </View>
          ))}
        </Animated.View>

        <Animated.View 
          entering={FadeInDown.delay(500).duration(500)}
          style={styles.section}
        >
          <Text style={styles.sectionTitle}>Tags</Text>
          <View style={styles.tagsContainer}>
            {job.tags.map((tag: string, index: number) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        </Animated.View>

        <View style={styles.footerSpace} />
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        <View style={styles.footerContent}>
          <View>
            <Text style={styles.footerRate}>{job.rate}</Text>
            <Text style={styles.footerPosted}>Posted {job.postedAt}</Text>
          </View>

          <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
            <LinearGradient
              colors={['#007AFF', '#0055CC']}
              style={styles.applyButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.applyButtonText}>Apply Now</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F7FF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookmarkButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    zIndex: -1,
  },
  companyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  companyLogo: {
    width: 70,
    height: 70,
    borderRadius: 12,
    marginRight: 16,
  },
  companyInfo: {
    flex: 1,
  },
  jobTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  companyName: {
    fontSize: 16,
    color: '#666',
    marginBottom: 6,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFAF0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFB400',
    marginLeft: 4,
  },
  jobDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 20,
    marginVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
    marginBottom: 16,
  },
  detailIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  detailLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  detailSubvalue: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
  },
  requirementItem: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  bulletPoint: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#007AFF',
    marginTop: 8,
    marginRight: 10,
  },
  requirementText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#E1EFFF',
    borderRadius: 50,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  footerSpace: {
    height: 100,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    paddingTop: 16,
    paddingHorizontal: 20,
  },
  footerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerRate: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 2,
  },
  footerPosted: {
    fontSize: 12,
    color: '#888',
  },
  applyButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  applyButtonGradient: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  applyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  notFoundText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
  },
}); 