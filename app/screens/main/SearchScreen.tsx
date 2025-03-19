import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { Job } from '../../types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SearchStackParamList } from '../../types/navigation';

type SearchScreenProps = {
  navigation: NativeStackNavigationProp<SearchStackParamList, 'SearchScreen'>;
};

export default function SearchScreen({ navigation }: SearchScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [jobs, setJobs] = useState<Job[]>([]);

  const searchJobs = async (query: string) => {
    try {
      // TODO: Implement job search API call
      // For now, using mock data
      const mockJobs: Job[] = [
        {
          id: '1',
          title: 'Web Development Project',
          description: 'Looking for a skilled web developer for a new project',
          budget: 5000,
          status: 'open',
          category: 'Web Development',
          location: 'Remote',
          businessId: '1',
          business: {
            id: '1',
            name: 'Tech Corp',
            email: 'contact@techcorp.com',
            userType: 'business',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        // Add more mock jobs as needed
      ];
      setJobs(mockJobs);
    } catch (error) {
      console.error('Error searching jobs:', error);
    }
  };

  const renderJobItem = ({ item }: { item: Job }) => (
    <TouchableOpacity
      style={styles.jobCard}
      onPress={() => navigation.navigate('JobDetails', { jobId: item.id })}
    >
      <Text style={styles.jobTitle}>{item.title}</Text>
      <Text style={styles.jobDescription} numberOfLines={2}>
        {item.description}
      </Text>
      <View style={styles.jobDetails}>
        <Text style={styles.jobBudget}>${item.budget}</Text>
        <Text style={styles.jobLocation}>{item.location}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search jobs..."
          value={searchQuery}
          onChangeText={(text) => {
            setSearchQuery(text);
            searchJobs(text);
          }}
        />
      </View>
      <FlatList
        data={jobs}
        renderItem={renderJobItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchContainer: {
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  searchInput: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  listContainer: {
    padding: 15,
  },
  jobCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  jobDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  jobDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  jobBudget: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  jobLocation: {
    fontSize: 14,
    color: '#666',
  },
}); 