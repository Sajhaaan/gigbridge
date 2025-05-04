import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
  Animated,
  Dimensions,
  Pressable,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MotiView } from 'moti';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Simplified color palette for a more minimal design
const COLORS = {
  primary: '#0B132B',
  secondary: '#4361EE',
  accent: '#06D6A0',
  background: '#F8FAFC',
  text: '#1E293B',
  textSecondary: '#64748B',
  overlay: 'rgba(255, 255, 255, 0.95)',
  glass: 'rgba(255, 255, 255, 0.7)',
  success: '#06D6A0',
  warning: '#FF5A5F',
  verified: '#4361EE',
  card: '#FFFFFF',
  cardShadow: 'rgba(15, 23, 42, 0.06)',
  gradient: ['#4361EE', '#06D6A0'],
  highlight: '#4361EE',
  danger: '#FF5A5F',
  info: '#0EA5E9',
};

export default function JobDetails() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  const [job, setJob] = useState<any>(null);
  const [saved, setSaved] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;
  const [showFullHeader, setShowFullHeader] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Parse job data from params
  useEffect(() => {
    try {
      if (params.job) {
        console.log('Job param received:', params.job);
        const parsedJob = JSON.parse(params.job as string);
        setJob(parsedJob);
      } else {
        // If no job data was provided, show error
        setError('No job data provided');
        console.error('No job data provided');
      }
    } catch (error) {
      setError('Error parsing job data. Please try again.');
      console.error('Error parsing job data:', error);
    } finally {
      setLoading(false);
    }
  }, [params]);
  
  // Adjust status bar for this screen
  useEffect(() => {
    StatusBar.setBarStyle('light-content');
    return () => {
      StatusBar.setBarStyle('dark-content');
    };
  }, []);

  // Render loading state
  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <StatusBar barStyle="dark-content" />
        <ActivityIndicator size="large" color={COLORS.secondary} />
        <Text style={styles.loadingText}>Loading job details...</Text>
      </View>
    );
  }

  // Render error state
  if (error || !job) {
    return (
      <View style={[styles.container, styles.errorContainer]}>
        <StatusBar barStyle="dark-content" />
        <Ionicons name="alert-circle-outline" size={64} color={COLORS.danger} />
        <Text style={styles.errorTitle}>Oops! Something went wrong</Text>
        <Text style={styles.errorText}>{error || 'Unable to load job details'}</Text>
        <TouchableOpacity style={styles.goBackButton} onPress={() => router.back()}>
          <Text style={styles.goBackButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const renderBadge = (icon: string, text: string, color: string) => (
    <MotiView
      from={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'timing', duration: 300 }}
      style={[styles.badge, { backgroundColor: color + '15' }]}
    >
      <Ionicons name={icon as any} size={14} color={color} />
      <Text style={[styles.badgeText, { color }]}>{text}</Text>
    </MotiView>
  );

  // Header animation based on scroll
  const headerHeight = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [180, 120],
    extrapolate: 'clamp',
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 60, 90],
    outputRange: [1, 0.8, 0],
    extrapolate: 'clamp',
  });

  const titleScale = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.8],
    extrapolate: 'clamp',
  });

  return (
    <View style={[styles.container, { backgroundColor: COLORS.background }]}>
      {/* Simplified Header */}
      <Animated.View style={[styles.header, { height: headerHeight }]}>
        <LinearGradient
          colors={[COLORS.primary, '#2A3356']}
          start={[0, 0]}
          end={[1, 1]}
          style={[styles.headerGradient, { paddingTop: insets.top || 40 }]}
        >
          <View style={styles.headerActions}>
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
            </TouchableOpacity>
            
            <View style={styles.headerRightButtons}>
              <TouchableOpacity 
                style={styles.headerButton}
                onPress={() => setSaved(!saved)}
              >
                <Ionicons name={saved ? "bookmark" : "bookmark-outline"} size={22} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
          
          <Animated.View style={[styles.headerTitleContainer, { opacity: headerOpacity, transform: [{ scale: titleScale }] }]}>
            <Text style={styles.headerTitle} numberOfLines={1}>{job?.title}</Text>
            <View style={styles.headerMeta}>
              <View style={styles.headerMetaItem}>
                <Ionicons name="location-outline" size={16} color="#FFFFFF90" />
                <Text style={styles.headerMetaText} numberOfLines={1}>{job?.location}</Text>
              </View>
              <View style={styles.metaSeparator} />
              <View style={styles.headerMetaItem}>
                <Ionicons name="time-outline" size={16} color="#FFFFFF90" />
                <Text style={styles.headerMetaText} numberOfLines={1}>{job?.postedDate}</Text>
              </View>
            </View>
          </Animated.View>
        </LinearGradient>
      </Animated.View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {/* Company Info Banner */}
        <View style={styles.cardContainer}>
          <View style={styles.companyCard}>
            <View style={styles.companyCardContent}>
              <Image 
                source={{ uri: `https://ui-avatars.com/api/?name=${job?.company}&background=random&size=120&bold=true` }}
                style={styles.companyLogoImage}
              />
              <View style={styles.companyTextContainer}>
                <Text style={styles.companyName} numberOfLines={1}>{job?.company}</Text>
                {job?.verified && (
                  <View style={styles.verifiedContainer}>
                    <Ionicons name="checkmark-circle" size={14} color={COLORS.verified} />
                    <Text style={styles.verifiedText}>Verified Employer</Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        </View>

        {/* Key Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <View style={styles.statContent}>
              <Text style={styles.statValue} numberOfLines={1}>{job?.hourlyRate}</Text>
              <Text style={styles.statLabel}>Rate</Text>
            </View>
          </View>
          
          <View style={styles.statCard}>
            <View style={styles.statContent}>
              <Text style={styles.statValue} numberOfLines={1}>{job?.shift?.duration}</Text>
              <Text style={styles.statLabel}>Duration</Text>
            </View>
          </View>
          
          <View style={styles.statCard}>
            <View style={styles.statContent}>
              <Text style={styles.statValue} numberOfLines={1}>{job?.distance}</Text>
              <Text style={styles.statLabel}>Distance</Text>
            </View>
          </View>
        </View>

        {/* Job Details - Simplified card design */}
        <View style={styles.cardContainer}>
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.sectionTitle}>Job Details</Text>
              {job?.urgency === 'urgent' && (
                <View style={styles.priorityTag}>
                  <Text style={styles.priorityText}>Urgent</Text>
                </View>
              )}
            </View>
            
            <View style={styles.detailsGrid}>
              <View style={styles.detailItem}>
                <Ionicons name="calendar-outline" size={20} color={COLORS.secondary} style={styles.detailIcon} />
                <View style={styles.detailTextContainer}>
                  <Text style={styles.detailLabel}>Date & Time</Text>
                  <Text style={styles.detailText} numberOfLines={1}>{job?.shift?.day}, {job?.shift?.time}</Text>
                </View>
              </View>
              
              <View style={styles.detailItem}>
                <Ionicons name="cash-outline" size={20} color={COLORS.warning} style={styles.detailIcon} />
                <View style={styles.detailTextContainer}>
                  <Text style={styles.detailLabel}>Total Pay</Text>
                  <Text style={styles.detailText} numberOfLines={1}>{job?.totalPay}</Text>
                </View>
              </View>
              
              <View style={styles.detailItem}>
                <Ionicons name="briefcase-outline" size={20} color={COLORS.verified} style={styles.detailIcon} />
                <View style={styles.detailTextContainer}>
                  <Text style={styles.detailLabel}>Job Type</Text>
                  <Text style={styles.detailText} numberOfLines={1}>{job?.type}</Text>
                </View>
              </View>
              
              <View style={styles.detailItem}>
                <Ionicons name="people-outline" size={20} color={COLORS.secondary} style={styles.detailIcon} />
                <View style={styles.detailTextContainer}>
                  <Text style={styles.detailLabel}>Slots</Text>
                  <Text style={styles.detailText} numberOfLines={1}>{job?.slots?.filled}/{job?.slots?.total} filled</Text>
                </View>
              </View>
            </View>
            
            {/* Job Perks - Simplified */}
            {(job?.escrow || job?.transport) && (
              <View style={styles.perksContainer}>
                {job?.escrow && (
                  <View style={styles.perkItem}>
                    <Ionicons name="shield-checkmark" size={14} color={COLORS.success} />
                    <Text style={styles.perkText}>Escrow Payment</Text>
                  </View>
                )}
                {job?.transport && (
                  <View style={styles.perkItem}>
                    <Ionicons name="car" size={14} color={COLORS.warning} />
                    <Text style={styles.perkText}>Transport Provided</Text>
                  </View>
                )}
              </View>
            )}
          </View>
        </View>

        {/* Description - Simplified */}
        <View style={styles.cardContainer}>
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.sectionTitle}>Description</Text>
              <TouchableOpacity onPress={() => setExpanded(!expanded)}>
                <Text style={styles.expandText}>{expanded ? 'Less' : 'More'}</Text>
              </TouchableOpacity>
            </View>
            
            <Text style={[
              styles.descriptionText, 
              expanded ? styles.expandedDescription : { maxHeight: 80 }
            ]}>
              We are looking for a {job?.title} to join our team at {job?.company}. This is a {job?.type} position
              with flexible hours and competitive pay. The ideal candidate should be detail-oriented, reliable, and able to work
              in a fast-paced environment.
              
              Located in {job?.location}, this position will give you the opportunity to develop your skills
              while working with a talented team. {job?.transport ? 'Transportation is provided to and from the work location.' : ''}
            </Text>
            
            {!expanded && (
              <LinearGradient
                colors={['rgba(255,255,255,0)', 'rgba(255,255,255,1)']}
                style={styles.gradientOverlay}
              />
            )}
          </View>
        </View>

        {/* Requirements - Simplified */}
        <View style={styles.cardContainer}>
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Requirements</Text>
            
            <View style={styles.requirementsList}>
              <View style={styles.requirementItem}>
                <View style={styles.checkmark}>
                  <Ionicons name="checkmark" size={14} color={COLORS.secondary} />
                </View>
                <Text style={styles.requirementText}>Previous experience in similar role</Text>
              </View>
              
              <View style={styles.requirementItem}>
                <View style={styles.checkmark}>
                  <Ionicons name="checkmark" size={14} color={COLORS.secondary} />
                </View>
                <Text style={styles.requirementText}>Good communication skills</Text>
              </View>
              
              <View style={styles.requirementItem}>
                <View style={styles.checkmark}>
                  <Ionicons name="checkmark" size={14} color={COLORS.secondary} />
                </View>
                <Text style={styles.requirementText}>Ability to work in a team</Text>
              </View>
              
              <View style={styles.requirementItem}>
                <View style={styles.checkmark}>
                  <Ionicons name="checkmark" size={14} color={COLORS.secondary} />
                </View>
                <Text style={styles.requirementText}>Punctuality and reliability</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Location Map - Simplified */}
        <View style={styles.cardContainer}>
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.sectionTitle}>Location</Text>
              <TouchableOpacity style={styles.directionButton}>
                <Text style={styles.directionText}>Directions</Text>
                <Ionicons name="navigate" size={14} color={COLORS.accent} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.mapContainer}>
              <View style={styles.mapPlaceholder}>
                <Ionicons name="map-outline" size={30} color={COLORS.textSecondary} />
                <Text style={styles.mapText}>{job?.location} • {job?.distance} from you</Text>
              </View>
            </View>
          </View>
        </View>
        
        {/* Extra space at bottom to ensure content isn't hidden by footer */}
        <View style={{ height: 80 }} />
      </ScrollView>

      {/* Apply Button - Simplified */}
      <View style={styles.footer}>
        <View style={styles.footerContent}>
          <View>
            <Text style={styles.footerLabel}>Total Pay</Text>
            <Text style={styles.footerPay} numberOfLines={1}>{job?.totalPay}</Text>
          </View>
          
          <TouchableOpacity style={[styles.applyButton, { backgroundColor: job?.urgency === 'urgent' ? COLORS.warning : COLORS.secondary }]}>
            <Text style={styles.applyButtonText}>Apply Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    overflow: 'hidden',
  },
  headerGradient: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 8,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  headerRightButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerTitleContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: -8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
    textAlign: 'center',
  },
  headerMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  headerMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerMetaText: {
    fontSize: 14,
    color: '#FFFFFF90',
    marginLeft: 6,
  },
  metaSeparator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#FFFFFF60',
    marginHorizontal: 10,
  },
  
  // Company card
  companyCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
    shadowColor: COLORS.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 12,
  },
  companyCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  companyLogoImage: {
    width: 40,
    height: 40,
    borderRadius: 10,
    marginRight: 12,
    borderWidth: 1,
    borderColor: 'rgba(200,200,230,0.5)',
    backgroundColor: '#F5F7FA',
  },
  companyTextContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  companyName: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    letterSpacing: 0.2,
  },
  verifiedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  verifiedText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.verified,
    marginLeft: 4,
  },
  
  // Main content
  scrollView: {
    flex: 1,
    marginTop: 130,
  },
  scrollContent: {
    paddingTop: 20,
    paddingBottom: 20,
  },
  
  // Stats
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    marginHorizontal: 4,
    height: 80,
    backgroundColor: COLORS.card,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statContent: {
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 4,
    textAlign: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  
  // Cards
  cardContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
    shadowColor: COLORS.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  
  // Details grid
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    width: '50%',
    marginBottom: 16,
    paddingRight: 8,
  },
  detailIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  detailTextContainer: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  detailText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  
  // Job perks
  perksContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderTopWidth: 1,
    borderTopColor: 'rgba(220, 220, 250, 0.2)',
    paddingTop: 16,
    gap: 8,
  },
  perkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  perkText: {
    fontSize: 12,
    color: COLORS.text,
    marginLeft: 6,
  },
  
  // Priority tag
  priorityTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: COLORS.warning + '15',
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.warning,
  },
  
  // Description
  descriptionText: {
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.textSecondary,
    overflow: 'hidden',
  },
  expandedDescription: {
    maxHeight: undefined,
  },
  expandText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.secondary,
  },
  gradientOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 40,
  },
  
  // Requirements
  requirementsList: {
    marginTop: 12,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  checkmark: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.secondary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  requirementText: {
    fontSize: 14,
    color: COLORS.text,
    flex: 1,
    lineHeight: 20,
  },
  
  // Map
  directionButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  directionText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.accent,
    marginRight: 4,
  },
  mapContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: COLORS.background,
  },
  mapPlaceholder: {
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapText: {
    marginTop: 8,
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  
  // Footer
  footer: {
    paddingTop: 16,
    paddingBottom: Platform.OS === 'ios' ? 36 : 16,
    paddingHorizontal: 16,
    backgroundColor: COLORS.card,
    borderTopWidth: 1,
    borderTopColor: 'rgba(220, 220, 250, 0.2)',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    shadowColor: COLORS.cardShadow,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 10,
  },
  footerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  footerPay: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    maxWidth: 150,
  },
  applyButton: {
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: 16,
  },
  errorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: 24,
    textAlign: 'center',
  },
  goBackButton: {
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: COLORS.secondary,
  },
  goBackButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
}); 