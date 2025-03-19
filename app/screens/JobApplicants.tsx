import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  StatusBar,
  Alert,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../navigation/types';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '@providers/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';

type JobApplicantsRouteProp = RouteProp<MainStackParamList, 'JobApplicants'>;
type JobApplicantsNavigationProp = NativeStackNavigationProp<MainStackParamList, 'JobApplicants'>;

interface Applicant {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  appliedDate: string;
  status: 'pending' | 'accepted' | 'rejected';
  experience?: string;
  skills?: string[];
}

export default function JobApplicantsScreen() {
  const navigation = useNavigation<JobApplicantsNavigationProp>();
  const route = useRoute<JobApplicantsRouteProp>();
  const theme = useAppTheme();
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchApplicants = useCallback(async () => {
    try {
      const response = await axios.get(`/api/jobs/${route.params.jobId}/applicants`);
      setApplicants(response.data);
    } catch (error) {
      console.error('Error fetching applicants:', error);
      Alert.alert('Error', 'Failed to load applicants. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [route.params.jobId]);

  const handleStatusChange = async (applicantId: string, newStatus: 'accepted' | 'rejected') => {
    try {
      await axios.patch(`/api/jobs/${route.params.jobId}/applicants/${applicantId}`, {
        status: newStatus,
      });
      
      setApplicants(current =>
        current.map(applicant =>
          applicant.id === applicantId
            ? { ...applicant, status: newStatus }
            : applicant
        )
      );

      Alert.alert(
        'Success',
        `Applicant has been ${newStatus === 'accepted' ? 'accepted' : 'rejected'}`
      );
    } catch (error) {
      console.error('Error updating applicant status:', error);
      Alert.alert('Error', 'Failed to update applicant status. Please try again.');
    }
  };

  const renderApplicantCard = ({ item }: { item: Applicant }) => (
    <View style={[styles.applicantCard, { backgroundColor: theme.card }]}>
      <View style={styles.applicantHeader}>
        <View style={styles.avatarContainer}>
          {item.avatar ? (
            <Image source={{ uri: item.avatar }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatarPlaceholder, { backgroundColor: theme.input }]}>
              <Ionicons name="person" size={24} color={theme.subtext} />
            </View>
          )}
        </View>
        <View style={styles.applicantInfo}>
          <Text style={[styles.applicantName, { color: theme.text }]}>{item.name}</Text>
          <Text style={[styles.applicantEmail, { color: theme.subtext }]}>{item.email}</Text>
          <Text style={[styles.appliedDate, { color: theme.subtext }]}>
            Applied {item.appliedDate}
          </Text>
        </View>
      </View>

      {item.experience && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Experience</Text>
          <Text style={[styles.sectionText, { color: theme.text }]}>{item.experience}</Text>
        </View>
      )}

      {item.skills && item.skills.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Skills</Text>
          <View style={styles.skillsContainer}>
            {item.skills.map((skill, index) => (
              <View
                key={index}
                style={[styles.skillBadge, { backgroundColor: theme.input }]}
              >
                <Text style={[styles.skillText, { color: theme.text }]}>{skill}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {item.status === 'pending' ? (
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, styles.rejectButton]}
            onPress={() => handleStatusChange(item.id, 'rejected')}
          >
            <Ionicons name="close" size={20} color={theme.error} />
            <Text style={[styles.actionButtonText, { color: theme.error }]}>Reject</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.acceptButton]}
            onPress={() => handleStatusChange(item.id, 'accepted')}
          >
            <LinearGradient
              colors={theme.gradients.primary}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.acceptButtonGradient}
            >
              <Ionicons name="checkmark" size={20} color="#FFFFFF" />
              <Text style={styles.acceptButtonText}>Accept</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={[styles.statusBadge, { backgroundColor: theme.input }]}>
          <Text
            style={[
              styles.statusText,
              {
                color:
                  item.status === 'accepted' ? theme.success :
                  item.status === 'rejected' ? theme.error :
                  theme.text,
              },
            ]}
          >
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </Text>
        </View>
      )}
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <TouchableOpacity
          style={[styles.backButton, { backgroundColor: theme.input }]}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.text }]}>Applicants</Text>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.accent} />
        </View>
      ) : (
        <FlatList
          data={applicants}
          renderItem={renderApplicantCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.applicantsList}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="people-outline" size={48} color={theme.subtext} />
              <Text style={[styles.emptyText, { color: theme.subtext }]}>
                No applicants yet
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
  },
  applicantsList: {
    padding: 24,
    gap: 16,
  },
  applicantCard: {
    borderRadius: 16,
    padding: 16,
    gap: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  applicantHeader: {
    flexDirection: 'row',
    gap: 16,
  },
  avatarContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  avatarPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  applicantInfo: {
    flex: 1,
    gap: 4,
  },
  applicantName: {
    fontSize: 18,
    fontWeight: '600',
  },
  applicantEmail: {
    fontSize: 14,
  },
  appliedDate: {
    fontSize: 12,
  },
  section: {
    gap: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  sectionText: {
    fontSize: 14,
    lineHeight: 20,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  skillText: {
    fontSize: 12,
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    height: 40,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  rejectButton: {
    borderWidth: 1,
    borderColor: 'transparent',
  },
  acceptButton: {
    overflow: 'hidden',
  },
  acceptButtonGradient: {
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  acceptButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    paddingTop: 48,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
  },
}); 