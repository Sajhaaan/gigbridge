import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../providers/AuthContext';

export default function Login() {
  const router = useRouter();
  const { signIn, user, loading, error, clearError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeField, setActiveField] = useState<string | null>(null);

  // Navigate to dashboard if already logged in
  useEffect(() => {
    if (user) {
      router.replace('/dashboard');
    }
  }, [user, router]);

  // Handle sign in
  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    setIsLoading(true);
    try {
      await signIn(email, password);
      // Navigate to dashboard will happen automatically from the useEffect
    } catch (error) {
      console.error('Sign in error:', error);
      // Don't set alert here as it's already handled in the AuthContext
    } finally {
      setIsLoading(false);
    }
  };

  // Demo account login
  const handleDemoWorkerLogin = () => {
    setEmail('worker@demo.com');
    setPassword('password');
    // Auto-submit after a small delay to show the fields being filled
    setTimeout(() => {
      handleSignIn();
    }, 500);
  };

  const handleDemoBusinessLogin = () => {
    setEmail('business@demo.com');
    setPassword('password');
    // Auto-submit after a small delay
    setTimeout(() => {
      handleSignIn();
    }, 500);
  };

  const focusField = (field: string) => {
    setActiveField(field);
  };

  const blurField = () => {
    setActiveField(null);
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="dark-content" />
      <LinearGradient
        colors={['#f8f8f8', '#ffffff']}
        style={styles.gradient}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to continue</Text>
          </View>
          
          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={[styles.input, activeField === 'email' && styles.inputTextFocused]}
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                placeholderTextColor="#9ca3af"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                onFocus={() => focusField('email')}
                onBlur={blurField}
                returnKeyType="next"
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={[styles.input, activeField === 'password' && styles.inputTextFocused]}
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                placeholderTextColor="#9ca3af"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
                onFocus={() => focusField('password')}
                onBlur={blurField}
                returnKeyType="done"
                onSubmitEditing={handleSignIn}
              />
              <TouchableOpacity
                style={styles.visibilityIcon}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color="#666"
                />
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity
              style={styles.forgotPassword}
              onPress={() => router.push('/auth/forgot-password')}
            >
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.signInButton, (isLoading || loading) && styles.disabledButton]}
              onPress={handleSignIn}
              disabled={isLoading || loading}
            >
              {isLoading || loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.signInButtonText}>Sign In</Text>
              )}
            </TouchableOpacity>
            
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>
            
            <View style={styles.demoContainer}>
              <Text style={styles.demoTitle}>Try with demo accounts</Text>
              <View style={styles.demoButtons}>
                <TouchableOpacity
                  style={styles.demoButton}
                  onPress={handleDemoWorkerLogin}
                  disabled={isLoading || loading}
                >
                  <Ionicons name="person-outline" size={18} color="#4F78FF" />
                  <Text style={styles.demoButtonText}>Worker</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.demoButton}
                  onPress={handleDemoBusinessLogin}
                  disabled={isLoading || loading}
                >
                  <Ionicons name="business-outline" size={18} color="#4F78FF" />
                  <Text style={styles.demoButtonText}>Business</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          
          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account?</Text>
            <TouchableOpacity onPress={() => router.push('/auth/signup')}>
              <Text style={styles.signUpText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  gradient: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  header: {
    marginTop: 20,
    alignItems: 'flex-start',
  },
  backButton: {
    padding: 8,
  },
  titleContainer: {
    marginTop: 20,
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
  },
  form: {
    marginBottom: 24,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    color: '#000000',
  },
  inputTextFocused: {
    borderColor: '#4F78FF',
    borderWidth: 2,
  },
  visibilityIcon: {
    padding: 8,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: '#4F78FF',
    fontSize: 14,
    fontWeight: '600',
  },
  signInButton: {
    backgroundColor: '#4F78FF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4F78FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  disabledButton: {
    opacity: 0.7,
  },
  signInButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e5e5e5',
  },
  dividerText: {
    marginHorizontal: 16,
    color: '#666666',
    fontSize: 14,
  },
  demoContainer: {
    marginBottom: 24,
  },
  demoTitle: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 16,
  },
  demoButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  demoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f4ff',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    flex: 1,
    marginHorizontal: 8,
    borderWidth: 1,
    borderColor: '#e1e7ff',
  },
  demoButtonText: {
    color: '#4F78FF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 'auto',
    paddingTop: 20,
  },
  footerText: {
    color: '#666666',
    fontSize: 14,
  },
  signUpText: {
    color: '#4F78FF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
}); 