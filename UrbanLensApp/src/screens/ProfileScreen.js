// src/screens/ProfileScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, StatusBar, Switch, Alert } from 'react-native';
import { theme } from '../utils/theme';

function SettingRow({ emoji, label, description, value, onToggle, onPress, arrow, danger }) {
  return (
    <TouchableOpacity style={s.settingRow} onPress={onPress} disabled={!onPress && onToggle === undefined} activeOpacity={0.6}>
      <View style={[s.settingIconWrap, { backgroundColor: danger ? theme.colors.redSoft : theme.colors.bg }]}>
        <Text style={s.settingEmoji}>{emoji}</Text>
      </View>
      <View style={s.settingBody}>
        <Text style={[s.settingLabel, danger && { color: theme.colors.red }]}>{label}</Text>
        {description ? <Text style={s.settingDesc}>{description}</Text> : null}
      </View>
      {onToggle !== undefined
        ? <Switch value={value} onValueChange={onToggle} trackColor={{ false: theme.colors.border, true: theme.colors.blue }} thumbColor="#fff" />
        : arrow ? <Text style={s.chevron}>›</Text> : null}
    </TouchableOpacity>
  );
}

export default function ProfileScreen({ user, onLogout }) {
  const [notif, setNotif]       = useState(true);
  const [locAlways, setLocAlw]  = useState(false);
  const [analytics, setAnalyt]  = useState(true);

  const name     = user?.name  || 'Guest User';
  const email    = user?.email || 'guest@urbanlens.app';
  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  const handleLogout = () => Alert.alert('Sign out', 'Are you sure?', [
    { text: 'Cancel', style: 'cancel' },
    { text: 'Sign out', style: 'destructive', onPress: onLogout },
  ]);

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.navy} />

      {/* Navy hero */}
      <View style={s.hero}>
        <View style={s.heroBg} />
        <View style={s.avatarWrap}>
          <Text style={s.avatarText}>{initials}</Text>
        </View>
        <Text style={s.heroName}>{name}</Text>
        <Text style={s.heroEmail}>{email}</Text>
        <TouchableOpacity style={s.editBtn}>
          <Text style={s.editBtnText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>

        {/* Stats */}
        <View style={s.statsCard}>
          {[
            { label: 'Reports',  value: '12', emoji: '📝', color: theme.colors.blue },
            { label: 'Resolved', value: '9',  emoji: '✅', color: theme.colors.green },
            { label: 'Upvotes',  value: '34', emoji: '👍', color: theme.colors.orange },
          ].map((st, i) => (
            <React.Fragment key={st.label}>
              <View style={s.statItem}>
                <Text style={s.statEmoji}>{st.emoji}</Text>
                <Text style={[s.statNum, { color: st.color }]}>{st.value}</Text>
                <Text style={s.statLabel}>{st.label}</Text>
              </View>
              {i < 2 && <View style={s.statDiv} />}
            </React.Fragment>
          ))}
        </View>

        {/* Rank */}
        <View style={s.rankCard}>
          <Text style={s.rankEmoji}>🏅</Text>
          <View>
            <Text style={s.rankTitle}>Civic Champion</Text>
            <Text style={s.rankSub}>Top 15% reporter in your area</Text>
          </View>
        </View>

        <Text style={s.sectionLabel}>NOTIFICATIONS</Text>
        <View style={s.settingGroup}>
          <SettingRow emoji="🔔" label="Push notifications" description="Issue updates and nearby alerts" value={notif} onToggle={setNotif} />
          <View style={s.rowDiv} />
          <SettingRow emoji="📍" label="Location alerts" description="Background location monitoring" value={locAlways} onToggle={setLocAlw} />
        </View>

        <Text style={s.sectionLabel}>PRIVACY</Text>
        <View style={s.settingGroup}>
          <SettingRow emoji="📊" label="Usage analytics" description="Help us improve the app" value={analytics} onToggle={setAnalyt} />
          <View style={s.rowDiv} />
          <SettingRow emoji="🔐" label="Privacy policy" onPress={() => {}} arrow />
        </View>

        <Text style={s.sectionLabel}>ABOUT</Text>
        <View style={s.settingGroup}>
          <SettingRow emoji="ℹ️" label="Version" description="1.0.0 (beta)" />
          <View style={s.rowDiv} />
          <SettingRow emoji="💻" label="Source code" onPress={() => {}} arrow />
          <View style={s.rowDiv} />
          <SettingRow emoji="💬" label="Help & feedback" onPress={() => {}} arrow />
        </View>

        <Text style={s.sectionLabel}>ACCOUNT</Text>
        <View style={s.settingGroup}>
          <SettingRow emoji="🚪" label="Sign out" onPress={handleLogout} arrow />
          <View style={s.rowDiv} />
          <SettingRow emoji="🗑️" label="Delete account" description="Permanently remove all data" onPress={() => {}} arrow danger />
        </View>

        <Text style={s.footer}>UrbanLens · Making cities better 🌆</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:    { flex: 1, backgroundColor: theme.colors.bg },
  content: { paddingHorizontal: 18, paddingBottom: 48 },
  hero: {
    backgroundColor: theme.colors.navy,
    alignItems: 'center', paddingTop: 28, paddingBottom: 28,
    position: 'relative', overflow: 'hidden',
  },
  heroBg: { position: 'absolute', width: 200, height: 200, borderRadius: 100, backgroundColor: theme.colors.navyLight, top: -80, right: -60 },
  avatarWrap: {
    width: 76, height: 76, borderRadius: 38,
    backgroundColor: theme.colors.blue, alignItems: 'center', justifyContent: 'center',
    marginBottom: 12,
    shadowColor: theme.colors.blue, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.6, shadowRadius: 14, elevation: 8,
  },
  avatarText:  { fontSize: 28, fontWeight: '900', color: '#fff' },
  heroName:    { fontSize: 20, fontWeight: '800', color: '#fff', letterSpacing: 0.3 },
  heroEmail:   { fontSize: 13, color: 'rgba(255,255,255,0.5)', marginTop: 5, marginBottom: 14 },
  editBtn:     { paddingHorizontal: 18, paddingVertical: 8, borderRadius: theme.radius.full, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.25)' },
  editBtnText: { fontSize: 13, color: 'rgba(255,255,255,0.8)', fontWeight: '600' },

  statsCard: {
    flexDirection: 'row', backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md, borderWidth: 1, borderColor: theme.colors.border,
    marginTop: 18, marginBottom: 12,
    shadowColor: '#0D1F3C', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 2,
  },
  statItem:  { flex: 1, alignItems: 'center', paddingVertical: 16 },
  statEmoji: { fontSize: 20, marginBottom: 5 },
  statNum:   { fontSize: 22, fontWeight: '900', letterSpacing: -0.5 },
  statLabel: { fontSize: 11, color: theme.colors.textTertiary, fontWeight: '600', marginTop: 3 },
  statDiv:   { width: 1, backgroundColor: theme.colors.border },

  rankCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#FFFBEB',
    borderWidth: 1, borderColor: '#FDE68A',
    borderRadius: theme.radius.md,
    paddingHorizontal: 16, paddingVertical: 12, marginBottom: 4,
  },
  rankEmoji: { fontSize: 28 },
  rankTitle: { fontSize: 14, fontWeight: '800', color: '#92400E' },
  rankSub:   { fontSize: 12, color: '#B45309', marginTop: 2 },

  sectionLabel: { fontSize: 11, fontWeight: '700', color: theme.colors.textTertiary, letterSpacing: 1, marginTop: 18, marginBottom: 8 },
  settingGroup: { backgroundColor: theme.colors.card, borderRadius: theme.radius.md, borderWidth: 1, borderColor: theme.colors.border, overflow: 'hidden' },
  rowDiv:       { height: 1, backgroundColor: theme.colors.border, marginLeft: 52 },
  settingRow:   { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 13 },
  settingIconWrap: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  settingEmoji:    { fontSize: 18 },
  settingBody:     { flex: 1 },
  settingLabel:    { fontSize: 14, fontWeight: '600', color: theme.colors.textPrimary },
  settingDesc:     { fontSize: 12, color: theme.colors.textTertiary, marginTop: 1 },
  chevron:         { fontSize: 22, color: theme.colors.textTertiary },
  footer:  { textAlign: 'center', fontSize: 12, color: theme.colors.textTertiary, marginTop: 28 },
});