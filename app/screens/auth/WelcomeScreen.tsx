import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/AuthStack';
import { useAppTheme } from '@providers/ThemeContext';

type WelcomeScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Welcome'>;

export default function WelcomeScreen() {
  const navigation = useNavigation<WelcomeScreenNavigationProp>();
  const theme = useAppTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    gradient: {
      flex: 1,
      justifyContent: 'flex-end',
      paddingBottom: 50,
    },
    content: {
      paddingHorizontal: 30,
    },
    titleContainer: {
      marginBottom: 50,
      marginTop: 'auto',
    },
    title: {
      fontSize: 42,
      fontWeight: 'bold',
      color: theme.text,
      textAlign: 'center',
      marginBottom: 10,
    },
    subtitle: {
      fontSize: 18,
      color: theme.subtext,
      textAlign: 'center',
    },
    buttonContainer: {
      gap: 15,
      marginTop: 30,
    },
    button: {
      width: '100%',
      height: 56,
      borderRadius: 28,
      justifyContent: 'center',
      alignItems: 'center',
    },
    loginButton: {
      backgroundColor: theme.accent,
    },
    signupButton: {
      backgroundColor: 'transparent',
      borderWidth: 2,
      borderColor: theme.accent,
    },
    buttonText: {
      color: '#fff',
      fontSize: 18,
      fontWeight: '600',
    },
    signupButtonText: {
      color: theme.accent,
    },
  });

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={theme.gradients.primary}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>GigBridge</Text>
            <Text style={styles.subtitle}>
              Connect with opportunities, build your future
            </Text>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.loginButton]}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.buttonText}>Log In</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.signupButton]}
              onPress={() => navigation.navigate('Signup')}
            >
              <Text style={[styles.buttonText, styles.signupButtonText]}>
                Create Account
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
} 