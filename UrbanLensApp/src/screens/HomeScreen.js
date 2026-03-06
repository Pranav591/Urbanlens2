import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, ScrollView,
  TouchableOpacity, StatusBar, RefreshControl,
} from 'react-native';
import { theme } from '../utils/theme';
import { issueService } from '../services/issueService';

const SEV = {
  high:   { color: theme.colors.red,    bg: theme.colors.redSoft,    label: 'High',   dot: '🔴' },
  medium: { color: theme.colors.orange, bg: theme.colors.orangeSoft, label: 'Medium', dot: '🟠' },
  low:    { color: theme.colors.green,  bg: theme.colors.greenSoft,  label: 'Low',    dot: '🟢' },
};
const TYPE_EMOJI = {
  pothole:'🕳️', garbage:'🗑️', streetlight:'💡', flooding:'🌊', graffiti:'🖌️', other:'⚠️',
};

export default function HomeScreen({ navigation, user }) {
  const [issues, setIssues]     = useState([]);
  const [stats, setStats]       = useState({ total: 0, resolved: 0, pending: 0, thisWeek: 0 });
  const [refreshing, setRefresh]= useState(false);

  const load = async () => {
    const data = await issueService.getIssues();
    setIssues(data.slice(0, 5));
    setStats({
      total:    data.length,
      resolved: data.filter(i => i.status === 'resolved').length,
      pending:  data.filter(i => i.status === 'pending').length,
      thisWeek: data.filter(i => i.isThisWeek).length,
    });
  };
  useEffect(() => { load(); }, []);
  const onRefresh = async () => { setRefresh(true); await load(); setRefresh(false); };

  const firstName = user?.name?.split(' ')[0] || 'there';
  const city = 'Bengaluru'; // Can be dynamic later

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.navy} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.colors.blue} />}>

        {/* ── NAVY HERO CARD (matches screenshot exactly) ── */}
        <View style={s.heroWrap}>
          {/* Decorative background circles for depth */}
          <View style={s.heroBg1} /><View style={s.heroBg2} /><View style={s.heroBg3} />

          <View style={s.heroTop}>
            <View style={s.liveBadge}>
              <View style={s.liveDot} />
              <Text style={s.liveText}>LIVE MONITORING</Text>
            </View>
            <TouchableOpacity style={s.avatarBtn}>
              <Text style={s.avatarText}>{(user?.name?.[0] || 'G').toUpperCase()}</Text>
            </TouchableOpacity>
          </View>

          <Text style={s.heroCity}>{city}</Text>
          <Text style={s.heroTitle}>Civic Dashboard</Text>
          <Text style={s.heroSub}>Track and report urban issues in real-time</Text>

          <View style={s.heroActions}>
            <TouchableOpacity style={s.heroBtn} onPress={() => navigation.navigate('Report')} activeOpacity={0.85}>
              <Text style={s.heroBtnText}>+ Report Issue</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.heroGhost} onPress={() => navigation.navigate('Map')} activeOpacity={0.75}>
              <Text style={s.heroGhostText}>View Map →</Text>
            </TouchableOpacity>
          </View>

          {/* Mini stat strip inside hero */}
          <View style={s.heroStats}>
            {[
              { label: 'Total',    value: stats.total },
              { label: 'Resolved', value: stats.resolved },
              { label: 'Pending',  value: stats.pending },
              { label: 'This Week',value: stats.thisWeek },
            ].map((st, i) => (
              <React.Fragment key={st.label}>
                <View style={s.heroStat}>
                  <Text style={s.heroStatNum}>{st.value}</Text>
                  <Text style={s.heroStatLabel}>{st.label}</Text>
                </View>
                {i < 3 && <View style={s.heroStatDiv} />}
              </React.Fragment>
            ))}
          </View>
        </View>

        {/* ── WHITE CONTENT AREA ── */}
        <View style={s.content}>

          {/* Quick actions */}
          <Text style={s.sectionTitle}>Quick Actions</Text>
          <View style={s.actionsRow}>
            {[
              { label: 'View Map',  emoji: '🗺️', screen: 'Map',       bg: theme.colors.blueSoft,   color: theme.colors.blue },
              { label: 'Analytics', emoji: '📊',  screen: 'Dashboard', bg: '#FFF7ED',               color: theme.colors.orange },
              { label: 'Report',    emoji: '📸',  screen: 'Report',    bg: theme.colors.greenSoft,  color: theme.colors.green },
            ].map(a => (
              <TouchableOpacity
                key={a.label}
                style={[s.actionCard, { backgroundColor: a.bg }]}
                onPress={() => navigation.navigate(a.screen)}
                activeOpacity={0.75}>
                <View style={[s.actionIconWrap, { backgroundColor: a.color + '20' }]}>
                  <Text style={s.actionEmoji}>{a.emoji}</Text>
                </View>
                <Text style={[s.actionLabel, { color: a.color }]}>{a.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Recent issues */}
          <View style={s.sectionRow}>
            <Text style={s.sectionTitle}>Recent Issues</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Map')}>
              <Text style={s.seeAll}>See all</Text>
            </TouchableOpacity>
          </View>

          <View style={s.issueList}>
            {issues.length === 0 ? (
              <View style={s.emptyBox}>
                <Text style={s.emptyEmoji}>✅</Text>
                <Text style={s.emptyTitle}>All clear!</Text>
                <Text style={s.emptyText}>No issues reported nearby yet.</Text>
              </View>
            ) : (
              issues.map((issue, idx) => {
                const sv = SEV[issue.severity] || SEV.low;
                return (
                  <TouchableOpacity key={issue.id} style={s.issueCard} onPress={() => navigation.navigate('Map')} activeOpacity={0.7}>
                    <View style={[s.issueIconWrap, { backgroundColor: sv.bg }]}>
                      <Text style={s.issueEmoji}>{TYPE_EMOJI[issue.type] || '⚠️'}</Text>
                    </View>
                    <View style={s.issueBody}>
                      <Text style={s.issueTitle} numberOfLines={1}>{issue.title}</Text>
                      <Text style={s.issueMeta} numberOfLines={1}>{issue.address} · {issue.reportedAt}</Text>
                    </View>
                    <View style={[s.sevBadge, { backgroundColor: sv.bg }]}>
                      <Text style={[s.sevBadgeText, { color: sv.color }]}>{sv.label}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })
            )}
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.colors.bg },

  /* ── HERO ── */
  heroWrap: {
    backgroundColor: theme.colors.navy,
    paddingHorizontal: 22, paddingTop: 18, paddingBottom: 28,
    position: 'relative', overflow: 'hidden',
  },
  heroBg1: { position: 'absolute', width: 220, height: 220, borderRadius: 110, backgroundColor: theme.colors.navyLight, top: -80, right: -60 },
  heroBg2: { position: 'absolute', width: 150, height: 150, borderRadius: 75,  backgroundColor: theme.colors.blue, opacity: 0.08, bottom: 0, left: -40 },
  heroBg3: { position: 'absolute', width: 80,  height: 80,  borderRadius: 40,  backgroundColor: theme.colors.navyMid, top: 60, right: 30 },

  heroTop:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 },
  liveBadge:  { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(255,255,255,0.1)', paddingHorizontal: 10, paddingVertical: 5, borderRadius: theme.radius.full },
  liveDot:    { width: 7, height: 7, borderRadius: 4, backgroundColor: theme.colors.live },
  liveText:   { fontSize: 10, color: 'rgba(255,255,255,0.85)', fontWeight: '700', letterSpacing: 1 },
  avatarBtn:  { width: 36, height: 36, borderRadius: 18, backgroundColor: theme.colors.blue, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 15, fontWeight: '800', color: '#fff' },

  heroCity:  { fontSize: 13, color: 'rgba(255,255,255,0.6)', fontWeight: '600', letterSpacing: 1, marginBottom: 4 },
  heroTitle: { fontSize: 30, fontWeight: '900', color: '#fff', letterSpacing: -0.5, marginBottom: 6, lineHeight: 34 },
  heroSub:   { fontSize: 13, color: 'rgba(255,255,255,0.55)', marginBottom: 22, lineHeight: 18 },

  heroActions: { flexDirection: 'row', gap: 10, marginBottom: 24 },
  heroBtn: {
    backgroundColor: theme.colors.blue,
    paddingHorizontal: 18, paddingVertical: 11, borderRadius: theme.radius.full,
    shadowColor: theme.colors.blue, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.45, shadowRadius: 10, elevation: 5,
  },
  heroBtnText:   { fontSize: 14, fontWeight: '800', color: '#fff' },
  heroGhost:     { paddingHorizontal: 18, paddingVertical: 11, borderRadius: theme.radius.full, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.25)' },
  heroGhostText: { fontSize: 14, fontWeight: '600', color: 'rgba(255,255,255,0.8)' },

  heroStats:   { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: theme.radius.md, paddingVertical: 14 },
  heroStat:    { flex: 1, alignItems: 'center' },
  heroStatNum: { fontSize: 20, fontWeight: '900', color: '#fff', letterSpacing: -0.5 },
  heroStatLabel:{ fontSize: 10, color: 'rgba(255,255,255,0.5)', marginTop: 3, fontWeight: '600' },
  heroStatDiv: { width: 1, backgroundColor: 'rgba(255,255,255,0.12)' },

  /* ── CONTENT ── */
  content: { paddingHorizontal: 18, paddingTop: 22, paddingBottom: 40 },

  sectionRow:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: theme.colors.textPrimary, marginBottom: 12 },
  seeAll:       { fontSize: 13, color: theme.colors.blue, fontWeight: '700' },

  actionsRow: { flexDirection: 'row', gap: 10, marginBottom: 28 },
  actionCard: {
    flex: 1, borderRadius: theme.radius.md, paddingVertical: 16,
    alignItems: 'center', gap: 8,
    ...{ shadowColor: '#0D1F3C', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 2 },
  },
  actionIconWrap: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  actionEmoji:    { fontSize: 22 },
  actionLabel:    { fontSize: 12, fontWeight: '700' },

  issueList: { gap: 10 },
  issueCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md, padding: 14,
    borderWidth: 1, borderColor: theme.colors.border,
    shadowColor: '#0D1F3C', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 1,
  },
  issueIconWrap: { width: 42, height: 42, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  issueEmoji:    { fontSize: 20 },
  issueBody:     { flex: 1 },
  issueTitle:    { fontSize: 14, fontWeight: '700', color: theme.colors.textPrimary, marginBottom: 3 },
  issueMeta:     { fontSize: 11, color: theme.colors.textTertiary },
  sevBadge:      { paddingHorizontal: 10, paddingVertical: 4, borderRadius: theme.radius.full },
  sevBadgeText:  { fontSize: 11, fontWeight: '700' },

  emptyBox:  { alignItems: 'center', paddingVertical: 36, backgroundColor: theme.colors.card, borderRadius: theme.radius.md, borderWidth: 1, borderColor: theme.colors.border },
  emptyEmoji:{ fontSize: 36, marginBottom: 10 },
  emptyTitle:{ fontSize: 16, fontWeight: '800', color: theme.colors.textPrimary, marginBottom: 4 },
  emptyText: { fontSize: 13, color: theme.colors.textTertiary },
});