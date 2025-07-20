import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Image, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Search, Play, Clock, X } from 'lucide-react-native';
import { YouTubeService } from '@/services/youtube';
import { YouTubeVideo } from '@/types/youtube';
import type { Song } from '@/types/youtube';

interface YouTubeSearchProps {
  onSongSelect: (song: Song) => void;
  onClose: () => void;
}

export default function YouTubeSearch({ onSongSelect, onClose }: YouTubeSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<YouTubeVideo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const youtubeService = YouTubeService.getInstance();

  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    try {
      const response = await youtubeService.searchVideos(searchQuery);
      setSearchResults(response.items);
      setHasSearched(true);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, youtubeService]);

  const handleSongSelect = (video: YouTubeVideo) => {
    const song = youtubeService.youtubeVideoToSong(video);
    onSongSelect(song);
    onClose();
  };

  const renderVideoItem = ({ item }: { item: YouTubeVideo }) => (
    <TouchableOpacity style={styles.videoItem} onPress={() => handleSongSelect(item)}>
      <Image source={{ uri: item.thumbnails.medium.url }} style={styles.thumbnail} />
      <View style={styles.videoInfo}>
        <Text style={styles.videoTitle} numberOfLines={2}>
          {youtubeService.youtubeVideoToSong(item).title}
        </Text>
        <Text style={styles.videoChannel} numberOfLines={1}>
          {item.channelTitle}
        </Text>
        <View style={styles.videoMeta}>
          <Clock size={12} color="#9CA3AF" />
          <Text style={styles.videoDuration}>
            {youtubeService.formatDuration(youtubeService.parseDuration(item.duration))}
          </Text>
        </View>
      </View>
      <TouchableOpacity style={styles.playButton}>
        <Play size={16} color="#8B5CF6" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1F2937', '#111827']}
        style={styles.gradient}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Search YouTube</Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Search Input */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputWrapper}>
            <Search size={20} color="#9CA3AF" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search for songs..."
              placeholderTextColor="#6B7280"
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
              returnKeyType="search"
            />
          </View>
          <TouchableOpacity 
            style={[styles.searchButton, !searchQuery.trim() && styles.searchButtonDisabled]}
            onPress={handleSearch}
            disabled={!searchQuery.trim() || isLoading}
          >
            <LinearGradient
              colors={searchQuery.trim() ? ['#8B5CF6', '#EC4899'] : ['#4B5563', '#4B5563']}
              style={styles.searchButtonGradient}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Search size={20} color="#FFFFFF" />
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Results */}
        <View style={styles.resultsContainer}>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#8B5CF6" />
              <Text style={styles.loadingText}>Searching YouTube...</Text>
            </View>
          ) : hasSearched && searchResults.length === 0 ? (
            <View style={styles.emptyState}>
              <Search size={64} color="#4B5563" />
              <Text style={styles.emptyTitle}>No results found</Text>
              <Text style={styles.emptySubtitle}>
                Try searching with different keywords
              </Text>
            </View>
          ) : (
            <FlatList
              data={searchResults}
              renderItem={renderVideoItem}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.resultsList}
            />
          )}
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
  },
  closeButton: {
    padding: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 24,
    gap: 12,
  },
  searchInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(55, 65, 81, 0.8)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
    marginLeft: 12,
  },
  searchButton: {
    width: 48,
    height: 48,
  },
  searchButtonDisabled: {
    opacity: 0.5,
  },
  searchButtonGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultsContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: '#9CA3AF',
    fontSize: 16,
    marginTop: 16,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    color: '#9CA3AF',
    fontSize: 16,
    textAlign: 'center',
  },
  resultsList: {
    paddingBottom: 20,
  },
  videoItem: {
    flexDirection: 'row',
    backgroundColor: 'rgba(55, 65, 81, 0.5)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  thumbnail: {
    width: 80,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#374151',
  },
  videoInfo: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  videoTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    lineHeight: 20,
  },
  videoChannel: {
    color: '#8B5CF6',
    fontSize: 14,
    marginBottom: 4,
  },
  videoMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  videoDuration: {
    color: '#9CA3AF',
    fontSize: 12,
    marginLeft: 4,
  },
  playButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});