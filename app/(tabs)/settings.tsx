import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, ScrollView, Alert, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { User, Volume2, Wifi, Shield, CircleHelp as HelpCircle, LogOut, Bell, Music } from 'lucide-react-native';
import SyncTunesLogo from '@/components/SyncTunesLogo';
import { useAuth } from '@/hooks/useAuth';

export default function SettingsScreen() {
  const { user, signOut } = useAuth();
  const [notifications, setNotifications] = useState(true);
  const [autoSync, setAutoSync] = useState(true);
  const [highQuality, setHighQuality] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', onPress: signOut, style: 'destructive' },
      ]
    );
  };

  const SettingItem = ({ 
    icon, 
    title, 
    subtitle, 
    onPress, 
    rightComponent 
  }: {
    icon: React.ReactNode;
    title: string;
    subtitle?: string;
    onPress?: () => void;
    rightComponent?: React.ReactNode;
  }) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress} disabled={!onPress}>
      <View style={styles.settingIcon}>
        {icon}
      </View>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
      {rightComponent}
    </TouchableOpacity>
  );

  return (
    <LinearGradient
      colors={['#1F2937', '#111827']}
      style={styles.container}
    >
      {/* Logo */}
      <SyncTunesLogo />

      <View style={styles.settingsHeader}>
        <Text style={styles.settingsTitle}>Settings</Text>
        <Text style={styles.settingsSubtitle}>Customize your experience</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile</Text>
          <View style={styles.profileCard}>
            <LinearGradient
              colors={['rgba(139, 92, 246, 0.2)', 'rgba(236, 72, 153, 0.1)']}
              style={styles.profileCardGradient}
            >
              <View style={styles.profileAvatar}>
                {user?.photo ? (
                  <Image 
                    source={{ uri: user.photo }} 
                    style={styles.profileImage}
                  />
                ) : (
                  <Text style={styles.profileInitial}>
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </Text>
                )}
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>{user?.name || 'User'}</Text>
                <Text style={styles.profileEmail}>{user?.email || 'user@example.com'}</Text>
              </View>
            </LinearGradient>
          </View>
        </View>

        {/* Audio Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Audio</Text>
          <View style={styles.settingsList}>
            <SettingItem
              icon={<Volume2 size={20} color="#8B5CF6" />}
              title="High Quality Audio"
              subtitle="Better quality, more data usage"
              rightComponent={
                <Switch
                  value={highQuality}
                  onValueChange={setHighQuality}
                  thumbColor="#FFFFFF"
                  trackColor={{ false: '#374151', true: '#8B5CF6' }}
                />
              }
            />
            <SettingItem
              icon={<Wifi size={20} color="#8B5CF6" />}
              title="Auto Sync"
              subtitle="Automatically sync with room members"
              rightComponent={
                <Switch
                  value={autoSync}
                  onValueChange={setAutoSync}
                  thumbColor="#FFFFFF"
                  trackColor={{ false: '#374151', true: '#8B5CF6' }}
                />
              }
            />
            <SettingItem
              icon={<Music size={20} color="#8B5CF6" />}
              title="Streaming Quality"
              subtitle="256 kbps"
              onPress={() => Alert.alert('Streaming Quality', 'Coming soon!')}
            />
          </View>
        </View>

        {/* Notifications */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          <View style={styles.settingsList}>
            <SettingItem
              icon={<Bell size={20} color="#8B5CF6" />}
              title="Push Notifications"
              subtitle="Get notified when friends invite you"
              rightComponent={
                <Switch
                  value={notifications}
                  onValueChange={setNotifications}
                  thumbColor="#FFFFFF"
                  trackColor={{ false: '#374151', true: '#8B5CF6' }}
                />
              }
            />
          </View>
        </View>

        {/* Account */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.settingsList}>
            <SettingItem
              icon={<User size={20} color="#8B5CF6" />}
              title="Edit Profile"
              subtitle="Update your name and photo"
              onPress={() => Alert.alert('Edit Profile', 'Coming soon!')}
            />
            <SettingItem
              icon={<Shield size={20} color="#8B5CF6" />}
              title="Privacy & Security"
              subtitle="Manage your privacy settings"
              onPress={() => Alert.alert('Privacy', 'Coming soon!')}
            />
          </View>
        </View>

        {/* Support */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          <View style={styles.settingsList}>
            <SettingItem
              icon={<HelpCircle size={20} color="#8B5CF6" />}
              title="Help & FAQ"
              subtitle="Get help using SyncTunes"
              onPress={() => Alert.alert('Help', 'Coming soon!')}
            />
          </View>
        </View>

        {/* Logout */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <LogOut size={20} color="#EF4444" />
            <Text style={styles.logoutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appVersion}>SyncTunes v1.0.0</Text>
          <Text style={styles.appCopyright}>© 2025 SyncTunes</Text>
        </View>
      </ScrollView>
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
  settingsHeader: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 4,
  },
  settingsTitle: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    color: '#9CA3AF',
    fontSize: 16,
  },
  settingsSubtitle: {
    color: '#9CA3AF',
    fontSize: 16,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  profileCard: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  profileCardGradient: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#8B5CF6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  profileInitial: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
  },
  profileEmail: {
    color: '#9CA3AF',
    fontSize: 14,
  },
  settingsList: {
    backgroundColor: 'rgba(55, 65, 81, 0.3)',
    borderRadius: 12,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(75, 85, 99, 0.3)',
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  settingSubtitle: {
    color: '#9CA3AF',
    fontSize: 14,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    borderRadius: 12,
    padding: 16,
  },
  logoutText: {
    color: '#EF4444',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: 20,
    marginBottom: 40,
  },
  appVersion: {
    color: '#9CA3AF',
    fontSize: 14,
    marginBottom: 4,
  },
  appCopyright: {
    color: '#6B7280',
    fontSize: 12,
  },
});