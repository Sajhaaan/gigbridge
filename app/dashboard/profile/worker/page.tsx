"use client";

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#111827',
  },
  subtitle: {
    fontSize: 16,
    color: '#4b5563',
  },
  progressCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  progressPercentage: {
    fontSize: 14,
    fontWeight: '500',
    color: '#3b82f6',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3b82f6',
    width: '75%',
  },
  verificationGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16,
  },
  verificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    padding: 12,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    marginBottom: 16,
  },
  tab: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: '#3b82f6',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  tabTextActive: {
    color: '#3b82f6',
  },
  form: {
    marginTop: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    color: '#374151',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  photoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadButton: {
    marginLeft: 20,
    padding: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
  },
  uploadButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16,
  },
  skillButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: '#e5e7eb',
  },
  skillButtonSelected: {
    backgroundColor: '#3b82f6',
  },
  skillText: {
    fontSize: 14,
    color: '#374151',
  },
  skillTextSelected: {
    color: '#fff',
  },
});

const skills = [
  "JavaScript",
  "React",
  "Node.js",
  "Python",
  "UI/UX Design",
  "Project Management",
  "Customer Service",
  "Sales",
  "Marketing",
  "Data Analysis",
  // Add more skills as needed
];

interface Availability {
  day: string;
  morning: boolean;
  afternoon: boolean;
  evening: boolean;
}

export default function WorkerProfile() {
  const [activeTab, setActiveTab] = useState("basic");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [availability, setAvailability] = useState<Availability[]>([
    { day: "Monday", morning: false, afternoon: false, evening: false },
    { day: "Tuesday", morning: false, afternoon: false, evening: false },
    { day: "Wednesday", morning: false, afternoon: false, evening: false },
    { day: "Thursday", morning: false, afternoon: false, evening: false },
    { day: "Friday", morning: false, afternoon: false, evening: false },
    { day: "Saturday", morning: false, afternoon: false, evening: false },
    { day: "Sunday", morning: false, afternoon: false, evening: false },
  ]);
  const [verificationStatus, setVerificationStatus] = useState({
    email: true,
    phone: false,
    id: false,
    background: false,
  });

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill)
        ? prev.filter((s) => s !== skill)
        : [...prev, skill]
    );
  };

  const toggleAvailability = (
    day: string,
    timeSlot: "morning" | "afternoon" | "evening"
  ) => {
    setAvailability((prev) =>
      prev.map((d) =>
        d.day === day ? { ...d, [timeSlot]: !d[timeSlot] } : d
      )
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Worker Profile</Text>
        <Text style={styles.subtitle}>
          Complete your profile to start finding jobs that match your skills and
          availability.
        </Text>
      </View>

      {/* Profile Progress */}
      <View style={styles.progressCard}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressTitle}>Profile Completion</Text>
          <Text style={styles.progressPercentage}>75%</Text>
        </View>
        <View style={styles.progressBar}>
          <View style={styles.progressFill} />
        </View>
        <View style={styles.verificationGrid}>
          {Object.entries(verificationStatus).map(([key, verified]) => (
            <View key={key} style={styles.verificationItem}>
              <Ionicons
                name={verified ? "checkmark-circle" : "alert-circle"}
                size={20}
                color={verified ? "#22c55e" : "#eab308"}
              />
              <Text
                style={[
                  styles.tabText,
                  {
                    color: verified ? "#22c55e" : "#eab308",
                    marginLeft: 8,
                  },
                ]}
              >
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Profile Tabs */}
      <View style={styles.tabContainer}>
        {["basic", "skills", "availability", "documents"].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.tabTextActive,
              ]}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Basic Information */}
      {activeTab === "basic" && (
        <View style={styles.form}>
          <View style={styles.photoContainer}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={48} color="#6b7280" />
            </View>
            <TouchableOpacity style={styles.uploadButton}>
              <Text style={styles.uploadButtonText}>Upload Photo</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>First Name</Text>
            <TextInput style={styles.input} placeholder="Enter your first name" />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Last Name</Text>
            <TextInput style={styles.input} placeholder="Enter your last name" />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Location</Text>
            <TextInput style={styles.input} placeholder="Enter your location" />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Bio</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Tell us about yourself..."
              multiline
              numberOfLines={4}
            />
          </View>
        </View>
      )}

      {/* Skills */}
      {activeTab === "skills" && (
        <View style={styles.form}>
          <Text style={styles.title}>Select your skills</Text>
          <View style={styles.skillsContainer}>
            {skills.map((skill) => (
              <TouchableOpacity
                key={skill}
                style={[
                  styles.skillButton,
                  selectedSkills.includes(skill) && styles.skillButtonSelected,
                ]}
                onPress={() => toggleSkill(skill)}
              >
                <Text
                  style={[
                    styles.skillText,
                    selectedSkills.includes(skill) && styles.skillTextSelected,
                  ]}
                >
                  {skill}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Availability */}
      {activeTab === "availability" && (
        <View style={styles.form}>
          <Text style={styles.title}>Set your availability</Text>
          {availability.map((day) => (
            <View key={day.day} style={styles.inputContainer}>
              <Text style={styles.label}>{day.day}</Text>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                {["morning", "afternoon", "evening"].map((timeSlot) => (
                  <TouchableOpacity
                    key={timeSlot}
                    style={[
                      styles.skillButton,
                      day[timeSlot as keyof Availability] && styles.skillButtonSelected,
                    ]}
                    onPress={() => toggleAvailability(day.day, timeSlot as any)}
                  >
                    <Text
                      style={[
                        styles.skillText,
                        day[timeSlot as keyof Availability] && styles.skillTextSelected,
                      ]}
                    >
                      {timeSlot.charAt(0).toUpperCase() + timeSlot.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Documents */}
      {activeTab === "documents" && (
        <View style={styles.form}>
          <Text style={styles.title}>Upload Documents</Text>
          <Text style={styles.subtitle}>
            Upload your resume, certifications, and other relevant documents.
          </Text>
          <TouchableOpacity style={styles.uploadButton}>
            <Text style={styles.uploadButtonText}>Upload Documents</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
} 