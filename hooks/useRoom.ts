import { useState, useCallback } from 'react';
import { useAuth } from './useAuth';

interface User {
  id: string;
  name: string;
  isHost: boolean;
}

interface Room {
  id: string;
  code: string;
  hostId: string;
  createdAt: Date;
}

interface RoomState {
  room: Room | null;
  connectedUsers: User[];
  isHost: boolean;
}

export function useRoom() {
  const { user: currentUser } = useAuth();
  const [state, setState] = useState<RoomState>({
    room: null,
    connectedUsers: [],
    isHost: false,
  });

  const generateRoomCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const createRoom = useCallback(async () => {
    const roomCode = generateRoomCode();
    const newRoom: Room = {
      id: Date.now().toString(),
      code: roomCode,
      hostId: currentUser?.id || 'user1',
      createdAt: new Date(),
    };

    const mockUsers: User[] = [
      { id: currentUser?.id || 'user1', name: currentUser?.name || 'You', isHost: true },
    ];

    setState({
      room: newRoom,
      connectedUsers: mockUsers,
      isHost: true,
    });

    // In a real app, this would create a WebSocket connection
    console.log('Created room:', roomCode);
  }, [currentUser]);

  const joinRoom = useCallback(async (roomCode: string) => {
    // Simulate joining a room
    const room: Room = {
      id: Date.now().toString(),
      code: roomCode,
      hostId: 'user2',
      createdAt: new Date(),
    };

    const mockUsers: User[] = [
      { id: 'user2', name: 'Sarah', isHost: true },
      { id: 'user3', name: 'Mike', isHost: false },
      { id: currentUser?.id || 'user1', name: currentUser?.name || 'You', isHost: false },
    ];

    setState({
      room,
      connectedUsers: mockUsers,
      isHost: false,
    });

    // In a real app, this would join a WebSocket room
    console.log('Joined room:', roomCode);
  }, [currentUser]);

  const leaveRoom = useCallback(() => {
    setState({
      room: null,
      connectedUsers: [],
      isHost: false,
    });

    // In a real app, this would disconnect from WebSocket
    console.log('Left room');
  }, []);

  const addUser = useCallback((user: User) => {
    setState(prev => ({
      ...prev,
      connectedUsers: [...prev.connectedUsers, user],
    }));
  }, []);

  const removeUser = useCallback((userId: string) => {
    setState(prev => ({
      ...prev,
      connectedUsers: prev.connectedUsers.filter(user => user.id !== userId),
    }));
  }, []);

  return {
    ...state,
    createRoom,
    joinRoom,
    leaveRoom,
    addUser,
    removeUser,
  };
}