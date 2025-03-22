import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Link, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../providers/AuthContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

export default function SignupScreen() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [userType, setUserType] = useState<'worker' | 'hirer' | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { signUp } = useAuth();
  const insets = useSafeAreaInsets();
  const confirmPasswordRef = useRef<TextInput | null>(null);
  const [activeField, setActiveField] = useState<string | null>(null);

  const handleCreateAccount = async () => {
    if (!fullName || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!userType) {
      setError('Please select your user type');
      return;
    }

    setLoading(true);
    try {
      // Convert 'hirer' to 'business' for API compatibility
      const apiUserType: 'worker' | 'business' = userType === 'hirer' ? 'business' : 'worker';
      await signUp(fullName, email, password, apiUserType);
      router.replace('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  const focusField = (field: string) => {
    setActiveField(field);
  };

  const blurField = () => {
    setActiveField(null);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { paddingTop: insets.top }]}
    >
      <StatusBar style="dark" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join our community today</Text>
        </View>

        <View style={styles.form}>
          <View style={[styles.inputContainer, activeField === 'fullName' && styles.inputContainerFocused]}>
            <Ionicons name="person-outline" size={20} color={activeField === 'fullName' ? '#4F78FF' : '#666'} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, activeField === 'fullName' && styles.inputTextFocused]}
              placeholder="Full Name"
              placeholderTextColor="#9ca3af"
              value={fullName}
              onChangeText={setFullName}
              autoCapitalize="words"
              onFocus={() => focusField('fullName')}
              onBlur={blurField}
              returnKeyType="next"
            />
          </View>

          <View style={[styles.inputContainer, activeField === 'email' && styles.inputContainerFocused]}>
            <Ionicons name="mail-outline" size={20} color={activeField === 'email' ? '#4F78FF' : '#666'} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, activeField === 'email' && styles.inputTextFocused]}
              placeholder="Email"
              placeholderTextColor="#9ca3af"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
              onFocus={() => focusField('email')}
              onBlur={blurField}
              returnKeyType="next"
            />
          </View>

          <View style={[styles.inputContainer, styles.passwordContainer, activeField === 'password' && styles.inputContainerFocused]}>
            <Ionicons name="lock-closed-outline" size={20} color={activeField === 'password' ? '#4F78FF' : '#666'} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, styles.passwordInput, activeField === 'password' && styles.inputTextFocused]}
              value={password}
              onChangeText={setPassword}
              placeholder="Create a password"
              placeholderTextColor="#9ca3af"
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
              onFocus={() => focusField('password')}
              onBlur={blurField}
              returnKeyType="next"
              onSubmitEditing={() => {
                confirmPasswordRef.current?.focus();
              }}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeButton}
            >
              <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={24}
                color={activeField === 'password' ? '#4F78FF' : '#666'}
              />
            </TouchableOpacity>
          </View>

          <View style={[styles.inputContainer, styles.passwordContainer, activeField === 'confirmPassword' && styles.inputContainerFocused]}>
            <Ionicons name="lock-closed-outline" size={20} color={activeField === 'confirmPassword' ? '#4F78FF' : '#666'} style={styles.inputIcon} />
            <TextInput
              ref={confirmPasswordRef}
              style={[styles.input, styles.passwordInput, activeField === 'confirmPassword' && styles.inputTextFocused]}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm your password"
              placeholderTextColor="#9ca3af"
              secureTextEntry={!showConfirmPassword}
              autoCapitalize="none"
              autoCorrect={false}
              onFocus={() => focusField('confirmPassword')}
              onBlur={blurField}
              returnKeyType="done"
              onSubmitEditing={handleCreateAccount}
            />
            <TouchableOpacity
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              style={styles.eyeButton}
            >
              <Ionicons
                name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                size={24}
                color={activeField === 'confirmPassword' ? '#4F78FF' : '#666'}
              />
            </TouchableOpacity>
          </View>

          <Text style={styles.roleText}>I want to...</Text>
          <View style={styles.roleContainer}>
            <TouchableOpacity
              style={[
                styles.roleButton,
                userType === 'worker' && styles.roleButtonActive,
                { marginRight: 10 }
              ]}
              onPress={() => setUserType('worker')}
            >
              <Ionicons name="person" size={24} color={userType === 'worker' ? '#fff' : '#4F78FF'} />
              <Text style={[styles.roleButtonText, userType === 'worker' && styles.roleButtonTextActive]}>
                Find Work
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.roleButton,
                userType === 'hirer' && styles.roleButtonActive
              ]}
              onPress={() => setUserType('hirer')}
            >
              <Ionicons name="briefcase" size={24} color={userType === 'hirer' ? '#fff' : '#4F78FF'} />
              <Text style={[styles.roleButtonText, userType === 'hirer' && styles.roleButtonTextActive]}>
                Hire Talent
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.signupButton, loading && styles.signupButtonDisabled]}
            onPress={handleCreateAccount}
            disabled={loading}
          >
            <LinearGradient
              colors={['#4F78FF', '#558BFF']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.signupButtonGradient}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.signupButtonText}>Create Account</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <Link href="/auth/login" asChild>
              <TouchableOpacity>
                <Text style={styles.loginLink}>Sign In</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
  },
  header: {
    marginTop: 20,
    marginBottom: 40,
  },
  backButton: {
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  form: {
    flex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
    height: 56,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  inputContainerFocused: {
    borderColor: '#4F78FF',
    backgroundColor: '#F8FAFF',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#000',
    height: '100%',
    paddingVertical: 8,
  },
  inputTextFocused: {
    color: '#4F78FF',
  },
  passwordContainer: {
    paddingRight: 8,
  },
  passwordInput: {
    paddingRight: 8,
  },
  eyeButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  roleText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
  },
  roleContainer: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  roleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#4F78FF',
  },
  roleButtonActive: {
    backgroundColor: '#4F78FF',
  },
  roleButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#4F78FF',
    fontWeight: '600',
  },
  roleButtonTextActive: {
    color: '#fff',
  },
  signupButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 24,
    elevation: 2,
    shadowColor: '#4F78FF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  signupButtonDisabled: {
    opacity: 0.7,
  },
  signupButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signupButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    color: '#666',
    fontSize: 14,
  },
  loginLink: {
    color: '#4F78FF',
    fontSize: 14,
    fontWeight: '600',
  },
}); 