import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppTheme } from '@providers/ThemeContext';
import Icon from '@expo/vector-icons/Ionicons';
import { Ionicons } from '@expo/vector-icons';

type MetricCard = {
  id: string;
  title: string;
  count: number;
  icon: keyof typeof Ionicons.glyphMap;
};

type Job = {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
};

// Sample data
const METRIC_CARDS: MetricCard[] = [
  {
    id: '1',
    title: 'Active Jobs',
    count: 5,
    icon: 'briefcase-outline',
  },
  {
    id: '2',
    title: 'Applications',
    count: 12,
    icon: 'people-outline',
  },
  {
    id: '3',
    title: 'Completed',
    count: 8,
    icon: 'checkmark-circle-outline',
  },
];

const SAMPLE_JOBS: Job[] = [
  {
    id: '1',
    title: 'Senior Bartender',
    company: 'Luxury Hotel',
    location: 'Downtown',
    salary: '$25-30/hr',
    type: 'Full-time',
  },
  {
    id: '2',
    title: 'Event Chef',
    company: 'Catering Co.',
    location: 'Various',
    salary: '$35-40/hr',
    type: 'Contract',
  },
];

export default function Dashboard() {
  const theme = useAppTheme();

  const renderMetricCard = (item: MetricCard) => (
    <View key={item.id} style={[styles.metricCard, { backgroundColor: theme.card }]}>
      <View style={[styles.metricIconContainer, { backgroundColor: theme.cardLight }]}>
        <Icon name={item.icon} size={24} color={theme.accent} />
      </View>
      <Text style={[styles.metricTitle, { color: theme.subtext }]}>{item.title}</Text>
      <Text style={[styles.metricValue, { color: theme.text }]}>{item.count}</Text>
    </View>
  );

  const renderJobCard = (job: Job) => (
    <TouchableOpacity key={job.id} style={[styles.jobCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <View style={styles.jobHeader}>
        <View style={styles.jobInfo}>
          <Text style={[styles.jobTitle, { color: theme.text }]}>{job.title}</Text>
          <Text style={[styles.companyName, { color: theme.subtext }]}>{job.company}</Text>
        </View>
      </View>
      <View style={styles.jobMeta}>
        <View style={styles.metaItem}>
          <Icon name="location-outline" size={16} color={theme.subtext} />
          <Text style={[styles.metaText, { color: theme.subtext }]}>{job.location}</Text>
        </View>
        <View style={styles.metaItem}>
          <Icon name="cash-outline" size={16} color={theme.subtext} />
          <Text style={[styles.metaText, { color: theme.subtext }]}>{job.salary}</Text>
        </View>
        <View style={styles.metaItem}>
          <Icon name="time-outline" size={16} color={theme.subtext} />
          <Text style={[styles.metaText, { color: theme.subtext }]}>{job.type}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.greeting, { color: theme.text }]}>Hello, John!</Text>
          <Text style={[styles.subtitle, { color: theme.subtext }]}>Find your next opportunity</Text>
        </View>

        <View style={[styles.searchContainer, { backgroundColor: theme.input, borderColor: theme.border }]}>
          <Icon name="search-outline" size={20} color={theme.subtext} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: theme.text }]}
            placeholder="Search jobs..."
            placeholderTextColor={theme.placeholder}
          />
        </View>

        <View style={[styles.balanceCard, { backgroundColor: theme.card }]}>
          <View style={styles.balanceHeader}>
            <Text style={[styles.balanceLabel, { color: theme.text }]}>Total Earnings</Text>
            <Icon name="eye-outline" size={24} color={theme.text} />
          </View>
          <Text style={[styles.balanceAmount, { color: theme.text }]}>$2,458.00</Text>
          <Text style={[styles.balanceSubtext, { color: theme.subtext }]}>+$258.00 this month</Text>
        </View>

        <View style={styles.metricsContainer}>
          {METRIC_CARDS.map(renderMetricCard)}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Recent Jobs</Text>
            <TouchableOpacity>
              <Text style={[styles.seeAll, { color: theme.accent }]}>See All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.jobsList}>
            {SAMPLE_JOBS.map(renderJobCard)}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingTop: 16,
  },
  header: {
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 24,
    marginBottom: 24,
    paddingHorizontal: 16,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  balanceCard: {
    marginHorizontal: 24,
    marginBottom: 24,
    padding: 24,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  balanceLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 8,
  },
  balanceSubtext: {
    fontSize: 14,
  },
  metricsContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 24,
  },
  metricCard: {
    flex: 1,
    margin: 4,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  metricIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  metricTitle: {
    fontSize: 14,
    marginTop: 12,
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  seeAll: {
    fontSize: 14,
  },
  jobsList: {
    paddingHorizontal: 24,
  },
  jobCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
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
    marginBottom: 8,
  },
  jobMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  metaText: {
    fontSize: 14,
    marginLeft: 4,
  },
});