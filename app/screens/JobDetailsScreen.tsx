import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  useColorScheme,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useRoute } from '@react-navigation/native';
import { MainStackParamList } from '../navigation/MainStack';

type JobDetailsRouteProp = RouteProp<MainStackParamList, 'JobDetails'>;

export default function JobDetailsScreen() {
  const route = useRoute<JobDetailsRouteProp>();
  const { job } = route.params;
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const colors = {
    background: isDark ? '#1A1A1A' : '#F8F9FA',
    text: isDark ? '#FFFFFF' : '#2D3436',
    subtext: isDark ? '#A0A0A0' : '#636E72',
    accent: '#3498DB',
    card: isDark ? '#2D3436' : '#FFFFFF',
    border: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
  };

  const handleApply = () => {
    Alert.alert(
      'Apply for Job',
      'Are you sure you want to apply for this position?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Apply',
          onPress: () => {
            // TODO: Implement job application logic
            Alert.alert('Success', 'Your application has been submitted!');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView>
        <View style={[styles.header, { backgroundColor: colors.card }]}>
          <Image
            source={{ uri: job.companyLogo || 'https://picsum.photos/200' }}
            style={styles.companyLogo}
          />
          <Text style={[styles.jobTitle, { color: colors.text }]}>{job.title}</Text>
          <Text style={[styles.companyName, { color: colors.subtext }]}>
            {job.company}
          </Text>
          <View style={styles.locationContainer}>
            <Ionicons name="location-outline" size={16} color={colors.subtext} />
            <Text style={[styles.location, { color: colors.subtext }]}>
              {job.location}
            </Text>
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Job Details</Text>
          <View style={styles.detailsGrid}>
            <View style={styles.detailItem}>
              <Ionicons name="cash-outline" size={24} color={colors.accent} />
              <View style={styles.detailText}>
                <Text style={[styles.detailLabel, { color: colors.subtext }]}>
                  Salary
                </Text>
                <Text style={[styles.detailValue, { color: colors.text }]}>
                  {job.salary}
                </Text>
              </View>
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="time-outline" size={24} color={colors.accent} />
              <View style={styles.detailText}>
                <Text style={[styles.detailLabel, { color: colors.subtext }]}>
                  Job Type
                </Text>
                <Text style={[styles.detailValue, { color: colors.text }]}>
                  {job.type}
                </Text>
              </View>
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="calendar-outline" size={24} color={colors.accent} />
              <View style={styles.detailText}>
                <Text style={[styles.detailLabel, { color: colors.subtext }]}>
                  Posted
                </Text>
                <Text style={[styles.detailValue, { color: colors.text }]}>
                  {job.postedDate}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Job Description
          </Text>
          <Text style={[styles.description, { color: colors.text }]}>
            {job.description}
          </Text>
        </View>
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: colors.card }]}>
        <TouchableOpacity
          style={[styles.applyButton, { backgroundColor: colors.accent }]}
          onPress={handleApply}
        >
          <Text style={styles.applyButtonText}>Apply Now</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 24,
    alignItems: 'center',
    borderRadius: 12,
    margin: 16,
  },
  companyLogo: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginBottom: 16,
  },
  jobTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  companyName: {
    fontSize: 16,
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  location: {
    marginLeft: 4,
    fontSize: 14,
  },
  section: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
    marginBottom: 16,
  },
  detailText: {
    marginLeft: 8,
  },
  detailLabel: {
    fontSize: 12,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    lineHeight: 24,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  applyButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
}); 