import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../app/providers/ThemeContext';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  postedDate: string;
  companyLogo?: string;
  description: string;
}

interface JobListProps {
  jobs: Job[];
  onJobPress: (job: Job) => void;
  onRefresh?: () => void;
  refreshing?: boolean;
}

export default function JobList({ jobs, onJobPress, onRefresh, refreshing = false }: JobListProps) {
  const theme = useAppTheme();

  const renderItem = ({ item: job }: { item: Job }) => (
    <TouchableOpacity
      style={[styles.jobCard, { backgroundColor: theme.card, borderColor: theme.border }]}
      onPress={() => onJobPress(job)}
    >
      <View style={styles.jobHeader}>
        {job.companyLogo ? (
          <Image source={{ uri: job.companyLogo }} style={styles.companyLogo} />
        ) : (
          <View style={[styles.companyLogoPlaceholder, { backgroundColor: theme.border }]}>
            <Ionicons name="business" size={24} color={theme.subtext} />
          </View>
        )}
        <View style={styles.jobInfo}>
          <Text style={[styles.jobTitle, { color: theme.text }]} numberOfLines={1}>
            {job.title}
          </Text>
          <Text style={[styles.companyName, { color: theme.subtext }]} numberOfLines={1}>
            {job.company}
          </Text>
          <View style={styles.locationContainer}>
            <Ionicons name="location-outline" size={16} color={theme.subtext} />
            <Text style={[styles.location, { color: theme.subtext }]} numberOfLines={1}>
              {job.location}
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.jobMeta}>
        <View style={styles.metaItem}>
          <Ionicons name="time-outline" size={16} color={theme.subtext} />
          <Text style={[styles.metaText, { color: theme.subtext }]}>
            {job.postedDate}
          </Text>
        </View>
        <View style={[styles.metaItem, styles.payRate]}>
          <Ionicons name="cash-outline" size={16} color={theme.accent} />
          <Text style={[styles.metaText, { color: theme.accent, fontWeight: '600' }]}>
            {job.salary}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={jobs}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContainer}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={theme.text}
        />
      }
    />
  );
}

const styles = StyleSheet.create({
  listContainer: {
    padding: 16,
  },
  jobCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  jobHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  companyLogo: {
    width: 48,
    height: 48,
    borderRadius: 8,
    marginRight: 12,
  },
  companyLogoPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 8,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  jobInfo: {
    flex: 1,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  companyName: {
    fontSize: 14,
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  location: {
    fontSize: 14,
    marginLeft: 4,
  },
  jobMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 14,
    marginLeft: 4,
  },
  payRate: {
    backgroundColor: 'rgba(52, 152, 219, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
}); 