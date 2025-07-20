import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useAuth } from '@/hooks/useAuth';
import AuthScreen from '@/components/AuthScreen';

export default function RootLayout() {
  useFrameworkReady();
  const { isAuthenticated, isLoading, signIn } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#111827' }}>
        {/* Loading screen - could add a splash screen here */}
      </View>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        <AuthScreen onSignIn={signIn} isLoading={isLoading} />
        <StatusBar style="light" />
      </>
    );
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="light" />
    </>
  );
}
