import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
  ActivityIndicator,
  StatusBar,
  Animated,
  Keyboard,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { jobsAPI } from '@/app/services/api';
import { mockJobsAPI } from '@/app/services/mockApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as Animatable from 'react-native-animatable';
import { Stack } from 'expo-router';

export default function PostJobScreen() {
  const router = useRouter();
  const [location, setLocation] = useState('');
  const [jobType, setJobType] = useState('');
  const [salaryRange, setSalaryRange] = useState('');
  const [workersNeeded, setWorkersNeeded] = useState('');
  const [loading, setLoading] = useState(false);
  const [showErrorBanner, setShowErrorBanner] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [activeField, setActiveField] = useState<string | null>(null);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;
  
  // For requirements list
  const [requirements, setRequirements] = useState<string[]>([]);
  const [currentRequirement, setCurrentRequirement] = useState('');
  
  // For responsibilities list
  const [responsibilities, setResponsibilities] = useState<string[]>([]);
  const [currentResponsibility, setCurrentResponsibility] = useState('');
  
  // For benefits list
  const [benefits, setBenefits] = useState<string[]>([]);
  const [currentBenefit, setCurrentBenefit] = useState('');

  // Start fade-in animation on mount
  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);
  
  const focusField = (fieldName: string) => {
    setActiveField(fieldName);
  };
  
  const blurField = () => {
    setActiveField(null);
  };
  
  const getInputStyle = (fieldName: string) => {
    return [
      styles.input,
      activeField === fieldName && styles.inputTextFocused
    ];
  };
  
  const addItem = (type: 'requirements' | 'responsibilities' | 'benefits') => {
    const value = type === 'requirements' 
      ? currentRequirement 
      : type === 'responsibilities' 
        ? currentResponsibility 
        : currentBenefit;
        
    if (!value.trim()) return;
    
    // Animation for adding item
    const itemAddedAnim = new Animated.Value(0);
    Animated.spring(itemAddedAnim, {
      toValue: 1,
      friction: 5,
      tension: 40,
      useNativeDriver: true,
    }).start();
    
    if (type === 'requirements') {
      setRequirements([...requirements, value]);
      setCurrentRequirement('');
    } else if (type === 'responsibilities') {
      setResponsibilities([...responsibilities, value]);
      setCurrentResponsibility('');
    } else {
      setBenefits([...benefits, value]);
      setCurrentBenefit('');
    }
    
    // Hide keyboard after adding item
    Keyboard.dismiss();
  };
  
  const removeItem = (type: 'requirements' | 'responsibilities' | 'benefits', index: number) => {
    if (type === 'requirements') {
      setRequirements(requirements.filter((_, i) => i !== index));
    } else if (type === 'responsibilities') {
      setResponsibilities(responsibilities.filter((_, i) => i !== index));
    } else {
      setBenefits(benefits.filter((_, i) => i !== index));
    }
  };
  
  const handleWorkersNeededChange = (text: string) => {
    // Only allow numbers
    const numbersOnly = text.replace(/[^0-9]/g, '');
    setWorkersNeeded(numbersOnly);
  };
  
  const validateForm = () => {
    if (!location.trim() || !jobType.trim() || !salaryRange.trim() || !workersNeeded.trim()) {
      // Shake animation for error
      Animated.sequence([
        Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true })
      ]).start();
      
      let message = 'Please enter ';
      if (!location.trim()) message += 'location';
      else if (!jobType.trim()) message += 'job type';
      else if (!salaryRange.trim()) message += 'salary range';
      else if (!workersNeeded.trim()) message += 'number of workers needed';
      
      Alert.alert('Missing Information', message);
      return false;
    }

    // Validate workers needed is at least 1
    const workers = parseInt(workersNeeded);
    if (isNaN(workers) || workers < 1) {
      Alert.alert('Invalid Input', 'Please enter at least 1 worker needed');
      return false;
    }

    return true;
  };
  
  const saveJobOffline = async (jobData: any) => {
    try {
      // Get existing offline jobs
      const offlineJobsString = await AsyncStorage.getItem('offlineJobs');
      const offlineJobs = offlineJobsString ? JSON.parse(offlineJobsString) : [];
      
      // Add the new job with a timestamp
      const jobWithTimestamp = {
        ...jobData,
        id: `offline_${Date.now()}`,
        createdAt: new Date().toISOString(),
        status: 'pending'
      };
      
      // Save back to AsyncStorage
      await AsyncStorage.setItem('offlineJobs', JSON.stringify([...offlineJobs, jobWithTimestamp]));
      
      return jobWithTimestamp;
    } catch (error) {
      console.error('Error saving job offline:', error);
      throw new Error('Failed to save job offline');
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    setShowErrorBanner(false);
    
    const jobData = {
      location,
      type: jobType,
      salary: salaryRange,
      workersNeeded: parseInt(workersNeeded) || 1,
      title: jobType,
      description: `Job in ${location} with salary ${salaryRange}. Number of workers needed: ${workersNeeded}`,
      requirements,
      responsibilities,
      benefits
    };
    
    try {
      // First try with the regular API
      const result = await jobsAPI.createJob({
        title: jobData.title,
        description: jobData.description,
        location: jobData.location,
        pay: jobData.salary,
        paymentType: 'Cash',
        startTime: 'Immediately'
      });
      
      // Success feedback
      setLoading(false);
      Alert.alert(
        '✅ Success',
        'Your job has been posted successfully!',
        [{ text: 'View Jobs', onPress: () => router.push('/dashboard/jobs' as any) }]
      );
      
    } catch (error: any) {
      console.error('Error creating job:', error);
      
      try {
        // Try with mock API as fallback
        await mockJobsAPI.createJob({
          title: jobData.title,
          description: jobData.description,
          location: jobData.location,
          pay: jobData.salary,
          paymentType: 'Cash',
          startTime: 'Immediately',
          safetyTags: []
        });
        
        // If mock API succeeds, save offline for later sync
        await saveJobOffline(jobData);
        
        setLoading(false);
        Alert.alert(
          '📱 Saved Offline',
          'Job saved to your device. It will be posted when you reconnect.',
          [{ text: 'OK', onPress: () => router.push('/dashboard/jobs' as any) }]
        );
        
      } catch (fallbackError) {
        // Both APIs failed
        setErrorMessage('Failed to create job listing. Please try again.');
        setShowErrorBanner(true);
        setLoading(false);
        Alert.alert('Error', 'Failed to create job listing. Please try again.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          headerShown: true,
          headerTitle: "Post a Job",
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: '600',
            color: '#1F2937',
          },
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: '#F8FAFC',
          },
          headerLeft: () => (
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons name="chevron-back" size={24} color="#4F78FF" />
            </TouchableOpacity>
          ),
        }} 
      />
      <StatusBar barStyle="dark-content" />
      
      <KeyboardAwareScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <Animated.View 
          style={[
            styles.formCard,
            {opacity: fadeAnim, transform: [{translateX: shakeAnim}]}
          ]}
        >
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Job Details</Text>
            <Text style={styles.sectionDescription}>Fill in the basic information about the job position</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                Location <Text style={styles.required}>*</Text>
              </Text>
              <View style={[styles.inputWrapper, activeField === 'location' && styles.inputWrapperFocused]}>
                <Ionicons name="location-outline" size={22} color={activeField === 'location' ? '#4F78FF' : '#9ca3af'} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, activeField === 'location' && styles.inputTextFocused]}
                  value={location}
                  onChangeText={setLocation}
                  placeholder="Where is the job located?"
                  placeholderTextColor="#9ca3af"
                  onFocus={() => focusField('location')}
                  onBlur={blurField}
                  returnKeyType="next"
                  autoCapitalize="words"
                />
              </View>
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                Job Type <Text style={styles.required}>*</Text>
              </Text>
              <View style={[styles.inputWrapper, activeField === 'jobType' && styles.inputWrapperFocused]}>
                <Ionicons name="briefcase-outline" size={22} color={activeField === 'jobType' ? '#4F78FF' : '#9ca3af'} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, activeField === 'jobType' && styles.inputTextFocused]}
                  value={jobType}
                  onChangeText={setJobType}
                  placeholder="What type of job is this?"
                  placeholderTextColor="#9ca3af"
                  onFocus={() => focusField('jobType')}
                  onBlur={blurField}
                  returnKeyType="next"
                  autoCapitalize="words"
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                Workers Needed <Text style={styles.required}>*</Text>
              </Text>
              <View style={[styles.inputWrapper, activeField === 'workersNeeded' && styles.inputWrapperFocused]}>
                <Ionicons name="people-outline" size={22} color={activeField === 'workersNeeded' ? '#4F78FF' : '#9ca3af'} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, activeField === 'workersNeeded' && styles.inputTextFocused]}
                  value={workersNeeded}
                  onChangeText={handleWorkersNeededChange}
                  placeholder="How many workers do you need?"
                  placeholderTextColor="#9ca3af"
                  onFocus={() => focusField('workersNeeded')}
                  onBlur={blurField}
                  returnKeyType="next"
                  keyboardType="number-pad"
                  maxLength={3}
                />
              </View>
              {workersNeeded && parseInt(workersNeeded) < 1 && (
                <Text style={styles.errorText}>Please enter at least 1 worker</Text>
              )}
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                Salary Range <Text style={styles.required}>*</Text>
              </Text>
              <View style={[styles.inputWrapper, activeField === 'salary' && styles.inputWrapperFocused]}>
                <Ionicons name="cash-outline" size={22} color={activeField === 'salary' ? '#4F78FF' : '#9ca3af'} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, activeField === 'salary' && styles.inputTextFocused]}
                  value={salaryRange}
                  onChangeText={setSalaryRange}
                  placeholder="How much does it pay?"
                  placeholderTextColor="#9ca3af"
                  onFocus={() => focusField('salary')}
                  onBlur={blurField}
                  returnKeyType="done"
                  keyboardType="numeric"
                />
              </View>
            </View>
          </View>
        </Animated.View>

        <Animated.View style={{opacity: fadeAnim}}>
          <View style={[styles.formCard, styles.formCardElevated]}>
            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>
                Requirements
              </Text>
              <Text style={styles.sectionDescription}>What skills or qualifications are needed?</Text>
              
              <View style={styles.inputRow}>
                <View style={[styles.inputWrapper, activeField === 'requirement' && styles.inputWrapperFocused, styles.flexGrow]}>
                  <Ionicons name="list-outline" size={22} color={activeField === 'requirement' ? '#4F78FF' : '#9ca3af'} style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, activeField === 'requirement' && styles.inputTextFocused]}
                    value={currentRequirement}
                    onChangeText={setCurrentRequirement}
                    placeholder="Add required skills"
                    placeholderTextColor="#9ca3af"
                    onFocus={() => focusField('requirement')}
                    onBlur={blurField}
                    onSubmitEditing={() => addItem('requirements')}
                    returnKeyType="done"
                    autoCapitalize="words"
                  />
                </View>
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={() => addItem('requirements')}
                >
                  <Ionicons name="add" size={24} color="#fff" />
                </TouchableOpacity>
              </View>
              
              {requirements.length > 0 && (
                <View style={styles.itemsList}>
                  {requirements.map((item, index) => (
                    <Animatable.View 
                      key={`req-${index}`} 
                      animation="fadeInDown"
                      duration={300}
                      delay={index * 100}
                      style={styles.listItem}
                    >
                      <View style={styles.listItemContent}>
                        <Ionicons name="checkmark-circle" size={20} color="#4F78FF" style={styles.itemIcon} />
                        <Text style={styles.listItemText}>{item}</Text>
                      </View>
                      <TouchableOpacity
                        style={styles.removeButton}
                        onPress={() => removeItem('requirements', index)}
                      >
                        <Ionicons name="close-circle-outline" size={22} color="#ef4444" />
                      </TouchableOpacity>
                    </Animatable.View>
                  ))}
                </View>
              )}
            </View>
          </View>
          
          <View style={[styles.formCard, styles.formCardElevated]}>
            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>
                Responsibilities <Text style={styles.optional}>(Optional)</Text>
              </Text>
              <Text style={styles.sectionDescription}>List the primary duties for this position</Text>
              
              <View style={styles.inputRow}>
                <View style={[styles.inputWrapper, activeField === 'responsibility' && styles.inputWrapperFocused, styles.flexGrow]}>
                  <Ionicons name="document-text-outline" size={22} color={activeField === 'responsibility' ? '#4F78FF' : '#9ca3af'} style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, activeField === 'responsibility' && styles.inputTextFocused]}
                    value={currentResponsibility}
                    onChangeText={setCurrentResponsibility}
                    placeholder="Add job responsibilities"
                    placeholderTextColor="#9ca3af"
                    onFocus={() => focusField('responsibility')}
                    onBlur={blurField}
                    onSubmitEditing={() => addItem('responsibilities')}
                    returnKeyType="done"
                    autoCapitalize="sentences"
                  />
                </View>
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={() => addItem('responsibilities')}
                >
                  <Ionicons name="add" size={24} color="#fff" />
                </TouchableOpacity>
              </View>
              
              {responsibilities.length > 0 && (
                <View style={styles.itemsList}>
                  {responsibilities.map((item, index) => (
                    <Animatable.View 
                      key={`resp-${index}`}
                      animation="fadeInDown"
                      duration={300}
                      delay={index * 100}
                      style={styles.listItem}
                    >
                      <View style={styles.listItemContent}>
                        <Ionicons name="checkmark-circle" size={20} color="#4F78FF" style={styles.itemIcon} />
                        <Text style={styles.listItemText}>{item}</Text>
                      </View>
                      <TouchableOpacity
                        style={styles.removeButton}
                        onPress={() => removeItem('responsibilities', index)}
                      >
                        <Ionicons name="close-circle-outline" size={22} color="#ef4444" />
                      </TouchableOpacity>
                    </Animatable.View>
                  ))}
                </View>
              )}
            </View>
          </View>
          
          <View style={[styles.formCard, styles.formCardElevated]}>
            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>
                Benefits <Text style={styles.optional}>(Optional)</Text>
              </Text>
              <Text style={styles.sectionDescription}>Highlight perks and advantages of this position</Text>
              
              <View style={styles.inputRow}>
                <View style={[styles.inputWrapper, activeField === 'benefit' && styles.inputWrapperFocused, styles.flexGrow]}>
                  <Ionicons name="gift-outline" size={22} color={activeField === 'benefit' ? '#4F78FF' : '#9ca3af'} style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, activeField === 'benefit' && styles.inputTextFocused]}
                    value={currentBenefit}
                    onChangeText={setCurrentBenefit}
                    placeholder="Add job benefits"
                    placeholderTextColor="#9ca3af"
                    onFocus={() => focusField('benefit')}
                    onBlur={blurField}
                    onSubmitEditing={() => addItem('benefits')}
                    returnKeyType="done"
                    autoCapitalize="sentences"
                  />
                </View>
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={() => addItem('benefits')}
                >
                  <Ionicons name="add" size={24} color="#fff" />
                </TouchableOpacity>
              </View>
              
              {benefits.length > 0 && (
                <View style={styles.itemsList}>
                  {benefits.map((item, index) => (
                    <Animatable.View 
                      key={`ben-${index}`}
                      animation="fadeInDown"
                      duration={300}
                      delay={index * 100}
                      style={styles.listItem}
                    >
                      <View style={styles.listItemContent}>
                        <Ionicons name="checkmark-circle" size={20} color="#4F78FF" style={styles.itemIcon} />
                        <Text style={styles.listItemText}>{item}</Text>
                      </View>
                      <TouchableOpacity
                        style={styles.removeButton}
                        onPress={() => removeItem('benefits', index)}
                      >
                        <Ionicons name="close-circle-outline" size={22} color="#ef4444" />
                      </TouchableOpacity>
                    </Animatable.View>
                  ))}
                </View>
              )}
            </View>
          </View>
          
          {showErrorBanner && (
            <View style={styles.errorBanner}>
              <View style={styles.errorIconContainer}>
                <Text style={styles.errorIconText}>3</Text>
              </View>
              <Text style={styles.errorText}>Error creating job: AxiosError: timeout of 15...</Text>
              <TouchableOpacity
                onPress={() => setShowErrorBanner(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close-circle" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          )}
          
          <TouchableOpacity
            activeOpacity={0.8}
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <LinearGradient
              colors={['#4F78FF', '#3B5FE3']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={styles.gradientButton}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <>
                  <Text style={styles.submitButtonText}>Post Job</Text>
                  <Ionicons name="arrow-forward" size={20} color="#fff" style={styles.submitIcon} />
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </KeyboardAwareScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingTop: 8,
    paddingBottom: 32,
  },
  formCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#4F78FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  formCardElevated: {
    shadowColor: '#4F78FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  formSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 20,
    lineHeight: 20,
  },
  required: {
    color: '#EF4444',
    fontWeight: '600',
  },
  optional: {
    fontSize: 13,
    color: '#6b7280',
    fontWeight: '400',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    backgroundColor: '#fff',
    overflow: 'hidden',
    height: 56,
  },
  inputWrapperFocused: {
    borderColor: '#4F78FF',
    backgroundColor: '#F8FAFF',
  },
  inputIcon: {
    padding: 16,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
    paddingRight: 16,
  },
  inputTextFocused: {
    color: '#4F78FF',
  },
  flexGrow: {
    flex: 1,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  addButton: {
    backgroundColor: '#4F78FF',
    width: 56,
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemsList: {
    marginTop: 16,
    gap: 8,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
  },
  listItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  itemIcon: {
    marginRight: 12,
  },
  listItemText: {
    flex: 1,
    fontSize: 15,
    color: '#1F2937',
    lineHeight: 20,
  },
  removeButton: {
    padding: 4,
  },
  submitButton: {
    borderRadius: 16,
    marginTop: 16,
    marginBottom: 24,
    overflow: 'hidden',
    shadowColor: '#4F78FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  gradientButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    gap: 8,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  submitIcon: {
    marginLeft: 4,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1f2937',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#ef4444',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  errorIconText: {
    color: '#fff',
    fontWeight: '700',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  closeButton: {
    padding: 4,
  },
}); 