import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { 
  FadeIn, 
  FadeInUp, 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming,
  Easing,
  interpolate,
  withRepeat
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

export default function Welcome() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  // Animation values
  const pulseAnim = useSharedValue(0);
  
  // Start the pulse animation
  React.useEffect(() => {
    pulseAnim.value = withRepeat(
      withTiming(1, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
      -1, // infinite repeat
      true // reverse
    );
  }, []);
  
  // Animated styles for decorative elements
  const decorCircleStyle1 = useAnimatedStyle(() => {
    const scale = interpolate(
      pulseAnim.value,
      [0, 1],
      [1, 1.12]
    );
    
    return {
      transform: [{ scale }]
    };
  });
  
  const decorCircleStyle2 = useAnimatedStyle(() => {
    const scale = interpolate(
      pulseAnim.value,
      [0, 1],
      [1, 1.2]
    );
    
    return {
      transform: [{ scale }]
    };
  });
  
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={['#18181B', '#0F172A']}
        style={styles.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      />
      
      <View style={[styles.content, { paddingBottom: insets.bottom + 20, paddingTop: insets.top + 60 }]}>
        <Animated.View entering={FadeIn.duration(800)} style={styles.headerContainer}>
          <Text style={styles.tagline}>Work on your terms</Text>
          <Text style={styles.header}>Your gateway to flexible work</Text>
          <Text style={styles.subheader}>
            Connect with opportunities that match your skills and schedule
          </Text>
        </Animated.View>
        
        <View style={styles.decorationTop}>
          <Animated.View style={[styles.decorationCircle, styles.decorationCircleLarge, decorCircleStyle1]}>
            <LinearGradient
              colors={['rgba(139, 92, 246, 0.1)', 'rgba(79, 70, 229, 0.05)']}
              style={styles.decorGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
          </Animated.View>
          <Animated.View style={[styles.decorationCircle, styles.decorationCircleSmall, decorCircleStyle2]}>
            <LinearGradient
              colors={['rgba(139, 92, 246, 0.15)', 'rgba(79, 70, 229, 0.08)']}
              style={styles.decorGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
          </Animated.View>
        </View>
        
        <View style={styles.decorationBottom}>
          <Animated.View style={[styles.decorationCircle, styles.decorationCircleSmall, decorCircleStyle2]}>
            <LinearGradient
              colors={['rgba(139, 92, 246, 0.15)', 'rgba(79, 70, 229, 0.08)']}
              style={styles.decorGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
          </Animated.View>
          <Animated.View style={[styles.decorationCircle, styles.decorationCircleMedium, decorCircleStyle1]}>
            <LinearGradient
              colors={['rgba(139, 92, 246, 0.1)', 'rgba(79, 70, 229, 0.05)']}
              style={styles.decorGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
          </Animated.View>
        </View>
        
        <Animated.View entering={FadeInUp.delay(300).duration(600)} style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.primaryButton}
            activeOpacity={0.9}
            onPress={() => router.push({pathname: '/auth/login'} as any)}
          >
            <LinearGradient
              colors={['#8B5CF6', '#6D28D9']}
              style={styles.primaryButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.primaryButtonText}>Sign In</Text>
              <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
            </LinearGradient>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.secondaryButton}
            activeOpacity={0.9}
            onPress={() => router.push({pathname: '/auth/signup'} as any)}
          >
            <Text style={styles.secondaryButtonText}>Create Account</Text>
          </TouchableOpacity>

          <View style={styles.separator}>
            <View style={styles.separatorLine} />
            <Text style={styles.separatorText}>or</Text>
            <View style={styles.separatorLine} />
          </View>

          <TouchableOpacity
            style={styles.demoButton}
            activeOpacity={0.9}
            onPress={() => router.push({pathname: '/auth/login'} as any)}
          >
            <Ionicons name="play-outline" size={18} color="#6366F1" style={styles.demoButtonIcon} />
            <Text style={styles.demoButtonText}>Try Demo</Text>
          </TouchableOpacity>
          
          <View style={styles.footer}>
            <Text style={styles.footerText}>By continuing, you agree to our</Text>
            <View style={styles.footerLinks}>
              <TouchableOpacity>
                <Text style={styles.footerLink}>Terms of Service</Text>
              </TouchableOpacity>
              <Text style={styles.footerText}> and </Text>
              <TouchableOpacity>
                <Text style={styles.footerLink}>Privacy Policy</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-between',
  },
  headerContainer: {
    marginTop: height * 0.08,
    paddingRight: width * 0.15,
  },
  tagline: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8B5CF6',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  header: {
    fontSize: 36,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 16,
    lineHeight: 44,
  },
  subheader: {
    fontSize: 17,
    color: '#A1A1AA',
    lineHeight: 26,
  },
  decorationTop: {
    position: 'absolute',
    top: height * 0.12,
    right: 0,
    alignItems: 'center',
    zIndex: -1,
  },
  decorationBottom: {
    position: 'absolute',
    bottom: height * 0.22,
    left: 0,
    alignItems: 'center',
    zIndex: -1,
  },
  decorationCircle: {
    position: 'absolute',
    borderRadius: 999,
    overflow: 'hidden',
  },
  decorGradient: {
    width: '100%',
    height: '100%',
  },
  decorationCircleLarge: {
    width: 140,
    height: 140,
    right: -70,
  },
  decorationCircleMedium: {
    width: 100,
    height: 100,
    left: -50,
  },
  decorationCircleSmall: {
    width: 60,
    height: 60,
    top: 50,
    right: 20,
  },
  buttonContainer: {
    width: '100%',
    marginTop: 'auto',
    marginBottom: height * 0.05,
  },
  primaryButton: {
    borderRadius: 16,
    height: 56,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 4,
  },
  primaryButtonGradient: {
    height: '100%',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  secondaryButton: {
    backgroundColor: '#18181B',
    borderWidth: 1,
    borderColor: '#27272A',
    borderRadius: 16,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  secondaryButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  separator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#27272A',
  },
  separatorText: {
    marginHorizontal: 12,
    color: '#A1A1AA',
    fontSize: 14,
  },
  demoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    height: 56,
    backgroundColor: '#18181B',
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#27272A',
  },
  demoButtonIcon: {
    marginRight: 8,
  },
  demoButtonText: {
    color: '#8B5CF6',
    fontWeight: '600',
    fontSize: 16,
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    color: '#A1A1AA',
    fontSize: 13,
  },
  footerLinks: {
    flexDirection: 'row',
    marginTop: 4,
    alignItems: 'center',
  },
  footerLink: {
    color: '#8B5CF6',
    fontSize: 13,
    fontWeight: '500',
  },
});