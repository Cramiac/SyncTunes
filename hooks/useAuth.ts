import { useState, useEffect, useCallback } from 'react';
import * as AuthSession from 'expo-auth-session';
import * as Crypto from 'expo-crypto';

interface User {
  id: string;
  name: string;
  email: string;
  photo?: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });

  // Google OAuth configuration
  const discovery = AuthSession.useAutoDiscovery('https://accounts.google.com');
  
  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: 'your-google-client-id.apps.googleusercontent.com', // Replace with actual client ID
      redirectUri: AuthSession.makeRedirectUri({ useProxy: false }),
      scopes: ['openid', 'profile', 'email'],
      additionalParameters: {},
      customParameters: {
        prompt: 'select_account',
      },
    },
    discovery
  );

  // Handle authentication response
  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      if (authentication?.accessToken) {
        fetchUserInfo(authentication.accessToken);
      }
    }
  }, [response]);

  // Fetch user information from Google
  const fetchUserInfo = async (accessToken: string) => {
    try {
      const userInfoResponse = await fetch(
        `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${accessToken}`
      );
      const userInfo = await userInfoResponse.json();
      
      const user: User = {
        id: userInfo.id,
        name: userInfo.name,
        email: userInfo.email,
        photo: userInfo.picture,
      };

      setState({
        user,
        isLoading: false,
        isAuthenticated: true,
      });

      // Store user data locally (in a real app, you'd use secure storage)
      console.log('User authenticated:', user);
    } catch (error) {
      console.error('Failed to fetch user info:', error);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  // Sign in with Google
  const signIn = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      await promptAsync();
    } catch (error) {
      console.error('Sign in failed:', error);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [promptAsync]);

  // Sign out
  const signOut = useCallback(async () => {
    try {
      setState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });
      console.log('User signed out');
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  }, []);

  // Initialize auth state (check for existing session)
  useEffect(() => {
    // In a real app, check for stored authentication tokens
    // For demo purposes, we'll start with no user
    setState(prev => ({ ...prev, isLoading: false }));
  }, []);

  return {
    ...state,
    signIn,
    signOut,
  };
}