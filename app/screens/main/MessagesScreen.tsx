import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Message } from '../../types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MessagesStackParamList } from '../../types/navigation';

type MessagesScreenProps = {
  navigation: NativeStackNavigationProp<MessagesStackParamList, 'MessagesList'>;
};

export default function MessagesScreen({ navigation }: MessagesScreenProps) {
  const [conversations, setConversations] = useState<Message[]>([]);

  React.useEffect(() => {
    // TODO: Implement fetching conversations
    // For now, using mock data
    const mockConversations: Message[] = [
      {
        id: '1',
        content: 'Hi, I am interested in your project',
        senderId: '1',
        sender: {
          id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          userType: 'worker',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        receiverId: '2',
        receiver: {
          id: '2',
          name: 'Jane Smith',
          email: 'jane@example.com',
          userType: 'business',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        jobId: '1',
        job: {
          id: '1',
          title: 'Web Development Project',
          description: 'Looking for a skilled web developer',
          budget: 5000,
          status: 'open',
          category: 'Web Development',
          location: 'Remote',
          businessId: '2',
          business: {
            id: '2',
            name: 'Jane Smith',
            email: 'jane@example.com',
            userType: 'business',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      // Add more mock conversations as needed
    ];
    setConversations(mockConversations);
  }, []);

  const renderConversationItem = ({ item }: { item: Message }) => (
    <TouchableOpacity
      style={styles.conversationCard}
      onPress={() =>
        navigation.navigate('Chat', {
          jobId: item.jobId,
          otherUserId: item.senderId,
          otherUserName: item.sender.name,
        })
      }
    >
      <View style={styles.avatarContainer}>
        <Text style={styles.avatarText}>
          {item.sender.name.charAt(0).toUpperCase()}
        </Text>
      </View>
      <View style={styles.conversationInfo}>
        <Text style={styles.userName}>{item.sender.name}</Text>
        <Text style={styles.jobTitle}>{item.job.title}</Text>
        <Text style={styles.lastMessage} numberOfLines={1}>
          {item.content}
        </Text>
      </View>
      <Text style={styles.timestamp}>
        {new Date(item.createdAt).toLocaleDateString()}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={conversations}
        renderItem={renderConversationItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContainer: {
    padding: 15,
  },
  conversationCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatarText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  conversationInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  jobTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  lastMessage: {
    fontSize: 14,
    color: '#999',
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
    marginLeft: 10,
  },
}); 