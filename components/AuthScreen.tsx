import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Music, Users, MessageCircle } from 'lucide-react-native';
import SyncTunesLogo from './SyncTunesLogo';

interface AuthScreenProps {
  onSignIn: () => void;
  isLoading: boolean;
}

export default function AuthScreen({ onSignIn, isLoading }: AuthScreenProps) {
  return (
    <LinearGradient
      colors={['#1F2937', '#111827']}
      style={styles.container}
    >
      {/* Logo */}
      <View style={styles.logoContainer}>
        <SyncTunesLogo />
      </View>

      {/* Welcome Content */}
      <View style={styles.content}>
        <Text style={styles.welcomeTitle}>Welcome to SyncTunes</Text>
        <Text style={styles.welcomeSubtitle}>
          Listen to music together with friends and loved ones, no matter where you are
        </Text>

        {/* Features */}
        <View style={styles.features}>
          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Music size={24} color="#8B5CF6" />
            </View>
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>Synchronized Playback</Text>
              <Text style={styles.featureDescription}>
                Play music in perfect sync across all devices
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Users size={24} color="#8B5CF6" />
            </View>
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>Listen Together</Text>
              <Text style={styles.featureDescription}>
                Create rooms and invite friends to join your session
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <MessageCircle size={24} color="#8B5CF6" />
            </View>
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>Real-time Chat</Text>
              <Text style={styles.featureDescription}>
                Chat with friends while listening to your favorite songs
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Sign In Button */}
      <View style={styles.authSection}>
        <TouchableOpacity 
          style={styles.signInButton} 
          onPress={onSignIn}
          disabled={isLoading}
        >
          <LinearGradient
            colors={['#8B5CF6', '#EC4899']}
            style={styles.signInButtonGradient}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
                <View style={styles.googleIcon}>
                  <Text style={styles.googleIconText}>G</Text>
                </View>
                <Text style={styles.signInButtonText}>Continue with Google</Text>
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>

        <Text style={styles.privacyText}>
          By continuing, you agree to our Terms of Service and Privacy Policy
        </Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  welcomeTitle: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 12,
  },
  welcomeSubtitle: {
    color: '#9CA3AF',
    fontSize: 18,
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 40,
  },
  features: {
    marginBottom: 40,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  featureDescription: {
    color: '#9CA3AF',
    fontSize: 14,
    lineHeight: 20,
  },
  authSection: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  signInButton: {
    marginBottom: 16,
  },
  signInButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  googleIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  googleIconText: {
    color: '#1F2937',
    fontSize: 14,
    fontWeight: '700',
  },
  signInButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  privacyText: {
    color: '#6B7280',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
});