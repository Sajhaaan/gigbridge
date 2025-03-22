import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Platform,
  StatusBar,
  KeyboardAvoidingView,
  Animated,
  Easing,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { jobsAPI } from '../services/api';

// Payment type options
const PAYMENT_TYPES = ['Cash', 'UPI'];
const SAFETY_TAGS = [
  'Women-friendly workspace',
  'PPE provided',
  'Meals provided',
  'Regular breaks',
  'Transport provided',
];

export default function PostJob() {
  const router = useRouter();
  const [role, setRole] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [pay, setPay] = useState('');
  const [paymentType, setPaymentType] = useState(PAYMENT_TYPES[0]);
  const [startTime, setStartTime] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  
  // Start entry animation on component mount
  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.back(1.5)),
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  const toggleTag = (tag: string) => {
    const animatedScale = new Animated.Value(selectedTags.includes(tag) ? 1 : 0.9);
    
    Animated.spring(animatedScale, {
      toValue: selectedTags.includes(tag) ? 0.9 : 1,
      friction: 4,
      useNativeDriver: true,
    }).start();
    
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!role.trim()) newErrors.role = 'Job title is required';
    if (!description.trim()) newErrors.description = 'Description is required';
    if (!location.trim()) newErrors.location = 'Location is required';
    if (!pay.trim()) newErrors.pay = 'Pay amount is required';
    if (!startTime.trim()) newErrors.startTime = 'Start time is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePost = async () => {
    if (!validateForm()) {
      const errorAnimation = new Animated.Value(0);
      
      Animated.sequence([
        Animated.timing(errorAnimation, {
          toValue: 10,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(errorAnimation, {
          toValue: -10,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(errorAnimation, {
          toValue: 10,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(errorAnimation, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        })
      ]).start();
      
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      // Create job data object
      const jobData = {
        title: role,
        description,
        location,
        pay,
        paymentType,
        startTime,
        safetyTags: selectedTags,
      };

      // Call API to create job
      const result = await jobsAPI.createJob(jobData);
      
      setIsSubmitting(false);
      
      // Reset form fields after successful submission
      setRole('');
      setDescription('');
      setLocation('');
      setPay('');
      setStartTime('');
      setSelectedTags([]);
      
      Alert.alert(
        'Success',
        'Your job has been posted successfully!',
        [
          {
            text: 'View Jobs',
            onPress: () => router.push({pathname: '/dashboard/jobs/manage'} as any),
          },
        ]
      );
      
    } catch (error: any) {
      setIsSubmitting(false);
      
      console.error('Error posting job:', error);
      const errorMessage = error.response?.data?.message || 'Failed to post job. Please try again.';
      Alert.alert('Error', errorMessage);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <LinearGradient
        colors={['#f8f9ff', '#ffffff']}
        style={styles.header}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Post a New Job</Text>
        <View style={styles.placeholder} />
      </LinearGradient>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.formContainer}
      >
        <Animated.ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          style={{
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }]
          }}
        >
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Basic Details</Text>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Job Title/Role*</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="briefcase-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, errors.role && styles.inputError]}
                  placeholder="e.g., Waiters needed"
                  value={role}
                  onChangeText={(text) => {
                    setRole(text);
                    if (errors.role) {
                      const newErrors = {...errors};
                      delete newErrors.role;
                      setErrors(newErrors);
                    }
                  }}
                  placeholderTextColor="#9CA3AF"
                />
              </View>
              {errors.role && (
                <Animated.View>
                  <Text style={styles.errorText}>
                    <Ionicons name="alert-circle" size={14} color="#FF4D4F" /> {errors.role}
                  </Text>
                </Animated.View>
              )}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Description*</Text>
              <View style={[styles.inputWrapper, styles.textAreaWrapper]}>
                <Ionicons name="document-text-outline" size={20} color="#9CA3AF" style={[styles.inputIcon, {alignSelf: 'flex-start', marginTop: 12}]} />
                <TextInput
                  style={[styles.input, styles.textArea, errors.description && styles.inputError]}
                  placeholder="Describe the job responsibilities..."
                  value={description}
                  onChangeText={(text) => {
                    setDescription(text);
                    if (errors.description) {
                      const newErrors = {...errors};
                      delete newErrors.description;
                      setErrors(newErrors);
                    }
                  }}
                  placeholderTextColor="#9CA3AF"
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>
              {errors.description && (
                <Animated.View>
                  <Text style={styles.errorText}>
                    <Ionicons name="alert-circle" size={14} color="#FF4D4F" /> {errors.description}
                  </Text>
                </Animated.View>
              )}
            </View>
          </View>
          
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Location & Payment</Text>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Location*</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="location-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, errors.location && styles.inputError]}
                  placeholder="e.g., Mumbai"
                  value={location}
                  onChangeText={(text) => {
                    setLocation(text);
                    if (errors.location) {
                      const newErrors = {...errors};
                      delete newErrors.location;
                      setErrors(newErrors);
                    }
                  }}
                  placeholderTextColor="#9CA3AF"
                />
              </View>
              {errors.location && (
                <Animated.View>
                  <Text style={styles.errorText}>
                    <Ionicons name="alert-circle" size={14} color="#FF4D4F" /> {errors.location}
                  </Text>
                </Animated.View>
              )}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Pay (₹)*</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="cash-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, errors.pay && styles.inputError]}
                  placeholder="e.g., 500/day"
                  value={pay}
                  onChangeText={(text) => {
                    setPay(text);
                    if (errors.pay) {
                      const newErrors = {...errors};
                      delete newErrors.pay;
                      setErrors(newErrors);
                    }
                  }}
                  placeholderTextColor="#9CA3AF"
                  keyboardType="number-pad"
                />
              </View>
              {errors.pay && (
                <Animated.View>
                  <Text style={styles.errorText}>
                    <Ionicons name="alert-circle" size={14} color="#FF4D4F" /> {errors.pay}
                  </Text>
                </Animated.View>
              )}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Payment Type</Text>
              <View style={styles.optionContainer}>
                {PAYMENT_TYPES.map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.paymentTypeOption,
                      paymentType === type && styles.paymentTypeSelected,
                    ]}
                    onPress={() => setPaymentType(type)}
                  >
                    <Ionicons
                      name={type === 'Cash' ? 'cash-outline' : 'phone-portrait-outline'}
                      size={18}
                      color={paymentType === type ? '#FFFFFF' : '#666666'}
                    />
                    <Text
                      style={[
                        styles.paymentTypeText,
                        paymentType === type && styles.paymentTypeTextSelected,
                      ]}
                    >
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
          
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Schedule & Tags</Text>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Start Time*</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="time-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, errors.startTime && styles.inputError]}
                  placeholder="e.g., 2h from now, or Tomorrow 9AM"
                  value={startTime}
                  onChangeText={(text) => {
                    setStartTime(text);
                    if (errors.startTime) {
                      const newErrors = {...errors};
                      delete newErrors.startTime;
                      setErrors(newErrors);
                    }
                  }}
                  placeholderTextColor="#9CA3AF"
                />
              </View>
              {errors.startTime && (
                <Animated.View>
                  <Text style={styles.errorText}>
                    <Ionicons name="alert-circle" size={14} color="#FF4D4F" /> {errors.startTime}
                  </Text>
                </Animated.View>
              )}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Safety Tags <Text style={styles.optionalText}>(Optional)</Text></Text>
              <Text style={styles.tagHint}>Select all that apply:</Text>
              <View style={styles.tagsContainer}>
                {SAFETY_TAGS.map((tag) => (
                  <TouchableOpacity
                    key={tag}
                    activeOpacity={0.8}
                    style={[
                      styles.tagOption,
                      selectedTags.includes(tag) && styles.tagSelected,
                    ]}
                    onPress={() => toggleTag(tag)}
                  >
                    {selectedTags.includes(tag) && (
                      <Ionicons name="checkmark" size={16} color="#fff" style={styles.checkIcon} />
                    )}
                    <Text
                      style={[
                        styles.tagText,
                        selectedTags.includes(tag) && styles.tagTextSelected,
                      ]}
                    >
                      {tag}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.postButton, isSubmitting && styles.postButtonDisabled]}
            onPress={handlePost}
            disabled={isSubmitting}
            activeOpacity={0.7}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <LinearGradient
                colors={['#4F78FF', '#5885FF']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.postButtonGradient}
              >
                <Ionicons name="paper-plane" size={20} color="#FFFFFF" />
                <Text style={styles.postButtonText}>Post Job</Text>
              </LinearGradient>
            )}
          </TouchableOpacity>
          
          <View style={styles.spacer} />
        </Animated.ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333333',
  },
  placeholder: {
    width: 40,
  },
  formContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  formSection: {
    marginBottom: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 16,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  optionalText: {
    fontSize: 13,
    fontWeight: '400',
    color: '#9CA3AF',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
    overflow: 'hidden',
  },
  textAreaWrapper: {
    alignItems: 'flex-start',
  },
  inputIcon: {
    padding: 12,
  },
  input: {
    flex: 1,
    height: 48,
    paddingHorizontal: 8,
    fontSize: 16,
    color: '#333333',
  },
  textArea: {
    height: 120,
    paddingTop: 12,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: '#FF4D4F',
  },
  errorText: {
    color: '#FF4D4F',
    fontSize: 13,
    marginTop: 6,
    marginLeft: 4,
  },
  optionContainer: {
    flexDirection: 'row',
  },
  paymentTypeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  paymentTypeSelected: {
    backgroundColor: '#4F78FF',
  },
  paymentTypeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
    marginLeft: 6,
  },
  paymentTypeTextSelected: {
    color: '#FFFFFF',
  },
  tagHint: {
    fontSize: 13,
    color: '#9CA3AF',
    marginBottom: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tagOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  tagSelected: {
    backgroundColor: '#4F78FF',
    borderColor: '#4F78FF',
  },
  checkIcon: {
    marginRight: 4,
  },
  tagText: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
  },
  tagTextSelected: {
    color: '#FFFFFF',
  },
  postButton: {
    borderRadius: 12,
    marginTop: 16,
    overflow: 'hidden',
  },
  postButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  postButtonDisabled: {
    opacity: 0.6,
  },
  postButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  spacer: {
    height: 40,
  },
}); 