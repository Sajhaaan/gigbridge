import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
  Platform,
  Alert,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../providers/AuthContext';
import { useTheme } from '../providers/ThemeContext';
import { BlurView } from 'expo-blur';
import { MotiView } from 'moti';
import BottomNavigation from '../components/BottomNavigation';

// Minimal color palette
const COLORS = {
  primary: '#FFFFFF', // Pure white
  secondary: '#F8F9FA', // Light gray
  accent: '#4F78FF', // Bright blue
  background: '#FFFFFF', // White background
  text: '#1A1A1A', // Near black
  textSecondary: '#6C757D', // Medium gray
  success: '#2ECC71', // Green
  warning: '#FF6B6B', // Coral
  border: '#E9ECEF', // Light gray border
  shadow: 'rgba(0, 0, 0, 0.05)',
};

const PROFILE_SECTIONS = [
  {
    id: 'personal',
    title: 'Personal Information',
    icon: 'person-outline',
  },
  {
    id: 'skills',
    title: 'Skills & Experience',
    icon: 'briefcase-outline',
  },
  {
    id: 'documents',
    title: 'Documents & Verification',
    icon: 'document-text-outline',
  },
  {
    id: 'preferences',
    title: 'Job Preferences',
    icon: 'settings-outline',
  },
];

type MenuItem = {
  icon: 'person-outline' | 'wallet-outline' | 'star-outline' | 'calendar-outline';
  title: string;
  onPress: () => void;
};

export default function Profile() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { signOut, user } = useAuth();
  const { isDarkMode, theme } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(user?.fullName || '');
  const [editedEmail, setEditedEmail] = useState(user?.email || '');

  const handleSaveProfile = () => {
    setIsEditing(false);
    Alert.alert('Success', 'Profile updated successfully');
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', style: 'destructive', onPress: signOut },
      ]
    );
  };

  const menuItems: MenuItem[] = [
    { icon: "person-outline", title: "Edit Profile", onPress: () => router.push('/dashboard/edit-profile') },
    { icon: "wallet-outline", title: "Earnings", onPress: () => Alert.alert("Coming Soon", "Earnings feature coming soon") },
    { icon: "star-outline", title: "Reviews", onPress: () => Alert.alert("Coming Soon", "Reviews feature coming soon") },
    { icon: "calendar-outline", title: "Availability", onPress: () => Alert.alert("Coming Soon", "Availability feature coming soon") },
  ];

  return (
    <View style={[styles.container, { backgroundColor: COLORS.background, paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity 
          style={styles.headerButton}
          onPress={() => Alert.alert("Coming Soon", "Settings feature coming soon")}
        >
          <Ionicons name="settings-outline" size={24} color={COLORS.text} />
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 90 }]}
      >
        {/* Profile Card */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 500 }}
          style={styles.profileCard}
        >
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <Image 
                source={{ uri: `https://ui-avatars.com/api/?name=${user?.fullName || 'User'}&background=4F78FF&color=fff` }} 
                style={styles.avatar}
              />
              <TouchableOpacity style={styles.editAvatarButton}>
                <Ionicons name="camera" size={20} color={COLORS.primary} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.profileInfo}>
              {isEditing ? (
                <>
                  <TextInput
                    style={styles.editInput}
                    value={editedName}
                    onChangeText={setEditedName}
                    placeholder="Full Name"
                    placeholderTextColor={theme.textSecondary}
                  />
                  <TextInput
                    style={styles.editInput}
                    value={editedEmail}
                    onChangeText={setEditedEmail}
                    placeholder="Email"
                    placeholderTextColor={theme.textSecondary}
                    keyboardType="email-address"
                  />
                </>
              ) : (
                <>
                  <View style={styles.nameContainer}>
                    <Text style={styles.profileName} numberOfLines={1}>
                      {user?.fullName?.split(' ')[0] || 'User'}
                    </Text>
                    <View style={styles.verifiedBadge}>
                      <Ionicons name="checkmark" size={16} color={COLORS.primary} />
                    </View>
                  </View>
                  
                  <View style={styles.rateContainer}>
                    <Ionicons name="cash-outline" size={16} color={COLORS.text} style={styles.rateIcon} />
                    <Text style={styles.rateText}>AED 10 / hr</Text>
                  </View>
                </>
              )}
            </View>
          </View>

          {/* Stats Overview */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Ionicons name="checkmark-circle" size={16} color={COLORS.success} />
              <Text style={styles.statText}>0 Overall Jobs</Text>
            </View>
            
            <Text style={styles.statDivider}>•</Text>
            
            <View style={styles.statItem}>
              <Ionicons name="star" size={16} color="#FFC107" />
              <Text style={styles.statText}>0.0 (0 Reviews)</Text>
            </View>
          </View>

          {isEditing && (
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSaveProfile}
            >
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>
          )}
        </MotiView>
        
        {/* Menu Items */}
        <View style={styles.sectionTitle}>
          <Text style={styles.sectionTitleText}>Account Settings</Text>
        </View>

        <MotiView
          from={{ opacity: 0, translateX: -20 }}
          animate={{ opacity: 1, translateX: 0 }}
          transition={{ delay: 200 }}
          style={styles.menuContainer}
        >
          {menuItems.map((item, index) => (
            <TouchableOpacity 
              key={item.title}
              style={[
                styles.menuItem, 
                { borderBottomWidth: index === menuItems.length - 1 ? 0 : 1 }
              ]} 
              onPress={item.onPress}
            >
              <View style={styles.menuIconContainer}>
                <Ionicons name={item.icon} size={22} color={COLORS.accent} />
              </View>
              <Text style={styles.menuText}>{item.title}</Text>
              <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>
          ))}
        </MotiView>
        
        {/* Sign Out Button */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ delay: 500 }}
          style={styles.signOutContainer}
        >
          <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
            <Ionicons name="log-out-outline" size={24} color={COLORS.primary} />
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
        </MotiView>
      </ScrollView>
      
      <BottomNavigation />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.primary,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.secondary,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  profileCard: {
    borderRadius: 24,
    backgroundColor: COLORS.primary,
    padding: 24,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.1,
        shadowRadius: 16,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    marginRight: 20,
    position: 'relative',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.secondary,
    borderWidth: 3,
    borderColor: COLORS.primary,
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.accent,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.primary,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  profileInfo: {
    flex: 1,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  profileName: {
    fontSize: 26,
    fontWeight: 'bold',
    color: COLORS.text,
    marginRight: 8,
  },
  verifiedBadge: {
    backgroundColor: COLORS.success,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: COLORS.secondary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  rateIcon: {
    marginRight: 6,
  },
  rateText: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    backgroundColor: COLORS.secondary,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: 14,
    color: COLORS.text,
    marginLeft: 6,
    fontWeight: '500',
  },
  statDivider: {
    color: COLORS.textSecondary,
    marginHorizontal: 12,
    fontSize: 8,
  },
  sectionTitle: {
    marginTop: 32,
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  sectionTitleText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },
  menuContainer: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.primary,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    backgroundColor: COLORS.secondary,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.text,
  },
  signOutContainer: {
    marginTop: 24,
    marginBottom: 32,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.warning,
    paddingVertical: 16,
    borderRadius: 16,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  signOutText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
  },
  editInput: {
    fontSize: 16,
    color: COLORS.text,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingVertical: 8,
    marginBottom: 8,
  },
  saveButton: {
    backgroundColor: COLORS.accent,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 16,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  saveButtonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: '600',
  },
}); 