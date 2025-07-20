import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Music, Radio } from 'lucide-react-native';

export default function SyncTunesLogo() {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <LinearGradient
          colors={['#8B5CF6', '#EC4899']}
          style={styles.iconBackground}
        >
          <View style={styles.iconWrapper}>
            <Music size={20} color="#FFFFFF" />
            <Radio size={16} color="#FFFFFF" style={styles.secondIcon} />
          </View>
        </LinearGradient>
        <View style={styles.textContainer}>
          <Text style={styles.logoText}>
            <Text style={styles.syncText}>Sync</Text>
            <Text style={styles.tunesText}>Tunes</Text>
          </Text>
          <View style={styles.tagline}>
            <View style={styles.syncIndicator} />
            <Text style={styles.taglineText}>Listen Together</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBackground: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  iconWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondIcon: {
    position: 'absolute',
    top: 2,
    right: -2,
    opacity: 0.7,
  },
  textContainer: {
    alignItems: 'flex-start',
  },
  logoText: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  syncText: {
    color: '#8B5CF6',
  },
  tunesText: {
    color: '#FFFFFF',
  },
  tagline: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  syncIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
    marginRight: 6,
  },
  taglineText: {
    color: '#9CA3AF',
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
});