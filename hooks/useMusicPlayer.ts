import { useState, useCallback } from 'react';
import type { Song } from '@/types/youtube';

interface MusicPlayerState {
  isPlaying: boolean;
  currentSong: Song | null;
  volume: number;
  currentTime: number;
}

export function useMusicPlayer() {
  const [state, setState] = useState<MusicPlayerState>({
    isPlaying: false,
    currentSong: null,
    volume: 0.8,
    currentTime: 0,
  });

  const play = useCallback(() => {
    setState(prev => ({ ...prev, isPlaying: true }));
    // In a real app, this would trigger WebSocket sync
    console.log('Broadcasting play to room members');
  }, []);

  const pause = useCallback(() => {
    setState(prev => ({ ...prev, isPlaying: false }));
    // In a real app, this would trigger WebSocket sync
    console.log('Broadcasting pause to room members');
  }, []);

  const next = useCallback(() => {
    // In a real app, this would move to next song in queue
    console.log('Broadcasting next to room members');
  }, []);

  const previous = useCallback(() => {
    // In a real app, this would move to previous song
    console.log('Broadcasting previous to room members');
  }, []);

  const setCurrentSong = useCallback((song: Song) => {
    setState(prev => ({ ...prev, currentSong: song, currentTime: 0 }));
    // In a real app, this would sync the new song with room members
    console.log('Broadcasting new song to room members:', song.title);
  }, []);

  const setVolume = useCallback((volume: number) => {
    setState(prev => ({ ...prev, volume }));
  }, []);

  const seekTo = useCallback((time: number) => {
    setState(prev => ({ ...prev, currentTime: time }));
    // In a real app, this would sync with room members
    console.log('Broadcasting seek to room members:', time);
  }, []);

  const addToQueue = useCallback((song: Song) => {
    // In a real app, this would add to the queue and sync with room members
    console.log('Adding song to queue:', song.title);
  }, []);

  return {
    ...state,
    play,
    pause,
    next,
    previous,
    setCurrentSong,
    setVolume,
    seekTo,
    addToQueue,
  };
}