import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Play, Pause, SkipForward, SkipBack, Volume2, Heart, Search, Plus } from 'lucide-react-native';
import { useMusicPlayer } from '@/hooks/useMusicPlayer';
import { useRoom } from '@/hooks/useRoom';
import YouTubeSearch from '@/components/YouTubeSearch';
import type { Song } from '@/types/youtube';

const mockSongs: Song[] = [
  {
    id: '1',
    title: 'Electric Dreams',
    artist: 'Neon Nights',
    album: 'Synthwave Collection',
    duration: 245,
    coverUrl: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=300',
    source: 'local' as const,
  },
  {
    id: '2',
    title: 'Midnight City',
    artist: 'Urban Lights',
    album: 'City Nights',
    duration: 198,
    coverUrl: 'https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg?auto=compress&cs=tinysrgb&w=300',
    source: 'local' as const,
  },
  {
    id: '3',
    title: 'Ocean Waves',
    artist: 'Coastal Vibes',
    album: 'Summer Memories',
    duration: 267,
    coverUrl: 'https://images.pexels.com/photos/1434819/pexels-photo-1434819.jpeg?auto=compress&cs=tinysrgb&w=300',
    source: 'local' as const,
  },
];

export default function PlayerScreen() {
  const { isPlaying, currentSong, play, pause, next, previous, setCurrentSong, addToQueue } = useMusicPlayer();
  const { room, connectedUsers } = useRoom();
  const [currentTime, setCurrentTime] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [showYouTubeSearch, setShowYouTubeSearch] = useState(false);

  useEffect(() => {
    if (!currentSong) {
      setCurrentSong(mockSongs[0]);
    }
  }, [currentSong, setCurrentSong]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && currentSong) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          const newTime = prev + 1;
          if (newTime >= currentSong.duration) {
            next();
            return 0;
          }
          return newTime;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentSong, next]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const handleSongSelect = (song: Song) => {
    if (room) {
      // If in a room, add to queue or replace current song
      setCurrentSong(song);
      Alert.alert('Song Selected', `Now playing: ${song.title} by ${song.artist}`);
    } else {
      // If not in a room, just play the song
      setCurrentSong(song);
    }
  };

  if (!currentSong) {
    return null;
  }

  return (
    <LinearGradient
      colors={['#1F2937', '#111827']}
      style={styles.container}
    >
      {/* Room Status */}
      {room && (
        <View style={styles.roomStatus}>
          <View style={styles.roomInfo}>
            <Text style={styles.roomCode}>Room: {room.code}</Text>
            <Text style={styles.connectedUsers}>
              {connectedUsers.length} listening together
            </Text>
          </View>
        </View>
      )}

      {/* Album Art */}
      <View style={styles.albumContainer}>
        <Image
          source={{ uri: currentSong.coverUrl }}
          style={styles.albumArt}
        />
        <LinearGradient
          colors={['transparent', 'rgba(139, 92, 246, 0.1)']}
          style={styles.albumOverlay}
        />
      </View>

      {/* Song Info */}
      <View style={styles.songInfo}>
        <Text style={styles.songTitle}>{currentSong.title}</Text>
        <Text style={styles.artistName}>{currentSong.artist}</Text>
        <Text style={styles.albumName}>{currentSong.album}</Text>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${(currentTime / currentSong.duration) * 100}%` }
            ]} 
          />
        </View>
        <Text style={styles.timeText}>{formatTime(currentSong.duration)}</Text>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity style={styles.controlButton} onPress={() => setShowYouTubeSearch(true)}>
          <Search size={24} color="#9CA3AF" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.controlButton} onPress={handleLike}>
          <Heart 
            size={24} 
            color={isLiked ? '#EC4899' : '#9CA3AF'} 
            fill={isLiked ? '#EC4899' : 'transparent'}
          />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.controlButton} onPress={previous}>
          <SkipBack size={32} color="#FFFFFF" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.playButton} onPress={handlePlayPause}>
          <LinearGradient
            colors={['#8B5CF6', '#EC4899']}
            style={styles.playButtonGradient}
          >
            {isPlaying ? (
              <Pause size={40} color="#FFFFFF" />
            ) : (
              <Play size={40} color="#FFFFFF" />
            )}
          </LinearGradient>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.controlButton} onPress={next}>
          <SkipForward size={32} color="#FFFFFF" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.controlButton}>
          <Volume2 size={24} color="#9CA3AF" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.controlButton} onPress={() => setShowYouTubeSearch(true)}>
          <Plus size={24} color="#9CA3AF" />
        </TouchableOpacity>
      </View>

      {/* Sync Status */}
      {room && (
        <View style={styles.syncStatus}>
          <View style={styles.syncIndicator} />
          <Text style={styles.syncText}>Synced with room</Text>
        </View>
      )}

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
    paddingHorizontal: 20,
  },
  roomStatus: {
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
  },
  roomInfo: {
    alignItems: 'center',
  },
  roomCode: {
    color: '#8B5CF6',
    fontSize: 16,
    fontWeight: '600',
  },
  connectedUsers: {
    color: '#9CA3AF',
    fontSize: 14,
    marginTop: 2,
  },
  albumContainer: {
    alignItems: 'center',
    marginVertical: 40,
    position: 'relative',
  },
  albumArt: {
    width: 280,
    height: 280,
    borderRadius: 20,
  },
  albumOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 20,
  },
  songInfo: {
    alignItems: 'center',
    marginBottom: 40,
  },
  songTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  artistName: {
    color: '#8B5CF6',
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 4,
  },
  albumName: {
    color: '#9CA3AF',
    fontSize: 16,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
    marginHorizontal: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#8B5CF6',
    borderRadius: 2,
  },
  timeText: {
    color: '#9CA3AF',
    fontSize: 14,
    fontWeight: '500',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  controlButton: {
    padding: 12,
    marginHorizontal: 8,
  },
  playButton: {
    marginHorizontal: 20,
  },
  playButtonGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  syncStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  syncIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
    marginRight: 8,
  },
  syncText: {
    color: '#10B981',
    fontSize: 14,
    fontWeight: '500',
  },
});