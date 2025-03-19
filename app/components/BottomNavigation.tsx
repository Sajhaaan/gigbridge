import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import Animated, { 
  useAnimatedStyle, 
  withSpring,
  withSequence,
  withTiming,
  useSharedValue
} from 'react-native-reanimated';

type Tab = {
  name: string;
  icon: 'home' | 'briefcase' | 'chatbubble' | 'person';
  path: '/dashboard' | '/dashboard/job-listings' | '/dashboard/messages' | '/dashboard/profile';
};

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export default function BottomNavigation() {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  const tabs: Tab[] = [
    { name: 'Home', icon: 'home', path: '/dashboard' },
    { name: 'Jobs', icon: 'briefcase', path: '/dashboard/job-listings' },
    { name: 'Chats', icon: 'chatbubble', path: '/dashboard/messages' },
    { name: 'Profile', icon: 'person', path: '/dashboard/profile' },
  ];

  const handlePress = (path: Tab['path']) => {
    router.push(path);
  };

  return (
    <View style={[styles.wrapper]}>
      <BlurView intensity={80} tint="light" style={[
        styles.container,
        { paddingBottom: Math.max(insets.bottom - 10, 4) }
      ]}>
        {tabs.map((tab) => {
          const isActive = pathname === tab.path;
          return (
            <AnimatedTouchable
              key={tab.name}
              style={[styles.tab]}
              onPress={() => handlePress(tab.path)}
              activeOpacity={0.7}
            >
              <View style={[
                styles.iconContainer, 
                isActive && styles.activeIconContainer
              ]}>
                <Ionicons
                  name={isActive ? tab.icon : `${tab.icon}-outline`}
                  size={22}
                  color={isActive ? '#1A1A1A' : '#666666'}
                  style={styles.icon}
                />
                <Text style={[
                  styles.label,
                  isActive && styles.activeLabel
                ]}>
                  {tab.name}
                </Text>
              </View>
            </AnimatedTouchable>
          );
        })}
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
  },
  container: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingTop: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(241, 243, 245, 0.9)',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  activeIconContainer: {
    backgroundColor: '#F8F9FA',
    borderColor: '#F1F3F5',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  icon: {
    marginBottom: 2,
  },
  label: {
    fontSize: 11,
    color: '#666666',
    fontWeight: '500',
    letterSpacing: 0.1,
    marginTop: 1,
  },
  activeLabel: {
    color: '#1A1A1A',
    fontWeight: '600',
  },
}); 