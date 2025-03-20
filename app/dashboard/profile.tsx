import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  StatusBar,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../providers/AuthContext';
import { useTheme } from '../providers/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import BottomNavigation from '../components/BottomNavigation';

export default function Profile() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { signOut, user } = useAuth();
  const { isDarkMode, theme } = useTheme();

  const handleLogout = () => {
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Log Out", 
          style: "destructive",
          onPress: () => signOut()
        }
      ]
    );
  };

  const handleMenuPress = (feature: string) => {
    Alert.alert("Coming Soon", `${feature} feature coming soon`);
  };

  const menuItems = [
    { icon: "person-outline" as const, title: "Edit Profile", onPress: () => router.push('/dashboard/edit-profile') },
    { icon: "wallet-outline" as const, title: "Earnings", onPress: () => handleMenuPress("Earnings") },
    { icon: "star-outline" as const, title: "Reviews", onPress: () => handleMenuPress("Reviews") },
    { icon: "calendar-outline" as const, title: "Availability", onPress: () => handleMenuPress("Availability") },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.background, paddingTop: insets.top }]}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
      <View style={[styles.header, { borderBottomColor: theme.border, backgroundColor: theme.background }]}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Profile</Text>
        <TouchableOpacity 
          style={[styles.headerButton, { backgroundColor: isDarkMode ? '#27272A' : '#F8F9FA' }]}
          onPress={() => handleMenuPress("Settings")}
        >
          <Ionicons name="settings-outline" size={24} color={theme.text} />
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 90 }
        ]}
      >
        <Animated.View 
          entering={FadeInDown.delay(100)}
          style={[styles.profileCard, isDarkMode && styles.profileCardDark]}
        >
          <LinearGradient
            colors={isDarkMode ? ['#3D5CDB', '#2A3D99'] : ['#4F78FF', '#3D5CDB']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.profileCardGradient}
          >
            <View style={styles.profileHeader}>
              <View style={styles.avatarContainer}>
                <Image 
                  source={{ uri: `https://ui-avatars.com/api/?name=${user?.fullName || 'User'}&background=4F78FF&color=fff` }} 
                  style={styles.avatar}
                />
                <TouchableOpacity style={styles.editAvatarButton}>
                  <Ionicons name="camera" size={20} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.profileInfo}>
                <View style={styles.nameContainer}>
                  <Text style={styles.profileName} numberOfLines={1}>
                    {user?.fullName?.split(' ')[0] || 'User'}
                  </Text>
                  <View style={styles.verifiedBadge}>
                    <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                  </View>
                </View>
                
                <View style={styles.rateContainer}>
                  <Ionicons name="cash-outline" size={16} color="#FFFFFF" style={styles.rateIcon} />
                  <Text style={styles.rateText}>AED 10 / hr</Text>
                </View>
                
                <View style={styles.statsContainer}>
                  <View style={styles.statItem}>
                    <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                    <Text style={styles.statText}>0 Overall Jobs</Text>
                  </View>
                  
                  <Text style={styles.statDivider}>•</Text>
                  
                  <View style={styles.statItem}>
                    <Ionicons name="star" size={16} color="#FFC107" />
                    <Text style={styles.statText}>0.0 (0 Reviews)</Text>
                  </View>
                </View>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>
        
        <View style={styles.sectionTitle}>
          <Text style={[styles.sectionTitleText, { color: theme.subText }]}>Account Settings</Text>
        </View>

        <Animated.View 
          entering={FadeInDown.delay(200)}
          style={[styles.menuContainer, { backgroundColor: theme.card, borderColor: theme.border }]}
        >
          {menuItems.map((item, index) => (
            <TouchableOpacity 
              key={item.title}
              style={[
                styles.menuItem, 
                { 
                  borderBottomColor: theme.border,
                  borderBottomWidth: index === menuItems.length - 1 ? 0 : 1 
                }
              ]} 
              onPress={item.onPress}
            >
              <View style={[styles.menuIconContainer, { backgroundColor: isDarkMode ? '#27272A' : '#F8F9FA' }]}>
                <Ionicons name={item.icon} size={22} color={theme.menuIcon} />
              </View>
              <Text style={[styles.menuText, { color: theme.text }]}>{item.title}</Text>
              <Ionicons name="chevron-forward" size={20} color={theme.subText} />
            </TouchableOpacity>
          ))}
        </Animated.View>
        
        <TouchableOpacity 
          style={[styles.logoutButton, { backgroundColor: isDarkMode ? '#27272A' : '#FEE2E2' }]}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <Ionicons name="log-out-outline" size={20} color="#F87171" />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
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
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  profileCard: {
    borderRadius: 20,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#4F78FF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  profileCardDark: {
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
      },
    }),
  },
  profileCardGradient: {
    padding: 24,
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
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#FFFFFF',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#4F78FF',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginRight: 8,
  },
  verifiedBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  rateIcon: {
    marginRight: 6,
  },
  rateText: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: 14,
    color: '#FFFFFF',
    marginLeft: 6,
  },
  statDivider: {
    color: '#FFFFFF',
    opacity: 0.5,
    marginHorizontal: 12,
    fontSize: 8,
  },
  sectionTitle: {
    marginTop: 32,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  sectionTitleText: {
    fontSize: 16,
    fontWeight: '600',
  },
  menuContainer: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  menuIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 32,
    marginBottom: 16,
    paddingVertical: 16,
    borderRadius: 12,
  },
  logoutText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#F87171',
  },
}); 