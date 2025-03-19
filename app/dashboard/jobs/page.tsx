"use client";

import { useState, useRef, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Animated, ScrollView, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

// Mock data - Replace with real data from your API
const jobs = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    company: "TechCorp",
    location: "San Francisco, CA",
    type: "Remote",
    salary: "$70-90/hr",
    posted: "2 hours ago",
    description:
      "We're looking for an experienced frontend developer to join our team...",
    requirements: [
      "5+ years of experience with React",
      "Strong TypeScript skills",
      "Experience with Next.js",
    ],
    match: "95%",
  },
  {
    id: 2,
    title: "UX Designer",
    company: "DesignLabs",
    location: "New York, NY",
    type: "Hybrid",
    salary: "$60-80/hr",
    posted: "1 day ago",
    description:
      "Join our design team to create beautiful and intuitive interfaces...",
    requirements: [
      "3+ years of UX design experience",
      "Proficiency in Figma",
      "Portfolio of work",
    ],
    match: "88%",
  },
  // Add more jobs...
];

const filters = {
  jobType: ["Remote", "On-site", "Hybrid"],
  experience: ["Entry Level", "Mid Level", "Senior Level"],
  salary: ["$30-50/hr", "$50-70/hr", "$70-90/hr", "$90+/hr"],
};

interface SelectedFilters {
  jobType: string[];
  experience: string[];
  salary: string[];
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  searchContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  searchRow: {
    flexDirection: 'row',
    gap: 16,
  },
  searchInput: {
    flex: 1,
    padding: 12,
    paddingLeft: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  filterText: {
    marginLeft: 8,
    color: '#6b7280',
  },
  filterContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  filterGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 24,
  },
  filterSection: {
    flex: 1,
    minWidth: 200,
  },
  filterTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  filterOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  checkbox: {
    width: 16,
    height: 16,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#d1d5db',
    marginRight: 8,
  },
  checkboxChecked: {
    backgroundColor: '#2557a7',
    borderColor: '#2557a7',
  },
  jobCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  jobCompany: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  matchBadge: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 9999,
  },
  matchText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#166534',
  },
  jobDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginTop: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 8,
  },
  jobDescription: {
    fontSize: 14,
    color: '#4b5563',
    marginTop: 16,
  },
  requirementsTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginTop: 16,
  },
  requirementItem: {
    fontSize: 14,
    color: '#4b5563',
    marginTop: 8,
  },
  jobFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
  },
  postedTime: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  applyButton: {
    backgroundColor: '#2557a7',
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 8,
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default function Jobs() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<SelectedFilters>({
    jobType: [],
    experience: [],
    salary: [],
  });
  const [showFilters, setShowFilters] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const filterHeight = useRef(new Animated.Value(0)).current;
  const filterOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(filterHeight, {
        toValue: showFilters ? 1 : 0,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(filterOpacity, {
        toValue: showFilters ? 1 : 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [showFilters]);

  const toggleFilter = (category: keyof SelectedFilters, value: string) => {
    setSelectedFilters((prev) => {
      const current = prev[category];
      return {
        ...prev,
        [category]: current.includes(value)
          ? current.filter((v) => v !== value)
          : [...current, value],
      };
    });
  };

  return (
    <ScrollView style={styles.container}>
      {/* Search and Filter Header */}
      <View style={styles.searchContainer}>
        <View style={styles.searchRow}>
          <View style={{ flex: 1, position: 'relative' }}>
            <Ionicons name="search" size={20} color="#9ca3af" style={{ position: 'absolute', left: 12, top: 14 }} />
            <TextInput
              placeholder="Search jobs..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={styles.searchInput}
            />
          </View>
          <TouchableOpacity
            onPress={() => setShowFilters(!showFilters)}
            style={styles.filterButton}
          >
            <Ionicons name="options-outline" size={20} color="#6b7280" />
            <Text style={styles.filterText}>Filters</Text>
          </TouchableOpacity>
        </View>

        {/* Filters */}
        <Animated.View
          style={[
            styles.filterContainer,
            {
              opacity: filterOpacity,
              height: filterHeight.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 300],
              }),
            },
          ]}
        >
          <View style={styles.filterGrid}>
            {(Object.entries(filters) as [keyof SelectedFilters, string[]][]).map(
              ([category, options]) => (
                <View key={category} style={styles.filterSection}>
                  <Text style={styles.filterTitle}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </Text>
                  {options.map((option) => (
                    <TouchableOpacity
                      key={option}
                      onPress={() =>
                        toggleFilter(category as keyof SelectedFilters, option as string)
                      }
                      style={styles.filterOption}
                    >
                      <View
                        style={[
                          styles.checkbox,
                          selectedFilters[category].includes(option as string) && styles.checkboxChecked,
                        ]}
                      />
                      <Text style={styles.detailText}>{option}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )
            )}
          </View>
        </Animated.View>
      </View>

      {/* Job Listings */}
      <View style={{ marginTop: 24 }}>
        {jobs.map((job) => (
          <View key={job.id} style={styles.jobCard}>
            <View style={styles.jobHeader}>
              <View>
                <Text style={styles.jobTitle}>{job.title}</Text>
                <Text style={styles.jobCompany}>{job.company}</Text>
              </View>
              <View style={styles.matchBadge}>
                <Text style={styles.matchText}>{job.match} match</Text>
              </View>
            </View>

            <View style={styles.jobDetails}>
              <View style={styles.detailItem}>
                <Ionicons name="location-outline" size={20} color="#6b7280" />
                <Text style={styles.detailText}>{job.location}</Text>
              </View>
              <View style={styles.detailItem}>
                <Ionicons name="briefcase-outline" size={20} color="#6b7280" />
                <Text style={styles.detailText}>{job.type}</Text>
              </View>
              <View style={styles.detailItem}>
                <Ionicons name="cash-outline" size={20} color="#6b7280" />
                <Text style={styles.detailText}>{job.salary}</Text>
              </View>
            </View>

            <Text style={styles.jobDescription}>{job.description}</Text>

            <View>
              <Text style={styles.requirementsTitle}>Requirements:</Text>
              {job.requirements.map((req, index) => (
                <Text key={index} style={styles.requirementItem}>
                  • {req}
                </Text>
              ))}
            </View>

            <View style={styles.jobFooter}>
              <View style={styles.postedTime}>
                <Ionicons name="time-outline" size={20} color="#6b7280" />
                <Text style={styles.detailText}>Posted {job.posted}</Text>
              </View>
              <TouchableOpacity style={styles.applyButton}>
                <Text style={styles.applyButtonText}>Apply Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
} 