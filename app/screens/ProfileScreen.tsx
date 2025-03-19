import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
  Alert,
  useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@providers/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../navigation/types';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

type ProfileScreenNavigationProp = NativeStackNavigationProp<MainStackParamList>;

interface MenuItem {
  id: string;
  title: string;
  icon: string;
  onPress: () => void;
  gradient?: string[];
  color?: string;
}

export default function ProfileScreen() {
  const { logout, user } = useAuth();
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const { width } = useWindowDimensions();

  const colors = {
    background: '#F8F9FA',
    card: '#FFFFFF',
    text: '#1A1A1A',
    subtext: '#6B7280',
    accent: '#3B82F6',
    accentLight: '#60A5FA',
    border: '#E5E7EB',
    danger: '#EF4444',
    success: '#10B981',
    warning: '#F59E0B',
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleEditProfile = () => {
    navigation.navigate('EditProfile');
  };

  const MENU_ITEMS: MenuItem[] = [
    {
      id: '1',
      title: 'Edit Profile',
      icon: 'person-outline',
      onPress: handleEditProfile,
      gradient: [colors.accent, colors.accentLight],
    },
    {
      id: '2',
      title: 'Work History',
      icon: 'briefcase-outline',
      onPress: () => Alert.alert('Coming Soon', 'This feature will be available soon!'),
      gradient: ['#10B981', '#34D399'],
    },
    {
      id: '3',
      title: 'Payment Methods',
      icon: 'card-outline',
      onPress: () => Alert.alert('Coming Soon', 'This feature will be available soon!'),
      gradient: ['#F59E0B', '#FBBF24'],
    },
    {
      id: '4',
      title: 'Settings',
      icon: 'settings-outline',
      onPress: () => Alert.alert('Coming Soon', 'This feature will be available soon!'),
      gradient: ['#6366F1', '#818CF8'],
    },
    {
      id: '5',
      title: 'Help & Support',
      icon: 'help-circle-outline',
      onPress: () => Alert.alert('Coming Soon', 'This feature will be available soon!'),
      gradient: ['#8B5CF6', '#A78BFA'],
    },
    {
      id: '6',
      title: 'Logout',
      icon: 'log-out-outline',
      color: colors.danger,
      onPress: handleLogout,
    },
  ];

  const renderMenuItem = (item: MenuItem, index: number) => (
    <Animated.View
      key={item.id}
      entering={FadeInRight.delay(index * 100).springify()}
      style={styles.menuItemContainer}
    >
      <TouchableOpacity
        style={[styles.menuItem, { backgroundColor: colors.card }]}
        onPress={item.onPress}
      >
        <View style={styles.menuItemContent}>
          {item.gradient ? (
            <LinearGradient
              colors={item.gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.iconContainer}
            >
              <Ionicons name={item.icon as any} size={22} color="#FFFFFF" />
            </LinearGradient>
          ) : (
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: `${colors.danger}15` },
              ]}
            >
              <Ionicons
                name={item.icon as any}
                size={22}
                color={item.color || colors.accent}
              />
            </View>
          )}
          <Text
            style={[
              styles.menuItemText,
              { color: item.color || colors.text },
            ]}
          >
            {item.title}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={colors.subtext} />
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Animated.View
          entering={FadeInDown.delay(200).springify()}
          style={[styles.header, { width: width }]}
        >
          <LinearGradient
            colors={[colors.accent, colors.accentLight]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.headerGradient}
          >
            <BlurView intensity={80} style={styles.headerContent}>
              <View style={styles.headerTop}>
                <Text style={styles.headerTitle}>Profile</Text>
                <TouchableOpacity onPress={handleEditProfile}>
                  <Ionicons name="create-outline" size={24} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </BlurView>
          </LinearGradient>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(300).springify()}
          style={[styles.profileCard, { backgroundColor: colors.card }]}
        >
          <View style={styles.avatarContainer}>
            <LinearGradient
              colors={[colors.accent, colors.accentLight]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.avatarGradient}
            >
              <Image
                source={{ uri: user?.avatar || 'https://picsum.photos/200' }}
                style={styles.avatar}
              />
            </LinearGradient>
          </View>

          <View style={styles.profileInfo}>
            <Text style={[styles.name, { color: colors.text }]}>
              {user?.fullName || 'Your Name'}
            </Text>
            <Text style={[styles.email, { color: colors.subtext }]}>
              {user?.email || 'email@example.com'}
            </Text>
          </View>

          <View style={[styles.statsContainer, { borderColor: colors.border }]}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.text }]}>28</Text>
              <Text style={[styles.statLabel, { color: colors.subtext }]}>
                Jobs Done
              </Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.text }]}>4.9</Text>
              <Text style={[styles.statLabel, { color: colors.subtext }]}>
                Rating
              </Text>
            </View>
          </View>
        </Animated.View>

        <View style={styles.menuContainer}>
          {MENU_ITEMS.map((item, index) => renderMenuItem(item, index))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  header: {
    height: 120,
    marginBottom: -60,
  },
  headerGradient: {
    flex: 1,
  },
  headerContent: {
    flex: 1,
    padding: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  profileCard: {
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  avatarContainer: {
    alignItems: 'center',
    marginTop: -40,
  },
  avatarGradient: {
    padding: 3,
    borderRadius: 50,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  profileInfo: {
    alignItems: 'center',
    marginTop: 12,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    paddingTop: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
  },
  statDivider: {
    width: 1,
    height: '100%',
  },
  menuContainer: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  menuItemContainer: {
    marginBottom: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '500',
  },
}); 