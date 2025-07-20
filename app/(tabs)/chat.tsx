import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Send, Music, Users } from 'lucide-react-native';
import { useRoom } from '@/hooks/useRoom';

interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  message: string;
  timestamp: Date;
  type: 'message' | 'system';
}

const mockMessages: ChatMessage[] = [
  {
    id: '1',
    userId: 'system',
    userName: 'System',
    message: 'Alex joined the room',
    timestamp: new Date(Date.now() - 300000),
    type: 'system',
  },
  {
    id: '2',
    userId: 'user2',
    userName: 'Sarah',
    message: 'Hey! Great song choice! 🎵',
    timestamp: new Date(Date.now() - 240000),
    type: 'message',
  },
  {
    id: '3',
    userId: 'user1',
    userName: 'You',
    message: 'Thanks! This is my favorite album',
    timestamp: new Date(Date.now() - 180000),
    type: 'message',
  },
  {
    id: '4',
    userId: 'system',
    userName: 'System',
    message: 'Mike joined the room',
    timestamp: new Date(Date.now() - 120000),
    type: 'system',
  },
  {
    id: '5',
    userId: 'user3',
    userName: 'Mike',
    message: 'What are we listening to?',
    timestamp: new Date(Date.now() - 60000),
    type: 'message',
  },
];

export default function ChatScreen() {
  const { room, connectedUsers } = useRoom();
  const [messages, setMessages] = useState<ChatMessage[]>(mockMessages);
  const [inputText, setInputText] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const sendMessage = () => {
    if (!inputText.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      userId: 'user1',
      userName: 'You',
      message: inputText.trim(),
      timestamp: new Date(),
      type: 'message',
    };

    setMessages(prev => [...prev, newMessage]);
    setInputText('');
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderMessage = (message: ChatMessage) => {
    const isOwnMessage = message.userId === 'user1';
    const isSystem = message.type === 'system';

    if (isSystem) {
      return (
        <View key={message.id} style={styles.systemMessage}>
          <Text style={styles.systemMessageText}>{message.message}</Text>
          <Text style={styles.systemMessageTime}>{formatTime(message.timestamp)}</Text>
        </View>
      );
    }

    return (
      <View key={message.id} style={[styles.messageContainer, isOwnMessage && styles.ownMessage]}>
        <View style={[styles.messageBubble, isOwnMessage && styles.ownMessageBubble]}>
          {!isOwnMessage && (
            <Text style={styles.messageUserName}>{message.userName}</Text>
          )}
          <Text style={[styles.messageText, isOwnMessage && styles.ownMessageText]}>
            {message.message}
          </Text>
          <Text style={[styles.messageTime, isOwnMessage && styles.ownMessageTime]}>
            {formatTime(message.timestamp)}
          </Text>
        </View>
      </View>
    );
  };

  if (!room) {
    return (
      <LinearGradient
        colors={['#1F2937', '#111827']}
        style={styles.container}
      >
        <View style={styles.emptyState}>
          <Users size={64} color="#4B5563" />
          <Text style={styles.emptyTitle}>No Active Room</Text>
          <Text style={styles.emptySubtitle}>
            Join a room to start chatting with other listeners
          </Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={['#1F2937', '#111827']}
      style={styles.container}
    >
      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerInfo}>
            <Text style={styles.title}>Room Chat</Text>
            <View style={styles.roomDetails}>
              <Music size={16} color="#8B5CF6" />
              <Text style={styles.roomCode}>{room.code}</Text>
              <Users size={16} color="#9CA3AF" />
              <Text style={styles.userCount}>{connectedUsers.length} online</Text>
            </View>
          </View>
        </View>

        {/* Messages */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.messagesContent}
        >
          {messages.map(renderMessage)}
        </ScrollView>

        {/* Input */}
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.textInput}
              placeholder="Type a message..."
              placeholderTextColor="#6B7280"
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={500}
              onSubmitEditing={sendMessage}
              blurOnSubmit={false}
            />
            <TouchableOpacity 
              style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
              onPress={sendMessage}
              disabled={!inputText.trim()}
            >
              <LinearGradient
                colors={inputText.trim() ? ['#8B5CF6', '#EC4899'] : ['#4B5563', '#4B5563']}
                style={styles.sendButtonGradient}
              >
                <Send size={20} color="#FFFFFF" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
    paddingTop: 60,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(75, 85, 99, 0.3)',
  },
  headerInfo: {
    alignItems: 'center',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  roomDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  roomCode: {
    color: '#8B5CF6',
    fontSize: 14,
    fontWeight: '600',
  },
  userCount: {
    color: '#9CA3AF',
    fontSize: 14,
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  messagesContent: {
    paddingTop: 16,
    paddingBottom: 20,
  },
  messageContainer: {
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  ownMessage: {
    alignItems: 'flex-end',
  },
  messageBubble: {
    backgroundColor: 'rgba(55, 65, 81, 0.8)',
    borderRadius: 16,
    padding: 12,
    maxWidth: '80%',
    borderBottomLeftRadius: 4,
  },
  ownMessageBubble: {
    backgroundColor: 'rgba(139, 92, 246, 0.8)',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 4,
  },
  messageUserName: {
    color: '#8B5CF6',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  messageText: {
    color: '#FFFFFF',
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 4,
  },
  ownMessageText: {
    color: '#FFFFFF',
  },
  messageTime: {
    color: '#9CA3AF',
    fontSize: 12,
  },
  ownMessageTime: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  systemMessage: {
    alignItems: 'center',
    marginBottom: 16,
  },
  systemMessageText: {
    color: '#6B7280',
    fontSize: 14,
    fontStyle: 'italic',
  },
  systemMessageTime: {
    color: '#4B5563',
    fontSize: 12,
    marginTop: 2,
  },
  inputContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(75, 85, 99, 0.3)',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: 'rgba(55, 65, 81, 0.5)',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 48,
  },
  textInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
    maxHeight: 100,
    paddingVertical: 8,
  },
  sendButton: {
    marginLeft: 12,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendButtonGradient: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    color: '#9CA3AF',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
});