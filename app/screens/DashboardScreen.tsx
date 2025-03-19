import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome5,
} from '@expo/vector-icons';
import Animated, {
  FadeInDown,
  FadeInLeft,
  FadeInRight,
} from 'react-native-reanimated';
import { useSession } from '../hooks/useSession';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAppTheme } from '@providers/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../navigation/types';
import { useAuth } from '@providers/AuthContext';

// Types
type RootStackParamList = {
  Jobs: undefined;
  Shifts: undefined;
  Messages: undefined;
  Payments: undefined;
  PostJob: undefined;
  Workers: undefined;
  ManageShifts: undefined;
};

type DashboardScreenProps = NativeStackScreenProps<RootStackParamList>;

interface QuickActionProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  onPress: () => void;
  color: string;
}

interface StatCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  value: string;
  trend: string;
  color: string;
  delay: number;
}

interface ActivityItemProps {
  item: {
    id: string;
    type: string;
    title: string;
    time: string;
    amount?: string;
    icon: keyof typeof Ionicons.glyphMap;
    color: string;
  };
}

interface ShiftCardProps {
  shift: {
    id: string;
    company: string;
    role: string;
    date: string;
    time: string;
    pay: string;
    location: string;
  };
}

interface JobCardProps {
  job: {
    id: string;
    title: string;
    company: string;
    type: string;
    salary: string;
    match: string;
    skills: string[];
  };
}

// Mock data (same as web version)
const mockStats = {
  earnings: {
    total: 2850,
    trend: '+12%',
    isPositive: true,
  },
  completedJobs: {
    total: 48,
    trend: '+8%',
    isPositive: true,
  },
  rating: {
    total: 4.9,
    trend: '+0.2',
    isPositive: true,
  },
  hoursWorked: {
    total: 164,
    trend: '-2%',
    isPositive: false,
  },
};

const recentActivity = [
  {
    id: '1',
    type: 'job_completed',
    title: 'Completed shift at TechCorp',
    time: '2 hours ago',
    amount: '$120',
    icon: 'checkmark-circle',
    color: '#22C55E',
  },
  {
    id: '2',
    type: 'payment_received',
    title: 'Payment received',
    time: '5 hours ago',
    amount: '$250',
    icon: 'cash',
    color: '#3B82F6',
  },
  {
    id: '3',
    type: 'new_job',
    title: 'New job invitation',
    time: '1 day ago',
    company: 'StartupX',
    icon: 'briefcase',
    color: '#8B5CF6',
  },
];

const upcomingShifts = [
  {
    id: '1',
    company: 'TechCorp',
    role: 'Software Developer',
    date: 'Tomorrow',
    time: '9:00 AM - 5:00 PM',
    pay: '$200',
    location: 'San Francisco, CA',
  },
  {
    id: '2',
    company: 'StartupX',
    role: 'UI Designer',
    date: 'Next Monday',
    time: '10:00 AM - 6:00 PM',
    pay: '$180',
    location: 'Remote',
  },
];

const recommendedJobs = [
  {
    id: '1',
    title: 'Frontend Developer',
    company: 'InnovateCo',
    type: 'Remote',
    salary: '$45-60/hr',
    match: '95%',
    skills: ['React', 'TypeScript', 'Next.js'],
  },
  {
    id: '2',
    title: 'UX Researcher',
    company: 'DesignLabs',
    type: 'Hybrid',
    salary: '$40-55/hr',
    match: '88%',
    skills: ['User Research', 'Figma', 'Prototyping'],
  },
];

const QuickAction = ({ icon, title, onPress, color }) => (
  <TouchableOpacity
    style={[styles.quickAction, { backgroundColor: color }]}
    onPress={onPress}
    activeOpacity={0.8}
  >
    <Ionicons name={icon} size={32} color="white" />
    <Text style={styles.quickActionText}>{title}</Text>
  </TouchableOpacity>
);

const StatCard = ({ icon, title, value, trend, color, delay }) => (
  <Animated.View
    entering={FadeInDown.delay(delay)}
    style={[styles.statCard, { borderLeftColor: color }]}
  >
    <View style={styles.statHeader}>
      <View style={styles.statIcon}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <Text style={[styles.trendText, { color: trend.includes('+') ? '#22C55E' : '#EF4444' }]}>
        {trend}
      </Text>
    </View>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statTitle}>{title}</Text>
  </Animated.View>
);

const ActivityItem = ({ item }) => (
  <View style={styles.activityItem}>
    <View style={[styles.activityIcon, { backgroundColor: item.color + '20' }]}>
      <Ionicons name={item.icon} size={24} color={item.color} />
    </View>
    <View style={styles.activityContent}>
      <Text style={styles.activityTitle}>{item.title}</Text>
      <Text style={styles.activityTime}>{item.time}</Text>
    </View>
    {item.amount && (
      <Text style={styles.activityAmount}>{item.amount}</Text>
    )}
  </View>
);

const ShiftCard = ({ shift }) => (
  <View style={styles.shiftCard}>
    <View style={styles.shiftHeader}>
      <View>
        <Text style={styles.shiftRole}>{shift.role}</Text>
        <Text style={styles.shiftCompany}>{shift.company}</Text>
      </View>
      <Text style={styles.shiftPay}>{shift.pay}</Text>
    </View>
    <View style={styles.shiftDetail}>
      <Ionicons name="calendar" size={16} color="#6B7280" />
      <Text style={styles.shiftDetailText}>
        {shift.date} • {shift.time}
      </Text>
    </View>
    <View style={styles.shiftDetail}>
      <Ionicons name="location" size={16} color="#6B7280" />
      <Text style={styles.shiftDetailText}>{shift.location}</Text>
    </View>
  </View>
);

const JobCard = ({ job }) => (
  <View style={styles.jobCard}>
    <View style={styles.jobHeader}>
      <View>
        <Text style={styles.jobTitle}>{job.title}</Text>
        <Text style={styles.jobCompany}>
          {job.company} • {job.type}
        </Text>
      </View>
      <View style={styles.matchBadge}>
        <Text style={styles.matchText}>{job.match}</Text>
      </View>
    </View>
    <Text style={styles.jobSalary}>{job.salary}</Text>
    <View style={styles.skillsContainer}>
      {job.skills.map((skill) => (
        <View key={skill} style={styles.skillBadge}>
          <Text style={styles.skillText}>{skill}</Text>
        </View>
      ))}
    </View>
  </View>
);

export default function DashboardScreen({ navigation }) {
  const theme = useAppTheme();
  const { session } = useSession();
  const isWorker = session?.user?.role === 'WORKER';

  const quickActions = isWorker
    ? [
        {
          icon: 'briefcase',
          title: 'Find Jobs',
          color: '#3B82F6',
          onPress: () => navigation.navigate('Jobs'),
        },
        {
          icon: 'calendar',
          title: 'Schedule',
          color: '#8B5CF6',
          onPress: () => navigation.navigate('Shifts'),
        },
        {
          icon: 'chatbubble',
          title: 'Messages',
          color: '#22C55E',
          onPress: () => navigation.navigate('Messages'),
        },
        {
          icon: 'cash',
          title: 'Payments',
          color: '#F97316',
          onPress: () => navigation.navigate('Payments'),
        },
      ]
    : [
        {
          icon: 'add-circle',
          title: 'Post Job',
          color: '#3B82F6',
          onPress: () => navigation.navigate('PostJob'),
        },
        {
          icon: 'people',
          title: 'Workers',
          color: '#8B5CF6',
          onPress: () => navigation.navigate('Workers'),
        },
        {
          icon: 'calendar',
          title: 'Shifts',
          color: '#22C55E',
          onPress: () => navigation.navigate('ManageShifts'),
        },
        {
          icon: 'chatbubble',
          title: 'Messages',
          color: '#F97316',
          onPress: () => navigation.navigate('Messages'),
        },
      ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Welcome Header */}
        <LinearGradient
          colors={['#2557a7', '#3B82F6']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.header}
        >
          <Text style={styles.welcomeText}>
            Welcome back, {session?.user?.name}!
          </Text>
          <Text style={styles.subtitleText}>
            {isWorker
              ? "Here's what's happening with your job search and upcoming shifts."
              : "Here's an overview of your job postings and worker activity."}
          </Text>
        </LinearGradient>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action) => (
              <QuickAction key={action.title} {...action} />
            ))}
          </View>
        </View>

        {/* Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.statsContainer}
          >
            <StatCard
              icon="cash"
              title="Total Earnings"
              value={`$${mockStats.earnings.total}`}
              trend={mockStats.earnings.trend}
              color="#3B82F6"
              delay={0}
            />
            <StatCard
              icon="bar-chart"
              title="Completed Jobs"
              value={mockStats.completedJobs.total.toString()}
              trend={mockStats.completedJobs.trend}
              color="#8B5CF6"
              delay={100}
            />
            <StatCard
              icon="star"
              title="Rating"
              value={mockStats.rating.total.toString()}
              trend={mockStats.rating.trend}
              color="#F59E0B"
              delay={200}
            />
            <StatCard
              icon="time"
              title="Hours Worked"
              value={`${mockStats.hoursWorked.total}h`}
              trend={mockStats.hoursWorked.trend}
              color="#22C55E"
              delay={300}
            />
          </ScrollView>
        </View>

        {/* Recent Activity */}
        <Animated.View
          entering={FadeInLeft}
          style={styles.section}
        >
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          {recentActivity.map((activity) => (
            <ActivityItem key={activity.id} item={activity} />
          ))}
        </Animated.View>

        {/* Upcoming Shifts */}
        <Animated.View
          entering={FadeInRight}
          style={styles.section}
        >
          <Text style={styles.sectionTitle}>Upcoming Shifts</Text>
          {upcomingShifts.map((shift) => (
            <ShiftCard key={shift.id} shift={shift} />
          ))}
        </Animated.View>

        {/* Recommended Jobs */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recommended Jobs</Text>
            <Ionicons name="trending-up" size={20} color="#3B82F6" />
          </View>
          {recommendedJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    padding: 20,
    borderRadius: 12,
    margin: 16,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  subtitleText: {
    fontSize: 16,
    color: '#E0E7FF',
  },
  section: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickAction: {
    width: (Dimensions.get('window').width - 48) / 2,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: 'center',
  },
  quickActionText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    marginTop: 8,
  },
  statsContainer: {
    paddingRight: 16,
  },
  statCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    width: 160,
    borderLeftWidth: 4,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statIcon: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  trendText: {
    fontSize: 14,
    fontWeight: '500',
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  activityIcon: {
    padding: 8,
    borderRadius: 8,
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 4,
  },
  activityTime: {
    fontSize: 14,
    color: '#6B7280',
  },
  activityAmount: {
    fontSize: 16,
    fontWeight: '500',
    color: '#22C55E',
  },
  shiftCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  shiftHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  shiftRole: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 4,
  },
  shiftCompany: {
    fontSize: 14,
    color: '#6B7280',
  },
  shiftPay: {
    fontSize: 16,
    fontWeight: '500',
    color: '#3B82F6',
  },
  shiftDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  shiftDetailText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#6B7280',
  },
  jobCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 4,
  },
  jobCompany: {
    fontSize: 14,
    color: '#6B7280',
  },
  matchBadge: {
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  matchText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#059669',
  },
  jobSalary: {
    fontSize: 16,
    fontWeight: '500',
    color: '#3B82F6',
    marginBottom: 12,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  skillText: {
    fontSize: 12,
    color: '#4B5563',
  },
}); 