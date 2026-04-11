import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { theme } from '../utils/theme';
import { getSession, logout } from '../services/authService';
import { getIssues } from '../services/issueService';
import {
  ScreenContainer,
  Card,
  Avatar,
  Pill,
  SectionHeader,
} from '../components';

const SETTINGS = [
  { section: 'Preferences', items: [
    { icon: '🔔', label: 'Push Notifications', toggle: true, key: 'notifications' },
    { icon: '📍', label: 'Location Access', toggle: true, key: 'location' },
  ]},
  { section: 'App', items: [
    { icon: 'ℹ️', label: 'About UrbanLens', arrow: true },
    { icon: '⭐', label: 'Rate the App', arrow: true },
    { icon: '🐛', label: 'Report a Bug', arrow: true },
  ]},
  { section: 'Account', items: [
    { icon: '🔒', label: 'Privacy Settings', arrow: true },
    { icon: '📧', label: 'Change Email', arrow: true },
  ]},
];

export default function ProfileScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [myIssues, setMyIssues] = useState([]);
  const [toggles, setToggles] = useState({ notifications: true, location: true });

  useFocusEffect(
    useCallback(() => {
      Promise.all([getSession(), getIssues()]).then(([session, all]) => {
        setUser(session);
        setMyIssues(all.slice(0, 3));
      });
    }, []),
  );

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await logout();
          navigation.replace('Login');
        },
      },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This action is permanent and cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => {} },
      ],
    );
  };

  const resolved = myIssues.filter(i => i.status === 'Resolved').length;
  const upvotes = myIssues.reduce((acc, i) => acc + (i.upvotes ?? 0), 0);

  return (
    <ScreenContainer scrollable padding={0}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* ── Avatar hero ── */}
        <View style={styles.hero}>
          <Avatar name={user?.name || 'U'} size="xl" />
          <Text style={styles.name}>{user?.name || 'Guest'}</Text>
          <Text style={styles.email}>{user?.email || 'Guest account'}</Text>
          {user?.isGuest ? (
            <Pill text="Guest" color={theme.colors.textSecondary} style={styles.guestPill} />
          ) : (
            <Pill text="Verified Reporter" color={theme.colors.green} style={styles.guestPill} />
          )}
        </View>

        <View style={styles.content}>
          {/* ── Stats strip ── */}
          <Card style={styles.statsStrip}>
            {[
              { label: 'Reports', value: myIssues.length },
              { label: 'Resolved', value: resolved },
              { label: 'Upvotes', value: upvotes },
            ].map((s, i, arr) => (
              <React.Fragment key={s.label}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{s.value}</Text>
                  <Text style={styles.statLabel}>{s.label}</Text>
                </View>
                {i < arr.length - 1 && <View style={styles.divider} />}
              </React.Fragment>
            ))}
          </Card>

          {/* ── Rank card ── */}
          <Card style={styles.rankCard}>
            <View style={styles.rankLeft}>
              <Text style={styles.rankEmoji}>🏅</Text>
              <View>
                <Text style={styles.rankTitle}>Civic Champion</Text>
                <Text style={styles.rankSub}>Top 10% of reporters in Bengaluru</Text>
              </View>
            </View>
            <Pill text="Rank #12" color={theme.colors.amber} />
          </Card>

          {/* ── Settings sections ── */}
          {SETTINGS.map(section => (
            <View key={section.section}>
              <SectionHeader title={section.section} />
              <Card noPadding>
                {section.items.map((item, idx) => (
                  <TouchableOpacity
                    key={item.label}
                    style={[
                      styles.settingRow,
                      idx < section.items.length - 1 && styles.settingBorder,
                    ]}
                    activeOpacity={item.toggle ? 1 : 0.7}
                    onPress={item.arrow ? () => {} : undefined}
                  >
                    <Text style={styles.settingIcon}>{item.icon}</Text>
                    <Text style={styles.settingLabel}>{item.label}</Text>
                    {item.toggle ? (
                      <Switch
                        value={toggles[item.key]}
                        onValueChange={v => setToggles(t => ({ ...t, [item.key]: v }))}
                        trackColor={{ false: theme.colors.border, true: theme.colors.blue + '88' }}
                        thumbColor={toggles[item.key] ? theme.colors.blue : theme.colors.textSecondary}
                      />
                    ) : item.arrow ? (
                      <Text style={styles.arrow}>›</Text>
                    ) : null}
                  </TouchableOpacity>
                ))}
              </Card>
            </View>
          ))}

          {/* ── Danger zone ── */}
          <TouchableOpacity style={styles.signOutBtn} onPress={handleLogout} activeOpacity={0.8}>
            <Text style={styles.signOutText}>🚪  Sign Out</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.deleteBtn} onPress={handleDeleteAccount} activeOpacity={0.8}>
            <Text style={styles.deleteText}>🗑️  Delete Account</Text>
          </TouchableOpacity>

          <View style={styles.bottomPad} />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  hero: {
    alignItems: 'center',
    paddingTop: 32,
    paddingBottom: 24,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    gap: 6,
  },
  name: { fontSize: 22, fontWeight: '700', color: theme.colors.textPrimary, marginTop: 10 },
  email: { fontSize: 13, color: theme.colors.textSecondary },
  guestPill: { marginTop: 4 },

  content: { padding: 20, gap: 16 },

  statsStrip: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: { alignItems: 'center', flex: 1 },
  statValue: { fontSize: 22, fontWeight: '700', color: theme.colors.textPrimary },
  statLabel: { fontSize: 11, color: theme.colors.textSecondary, marginTop: 2 },
  divider: { width: 1, height: 32, backgroundColor: theme.colors.border },

  rankCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.amber + '18',
    borderColor: theme.colors.amber + '33',
  },
  rankLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  rankEmoji: { fontSize: 28 },
  rankTitle: { fontSize: 15, fontWeight: '700', color: theme.colors.textPrimary },
  rankSub: { fontSize: 11, color: theme.colors.textSecondary, marginTop: 2 },

  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 14,
  },
  settingBorder: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  settingIcon: { fontSize: 18 },
  settingLabel: { flex: 1, fontSize: 15, color: theme.colors.textPrimary },
  arrow: { fontSize: 22, color: theme.colors.textSecondary },

  signOutBtn: {
    paddingVertical: 14,
    borderRadius: theme.radius.button,
    backgroundColor: theme.colors.elevated,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
    marginTop: 4,
  },
  signOutText: { fontSize: 15, fontWeight: '600', color: theme.colors.textPrimary },

  deleteBtn: {
    paddingVertical: 14,
    borderRadius: theme.radius.button,
    borderWidth: 1,
    borderColor: theme.colors.red + '44',
    alignItems: 'center',
  },
  deleteText: { fontSize: 15, fontWeight: '600', color: theme.colors.red },

  bottomPad: { height: 20 },
});