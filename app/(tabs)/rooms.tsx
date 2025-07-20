import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Alert, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Plus, Users, Copy, Music, Search } from 'lucide-react-native';
import { useRoom } from '@/hooks/useRoom';
import { useMusicPlayer } from '@/hooks/useMusicPlayer';
import YouTubeSearch from '@/components/YouTubeSearch';
import SyncTunesLogo from '@/components/SyncTunesLogo';
import type { Song } from '@/types/youtube';

export default function RoomsScreen() {
  const { room, createRoom, joinRoom, leaveRoom, connectedUsers } = useRoom();
  const { setCurrentSong } = useMusicPlayer();
  const [roomCode, setRoomCode] = useState('');
  const [showJoinInput, setShowJoinInput] = useState(false);
  const [showYouTubeSearch, setShowYouTubeSearch] = useState(false);

  const handleCreateRoom = async () => {
    try {
      await createRoom();
      Alert.alert('Success', 'Room created successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to create room. Please try again.');
    }
  };

  const handleJoinRoom = async () => {
    if (!roomCode.trim()) {
      Alert.alert('Error', 'Please enter a room code');
      return;
    }
    
    try {
      await joinRoom(roomCode.trim().toUpperCase());
      setRoomCode('');
      setShowJoinInput(false);
      Alert.alert('Success', 'Joined room successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to join room. Please check the room code.');
    }
  };

  const handleLeaveRoom = () => {
    Alert.alert(
      'Leave Room',
      'Are you sure you want to leave this room?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Leave', onPress: leaveRoom, style: 'destructive' },
      ]
    );
  };

  const handleSongSelect = (song: Song) => {
    setCurrentSong(song);
    Alert.alert('Song Selected', `Now playing for everyone: ${song.title} by ${song.artist}`);
  };

  const copyRoomCode = () => {
    if (room?.code) {
      // In a real app, you'd use Clipboard API
      Alert.alert('Copied', `Room code ${room.code} copied to clipboard!`);
    }
  };

  return (
    <LinearGradient
      colors={['#1F2937', '#111827']}
      style={styles.container}
    >
      {/* Logo */}
      <SyncTunesLogo />

      {!room && (
        <View style={styles.header}>
          <Text style={styles.title}>Music Rooms</Text>
          <Text style={styles.subtitle}>Listen together with friends</Text>
        </View>
      )}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {room ? (
          // Current Room Section
          <View style={styles.currentRoomSection}>
            <Text style={styles.sectionTitle}>Current Room</Text>
            <LinearGradient
              colors={['rgba(139, 92, 246, 0.2)', 'rgba(236, 72, 153, 0.1)']}
              style={styles.roomCard}
            >
              <View style={styles.roomHeader}>
                <View style={styles.roomInfo}>
                  <Text style={styles.roomCodeText}>{room.code}</Text>
                  <Text style={styles.roomStatus}>Active</Text>
                </View>
                <TouchableOpacity style={styles.copyButton} onPress={copyRoomCode}>
                  <Copy size={20} color="#8B5CF6" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.roomDetails}>
                <View style={styles.detailItem}>
                  <Users size={16} color="#9CA3AF" />
                  <Text style={styles.detailText}>
                    {connectedUsers.length} {connectedUsers.length === 1 ? 'person' : 'people'} listening
                  </Text>
                </View>
                <View style={styles.detailItem}>
                  <Music size={16} color="#9CA3AF" />
                  <Text style={styles.detailText}>Synchronized playback</Text>
                </View>
                <TouchableOpacity 
                  style={styles.searchSongButton}
                  onPress={() => setShowYouTubeSearch(true)}
                >
                  <Search size={16} color="#8B5CF6" />
                  <Text style={styles.searchSongText}>Search & Play Song</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.connectedUsers}>
                <Text style={styles.usersTitle}>Connected Users:</Text>
                {connectedUsers.map((user, index) => (
                  <View key={index} style={styles.userItem}>
                    <View style={styles.userAvatar}>
                      <Text style={styles.userInitial}>
                        {user.name.charAt(0).toUpperCase()}
                      </Text>
                    </View>
                    <Text style={styles.userName}>{user.name}</Text>
                  </View>
                ))}
              </View>

              <TouchableOpacity style={styles.leaveButton} onPress={handleLeaveRoom}>
                <Text style={styles.leaveButtonText}>Leave Room</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        ) : (
          // No Room Section
          <View style={styles.noRoomSection}>
            <View style={styles.emptyState}>
              <Users size={64} color="#4B5563" />
              <Text style={styles.emptyTitle}>No Active Room</Text>
              <Text style={styles.emptySubtitle}>
                Create or join a room to start listening with friends
              </Text>
            </View>

            {/* Create Room */}
            <TouchableOpacity style={styles.actionCard} onPress={handleCreateRoom}>
              <LinearGradient
                colors={['#8B5CF6', '#EC4899']}
                style={styles.actionCardGradient}
              >
                <Plus size={24} color="#FFFFFF" />
                <Text style={styles.actionCardTitle}>Create New Room</Text>
                <Text style={styles.actionCardSubtitle}>
                  Start a new listening session
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Join Room */}
            <View style={styles.joinSection}>
              {!showJoinInput ? (
                <TouchableOpacity 
                  style={styles.joinButton} 
                  onPress={() => setShowJoinInput(true)}
                >
                  <Users size={20} color="#8B5CF6" />
                  <Text style={styles.joinButtonText}>Join Existing Room</Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.joinInputContainer}>
                  <TextInput
                    style={styles.roomCodeInput}
                    placeholder="Enter room code"
                    placeholderTextColor="#6B7280"
                    value={roomCode}
                    onChangeText={setRoomCode}
                    autoCapitalize="characters"
                    maxLength={6}
                  />
                  <View style={styles.joinInputButtons}>
                    <TouchableOpacity 
                      style={styles.cancelButton}
                      onPress={() => {
                        setShowJoinInput(false);
                        setRoomCode('');
                      }}
                    >
                      <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.joinSubmitButton}
                      onPress={handleJoinRoom}
                    >
                      <Text style={styles.joinSubmitButtonText}>Join</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Features Info */}
        <View style={styles.featuresSection}>
          <Text style={styles.featuresTitle}>Room Features</Text>
          <View style={styles.featuresList}>
            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <Music size={16} color="#8B5CF6" />
              </View>
              <Text style={styles.featureText}>Synchronized playback across all devices</Text>
            </View>
            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <Users size={16} color="#8B5CF6" />
              </View>
              <Text style={styles.featureText}>Up to 10 people per room</Text>
            </View>
            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <Copy size={16} color="#8B5CF6" />
              </View>
              <Text style={styles.featureText}>Easy room sharing with codes</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* YouTube Search Modal */}
      <Modal
        visible={showYouTubeSearch}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        <YouTubeSearch
          onSongSelect={handleSongSelect}
          onClose={() => setShowYouTubeSearch(false)}
        />
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    color: '#9CA3AF',
    fontSize: 16,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  currentRoomSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  roomCard: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
  },
  roomHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  roomInfo: {
    flex: 1,
  },
  roomCodeText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  roomStatus: {
    color: '#10B981',
    fontSize: 14,
    fontWeight: '500',
  },
  copyButton: {
    padding: 8,
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    borderRadius: 8,
  },
  roomDetails: {
    marginBottom: 20,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    color: '#9CA3AF',
    fontSize: 14,
    marginLeft: 8,
  },
  connectedUsers: {
    marginBottom: 20,
  },
  usersTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#8B5CF6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  userInitial: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  userName: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  leaveButton: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.5)',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  leaveButtonText: {
    color: '#EF4444',
    fontSize: 16,
    fontWeight: '600',
  },
  noRoomSection: {
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    marginBottom: 32,
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
  actionCard: {
    marginBottom: 20,
  },
  actionCardGradient: {
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  actionCardTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 4,
  },
  actionCardSubtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
  },
  joinSection: {
    marginBottom: 32,
  },
  joinButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
    borderRadius: 12,
    padding: 16,
  },
  joinButtonText: {
    color: '#8B5CF6',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  joinInputContainer: {
    backgroundColor: 'rgba(55, 65, 81, 0.5)',
    borderRadius: 12,
    padding: 16,
  },
  roomCodeInput: {
    backgroundColor: 'rgba(31, 41, 55, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(75, 85, 99, 0.5)',
    borderRadius: 8,
    padding: 12,
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  joinInputButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: 'rgba(107, 114, 128, 0.2)',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#9CA3AF',
    fontSize: 16,
    fontWeight: '600',
  },
  joinSubmitButton: {
    flex: 1,
    backgroundColor: '#8B5CF6',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  joinSubmitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  featuresSection: {
    marginBottom: 32,
  },
  featuresTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  featuresList: {
    backgroundColor: 'rgba(55, 65, 81, 0.3)',
    borderRadius: 12,
    padding: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  featureText: {
    color: '#D1D5DB',
    fontSize: 14,
    flex: 1,
  },
  searchSongButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
  },
  searchSongText: {
    color: '#8B5CF6',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
});