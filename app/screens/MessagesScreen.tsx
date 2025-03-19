import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  useColorScheme,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '@providers/AuthContext';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MainStackParamList } from '../navigation/types';

type MessagesScreenNavigationProp = NativeStackNavigationProp<MainStackParamList, 'MainTabs'>;

interface Conversation {
  _id: string;
  user: {
    _id: string;
    name: string;
    avatar: string;
  };
  lastMessage: {
    text: string;
    timestamp: string;
    read: boolean;
  };
}

// API Configuration
const API_URL = Platform.select({
  ios: Platform.isTV 
    ? 'http://127.0.0.1:8000/api' // For iOS simulator
    : 'http://172.20.10.4:8000/api', // For physical iOS device
  android: 'http://10.0.2.2:8000/api', // For Android emulator
  default: 'http://localhost:8000/api', // For web/default
});

export default function MessagesScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const navigation = useNavigation<MessagesScreenNavigationProp>();
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  const colors = {
    background: isDark ? '#1A1A1A' : '#F8F9FA',
    text: isDark ? '#FFFFFF' : '#2D3436',
    subtext: isDark ? '#A0A0A0' : '#636E72',
    accent: '#3498DB',
    card: isDark ? '#2D3436' : '#FFFFFF',
    border: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get(`${API_URL}/conversations/${user?.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setConversations(response.data);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 500) {
          Alert.alert(
            'Server Error',
            'There was a problem fetching your conversations. Please try again later.'
          );
        } else if (error.message.includes('Network Error')) {
          Alert.alert(
            'Connection Error',
            'Unable to connect to the server. Please check:\n\n' +
            '1. Is your backend server running?\n' +
            '2. Are you using the correct API URL?\n' +
            '3. Check your internet connection'
          );
        } else {
          Alert.alert('Error', 'An unexpected error occurred while fetching conversations.');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    } else if (days === 1) {
      return 'Yesterday';
    } else if (days < 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const renderConversation = ({ item }: { item: Conversation }) => (
    <TouchableOpacity
      style={[styles.conversationItem, { borderBottomColor: colors.border }]}
      onPress={() => navigation.navigate('Chat', {
        name: item.user.name,
        avatar: item.user.avatar,
        userId: item.user._id,
      })}
    >
      <Image source={{ uri: item.user.avatar }} style={styles.avatar} />
      <View style={styles.conversationContent}>
        <View style={styles.conversationHeader}>
          <Text style={[styles.name, { color: colors.text }]}>{item.user.name}</Text>
          <Text style={[styles.timestamp, { color: colors.subtext }]}>
            {formatTimestamp(item.lastMessage.timestamp)}
          </Text>
        </View>
        <View style={styles.messagePreview}>
          <Text
            style={[
              styles.previewText,
              { color: colors.subtext },
              !item.lastMessage.read && styles.unreadText,
            ]}
            numberOfLines={1}
          >
            {item.lastMessage.text}
          </Text>
          {!item.lastMessage.read && (
            <View style={[styles.unreadBadge, { backgroundColor: colors.accent }]}>
              <Text style={styles.unreadBadgeText}>1</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ActivityIndicator size={'large'} color={colors.accent} />
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.text }]}>Messages</Text>
      </View>
      {conversations.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: colors.subtext }]}>
            No messages yet
          </Text>
        </View>
      ) : (
        <FlatList
          data={conversations}
          renderItem={renderConversation}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.list}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  list: {
    flexGrow: 1,
  },
  conversationItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  conversationContent: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
  },
  timestamp: {
    fontSize: 12,
  },
  messagePreview: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  previewText: {
    flex: 1,
    fontSize: 14,
  },
  unreadText: {
    fontWeight: '600',
  },
  unreadBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  unreadBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
  },
}); 