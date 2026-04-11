import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { theme } from '../utils/theme';
import { getIssues, getStats } from '../services/issueService';
import {
  ScreenContainer,
  Card,
  StatTile,
  SectionHeader,
  Pill,
  EmojiIcon,
} from '../components';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BAR_AREA = SCREEN_WIDTH - 40 - 32 - 28; // screen - padding - card padding - label col

const TIME_RANGES = ['7D', '30D', '3M', '1Y'];

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const ISSUE_TYPE_META = [
  { type: 'Pothole', icon: '🕳️', color: theme.colors.red },
  { type: 'Garbage', icon: '🗑️', color: theme.colors.amber },
  { type: 'Streetlight', icon: '💡', color: '#EAB308' },
  { type: 'Flooding', icon: '🌊', color: theme.colors.cyan },
  { type: 'Graffiti', icon: '🖌️', color: theme.colors.purple },
  { type: 'Other', icon: '⚠️', color: theme.colors.indigo },
];

function BarChart({ data, maxValue, color }) {
  return (
    <View style={chartStyles.container}>
      {data.map((item, i) => {
        const pct = maxValue > 0 ? item.value / maxValue : 0;
        return (
          <View key={i} style={chartStyles.barCol}>
            <Text style={chartStyles.value}>{item.value > 0 ? item.value : ''}</Text>
            <View style={chartStyles.barTrack}>
              <View
                style={[
                  chartStyles.bar,
                  {
                    height: Math.max(4, pct * 80),
                    backgroundColor: color,
                  },
                ]}
              />
            </View>
            <Text style={chartStyles.label}>{item.label}</Text>
          </View>
        );
      })}
    </View>
  );
}

const chartStyles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', height: 110 },
  barCol: { flex: 1, alignItems: 'center', gap: 4 },
  value: { fontSize: 9, color: theme.colors.textSecondary },
  barTrack: { height: 80, justifyContent: 'flex-end' },
  bar: { width: 14, borderRadius: 6 },
  label: { fontSize: 9, color: theme.colors.textSecondary },
});

export default function DashboardScreen() {
  const [timeRange, setTimeRange] = useState('7D');
  const [stats, setStats] = useState({ total: 0, resolved: 0, pending: 0, critical: 0 });
  const [issues, setIssues] = useState([]);

  useFocusEffect(
    useCallback(() => {
      Promise.all([getStats(), getIssues()]).then(([s, all]) => {
        setStats(s);
        setIssues(all);
      });
    }, []),
  );

  // Reports by day of week
  const byDay = DAYS.map(day => ({
    label: day.slice(0, 2),
    value: issues.filter(i => i.dayOfWeek === day).length,
  }));
  const maxDay = Math.max(...byDay.map(d => d.value), 1);

  // By severity
  const bySeverity = [
    { label: 'Low', value: issues.filter(i => i.severity === 'Low').length, color: theme.colors.green },
    { label: 'Med', value: issues.filter(i => i.severity === 'Medium').length, color: theme.colors.amber },
    { label: 'High', value: issues.filter(i => i.severity === 'High').length, color: theme.colors.red },
    { label: 'Crit', value: issues.filter(i => i.severity === 'Critical').length, color: theme.colors.red },
  ];
  const maxSev = Math.max(...bySeverity.map(d => d.value), 1);

  // By type
  const byType = ISSUE_TYPE_META.map(t => ({
    ...t,
    count: issues.filter(i => i.type === t.type).length,
  }));

  return (
    <ScreenContainer scrollable padding={20}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Analytics</Text>
          <Text style={styles.subtitle}>Bengaluru civic issue trends</Text>
        </View>
        <Text style={styles.headerEmoji}>📊</Text>
      </View>

      {/* Time range */}
      <View style={styles.timeRow}>
        {TIME_RANGES.map(r => (
          <TouchableOpacity
            key={r}
            style={[styles.rangeBtn, timeRange === r && styles.rangeBtnActive]}
            onPress={() => setTimeRange(r)}
            activeOpacity={0.8}
          >
            <Text style={[styles.rangeLabel, timeRange === r && styles.rangeLabelActive]}>{r}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Summary cards */}
      <View style={styles.statsGrid}>
        <StatTile icon="📝" label="Total" value={String(stats.total)} color={theme.colors.blue} />
        <StatTile icon="✅" label="Resolved" value={String(stats.resolved)} color={theme.colors.green} />
      </View>
      <View style={styles.statsGrid}>
        <StatTile icon="⏳" label="Pending" value={String(stats.pending)} color={theme.colors.amber} />
        <StatTile icon="🚨" label="Critical" value={String(stats.critical)} color={theme.colors.red} />
      </View>

      {/* Reports by day */}
      <SectionHeader title="Reports by Day" />
      <Card>
        <BarChart data={byDay} maxValue={maxDay} color={theme.colors.blue} />
      </Card>

      {/* Reports by severity */}
      <SectionHeader title="By Severity" style={styles.sectionGap} />
      <Card>
        <View style={styles.severityBars}>
          {bySeverity.map(s => (
            <View key={s.label} style={styles.severityRow}>
              <Text style={styles.severityLbl}>{s.label}</Text>
              <View style={styles.sevTrack}>
                <View
                  style={[
                    styles.sevBar,
                    {
                      width: `${Math.max(4, (s.value / maxSev) * 100)}%`,
                      backgroundColor: s.color,
                    },
                  ]}
                />
              </View>
              <Text style={styles.sevCount}>{s.value}</Text>
            </View>
          ))}
        </View>
      </Card>

      {/* Issue type breakdown */}
      <SectionHeader title="Issue Breakdown" style={styles.sectionGap} />
      <Card>
        <View style={styles.typeList}>
          {byType.map(t => (
            <View key={t.type} style={styles.typeRow}>
              <EmojiIcon emoji={t.icon} color={t.color} size="sm" />
              <Text style={styles.typeName}>{t.type}</Text>
              <View style={styles.typeTrack}>
                <View
                  style={[
                    styles.typeBar,
                    {
                      width: `${Math.max(4, (t.count / Math.max(stats.total, 1)) * 100)}%`,
                      backgroundColor: t.color,
                    },
                  ]}
                />
              </View>
              <Pill text={String(t.count)} color={t.color} />
            </View>
          ))}
        </View>
      </Card>

      <View style={styles.bottomPad} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  title: { fontSize: 26, fontWeight: '700', color: theme.colors.textPrimary },
  subtitle: { fontSize: 13, color: theme.colors.textSecondary, marginTop: 2 },
  headerEmoji: { fontSize: 30 },
  timeRow: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.card,
    padding: 4,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  rangeBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
  },
  rangeBtnActive: { backgroundColor: theme.colors.blue },
  rangeLabel: { fontSize: 13, fontWeight: '600', color: theme.colors.textSecondary },
  rangeLabelActive: { color: '#fff' },
  statsGrid: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  sectionGap: { marginTop: 8 },
  severityBars: { gap: 12 },
  severityRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  severityLbl: { width: 28, fontSize: 11, color: theme.colors.textSecondary, fontWeight: '500' },
  sevTrack: { flex: 1, height: 8, backgroundColor: theme.colors.elevated, borderRadius: 4, overflow: 'hidden' },
  sevBar: { height: 8, borderRadius: 4 },
  sevCount: { width: 20, fontSize: 11, color: theme.colors.textSecondary, textAlign: 'right' },
  typeList: { gap: 12 },
  typeRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  typeName: { width: 72, fontSize: 12, color: theme.colors.textSecondary, fontWeight: '500' },
  typeTrack: { flex: 1, height: 6, backgroundColor: theme.colors.elevated, borderRadius: 3, overflow: 'hidden' },
  typeBar: { height: 6, borderRadius: 3 },
  bottomPad: { height: 20 },
});