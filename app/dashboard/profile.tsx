import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../providers/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import BottomNavigation from '../components/BottomNavigation';

export default function Profile() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { signOut, user } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState(false);

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

  const toggleDarkMode = () => {
    setIsDarkMode(previousState => !previousState);
    // Here you would implement the actual theme change logic
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>
      
      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 90 }
        ]}
      >
        <LinearGradient
          colors={['#18181B', '#27272A']}
          style={styles.profileCard}
        >
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <Image 
                source={{ uri: `https://ui-avatars.com/api/?name=${user?.fullName || 'User'}&background=8B5CF6&color=fff` }} 
                style={styles.avatar}
              />
              <TouchableOpacity style={styles.editAvatarButton}>
                <Ionicons name="camera" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.profileInfo}>
              <View style={styles.nameContainer}>
                <Text style={styles.profileName} numberOfLines={1}>{user?.fullName?.split(' ')[0] || 'User'}</Text>
                <View style={styles.verifiedBadge}>
                  <Ionicons name="checkmark" size={16} color="#fff" />
                </View>
              </View>
              
              <Text style={styles.rateText}>AED 10 / hr</Text>
              
              <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                  <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                  <Text style={styles.statText}>0 Overall Jobs</Text>
                </View>
                
                <Text style={styles.statDivider}>|</Text>
                
                <View style={styles.statItem}>
                  <Ionicons name="star" size={16} color="#FFC107" />
                  <Text style={styles.statText}>0.0 (0 Reviews)</Text>
                </View>
              </View>
            </View>
          </View>
        </LinearGradient>
        
        <View style={styles.menuContainer}>
          <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/dashboard/edit-profile')}>
            <View style={styles.menuIconContainer}>
              <Ionicons name="person-outline" size={24} color="#8B5CF6" />
            </View>
            <Text style={styles.menuText}>Edit Profile</Text>
            <Ionicons name="chevron-forward" size={20} color="#A1A1AA" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem} onPress={() => handleMenuPress("Earnings")}>
            <View style={styles.menuIconContainer}>
              <Ionicons name="wallet-outline" size={24} color="#8B5CF6" />
            </View>
            <Text style={styles.menuText}>Earnings</Text>
            <Ionicons name="chevron-forward" size={20} color="#A1A1AA" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem} onPress={() => handleMenuPress("Reviews")}>
            <View style={styles.menuIconContainer}>
              <Ionicons name="star-outline" size={24} color="#8B5CF6" />
            </View>
            <Text style={styles.menuText}>Reviews</Text>
            <Ionicons name="chevron-forward" size={20} color="#A1A1AA" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem} onPress={() => handleMenuPress("Availability")}>
            <View style={styles.menuIconContainer}>
              <Ionicons name="calendar-outline" size={24} color="#8B5CF6" />
            </View>
            <Text style={styles.menuText}>Availability</Text>
            <Ionicons name="chevron-forward" size={20} color="#A1A1AA" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem} onPress={() => handleMenuPress("Settings")}>
            <View style={styles.menuIconContainer}>
              <Ionicons name="settings-outline" size={24} color="#8B5CF6" />
            </View>
            <Text style={styles.menuText}>Settings</Text>
            <Ionicons name="chevron-forward" size={20} color="#A1A1AA" />
          </TouchableOpacity>

          <View style={styles.menuItem}>
            <View style={styles.menuIconContainer}>
              <Ionicons name={isDarkMode ? "moon" : "sunny-outline"} size={24} color="#8B5CF6" />
            </View>
            <Text style={styles.menuText}>Dark Mode</Text>
            <Switch
              trackColor={{ false: "#27272A", true: "#8B5CF6" }}
              thumbColor={"#fff"}
              ios_backgroundColor="#27272A"
              onValueChange={toggleDarkMode}
              value={isDarkMode}
            />
          </View>
        </View>
        
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
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
    backgroundColor: '#000000',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#27272A',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  profileCard: {
    marginTop: 20,
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#27272A',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 3,
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
    backgroundColor: '#27272A',
    borderWidth: 3,
    borderColor: '#18181B',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#8B5CF6',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#18181B',
  },
  profileInfo: {
    flex: 1,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginRight: 8,
  },
  verifiedBadge: {
    backgroundColor: '#8B5CF6',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rateText: {
    fontSize: 16,
    color: '#A1A1AA',
    marginBottom: 8,
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
    color: '#A1A1AA',
    marginLeft: 4,
  },
  statDivider: {
    color: '#A1A1AA',
    marginHorizontal: 8,
  },
  menuContainer: {
    marginTop: 24,
    borderRadius: 16,
    backgroundColor: '#18181B',
    borderWidth: 1,
    borderColor: '#27272A',
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#27272A',
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: '#18181B',
    borderWidth: 1,
    borderColor: '#27272A',
  },
  logoutText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#F87171',
  },
}); 