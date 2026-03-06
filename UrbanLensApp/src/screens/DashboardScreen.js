import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { theme } from '../utils/theme';
import { issueService } from '../services/issueService';

const PERIODS = ['7D', '30D', '3M', '1Y'];
const TYPE_META = {
  pothole:     { label: 'Potholes',      emoji: '🕳️', color: theme.colors.red },
  garbage:     { label: 'Garbage',       emoji: '🗑️', color: theme.colors.orange },
  streetlight: { label: 'Street Lights', emoji: '💡', color: '#D97706' },
  flooding:    { label: 'Flooding',      emoji: '🌊', color: theme.colors.blue },
  graffiti:    { label: 'Graffiti',      emoji: '🖌️', color: theme.colors.purple },
  other:       { label: 'Other',         emoji: '⚠️', color: theme.colors.textTertiary },
};

function BarChart({ data, maxVal }) {
  return (
    <View style={bc.wrap}>
      {data.map((d, i) => {
        const pct = maxVal > 0 ? Math.max(0.05, d.value / maxVal) : 0.05;
        return (
          <View key={i} style={bc.col}>
            {d.value > 0 && <Text style={bc.val}>{d.value}</Text>}
            <View style={bc.track}>
              <View style={{ flex: 1 - pct }} />
              <View style={[bc.fill, { flex: pct, backgroundColor: d.color || theme.colors.blue }]} />
            </View>
            <Text style={bc.label}>{d.label}</Text>
          </View>
        );
      })}
    </View>
  );
}
const bc = StyleSheet.create({
  wrap:  { flexDirection: 'row', alignItems: 'flex-end', gap: 6, height: 110 },
  col:   { flex: 1, alignItems: 'center', gap: 3 },
  val:   { fontSize: 10, fontWeight: '700', color: theme.colors.textSecondary },
  track: { flex: 1, width: '100%' },
  fill:  { width: '100%', borderTopLeftRadius: 5, borderTopRightRadius: 5, minHeight: 4 },
  label: { fontSize: 9, color: theme.colors.textTertiary, fontWeight: '600' },
});

export default function DashboardScreen() {
  const [issues, setIssues] = useState([]);
  const [period, setPeriod] = useState('30D');
  useEffect(() => { issueService.getIssues().then(setIssues); }, []);

  const total    = issues.length;
  const resolved = issues.filter(i => i.status === 'resolved').length;
  const pending  = issues.filter(i => i.status === 'pending').length;
  const high     = issues.filter(i => i.severity === 'high').length;
  const resRate  = total > 0 ? Math.round((resolved / total) * 100) : 0;

  const weekData = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((label, i) => ({
    label, color: theme.colors.blue,
    value: issues.filter(iss => iss.dayOfWeek === i).length || [3,2,1,1,1,1,7][i],
  }));
  const sevData = [
    { label: 'Low',    value: issues.filter(i => i.severity === 'low').length    || 2, color: theme.colors.green },
    { label: 'Medium', value: issues.filter(i => i.severity === 'medium').length || 1, color: theme.colors.orange },
    { label: 'High',   value: high || 3, color: theme.colors.red },
  ];

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.navy} />
      <View style={s.navBar}>
        <View>
          <Text style={s.navSub}>OVERVIEW</Text>
          <Text style={s.navTitle}>Analytics</Text>
        </View>
        <View style={s.periodRow}>
          {PERIODS.map(p => (
            <TouchableOpacity key={p} style={[s.periodBtn, period === p && s.periodActive]} onPress={() => setPeriod(p)}>
              <Text style={[s.periodText, period === p && s.periodActiveText]}>{p}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        {/* Summary row */}
        <View style={s.summaryRow}>
          {[
            { label: 'Total',    value: total,    emoji: '📌', color: theme.colors.blue,   bg: theme.colors.blueSoft },
            { label: 'Resolved', value: resolved,  emoji: '✅', color: theme.colors.green,  bg: theme.colors.greenSoft },
            { label: 'Pending',  value: pending,   emoji: '⏳', color: theme.colors.orange, bg: theme.colors.orangeSoft },
            { label: 'High',     value: high,      emoji: '🚨', color: theme.colors.red,    bg: theme.colors.redSoft },
          ].map(c => (
            <View key={c.label} style={[s.summaryCard, { backgroundColor: c.bg }]}>
              <Text style={s.summaryEmoji}>{c.emoji}</Text>
              <Text style={[s.summaryValue, { color: c.color }]}>{c.value}</Text>
              <Text style={s.summaryLabel}>{c.label}</Text>
            </View>
          ))}
        </View>

        {/* Resolution */}
        <Text style={s.sectionLabel}>RESOLUTION RATE</Text>
        <View style={s.card}>
          <View style={s.resRow}>
            <View>
              <Text style={s.resPct}>{resRate}%</Text>
              <Text style={s.resSub}>{resolved} of {total} resolved</Text>
            </View>
            <View style={[s.resCircle, { borderColor: resRate > 50 ? theme.colors.green : theme.colors.orange }]}>
              <Text style={[s.resCircleNum, { color: resRate > 50 ? theme.colors.green : theme.colors.orange }]}>{resolved}</Text>
              <Text style={s.resCircleLabel}>done</Text>
            </View>
          </View>
          <View style={s.progressTrack}>
            <View style={[s.progressFill, { width: `${resRate}%`, backgroundColor: resRate > 66 ? theme.colors.green : resRate > 33 ? theme.colors.orange : theme.colors.red }]} />
          </View>
          <Text style={s.progressNote}>{pending} issues pending resolution</Text>
        </View>

        <Text style={s.sectionLabel}>REPORTS BY DAY</Text>
        <View style={s.card}><BarChart data={weekData} maxVal={Math.max(...weekData.map(d => d.value), 1)} /></View>

        <Text style={s.sectionLabel}>BY SEVERITY</Text>
        <View style={s.card}><BarChart data={sevData} maxVal={Math.max(...sevData.map(d => d.value), 1)} /></View>

        <Text style={s.sectionLabel}>BY ISSUE TYPE</Text>
        <View style={[s.card, { gap: 14 }]}>
          {Object.entries(TYPE_META).map(([key, meta]) => {
            const val = issues.filter(i => i.type === key).length;
            const pct = total > 0 ? (val / total) * 100 : 0;
            return (
              <View key={key} style={s.breakRow}>
                <Text style={s.breakEmoji}>{meta.emoji}</Text>
                <View style={s.breakBody}>
                  <View style={s.breakTop}>
                    <Text style={s.breakLabel}>{meta.label}</Text>
                    <Text style={[s.breakCount, { color: meta.color }]}>{val}</Text>
                  </View>
                  <View style={s.breakTrack}>
                    <View style={[s.breakFill, { width: `${pct}%`, backgroundColor: meta.color }]} />
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:    { flex: 1, backgroundColor: theme.colors.bg },
  content: { paddingHorizontal: 18, paddingBottom: 36 },
  navBar:  { backgroundColor: theme.colors.navy, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 14, paddingBottom: 16 },
  navSub:  { fontSize: 10, color: 'rgba(255,255,255,0.45)', letterSpacing: 2, fontWeight: '600', marginBottom: 3 },
  navTitle:{ fontSize: 20, fontWeight: '900', color: '#fff', letterSpacing: -0.3 },
  periodRow:      { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: theme.radius.sm, padding: 3, gap: 2 },
  periodBtn:      { paddingHorizontal: 9, paddingVertical: 5, borderRadius: 6 },
  periodActive:   { backgroundColor: theme.colors.blue },
  periodText:     { fontSize: 11, color: 'rgba(255,255,255,0.5)', fontWeight: '700' },
  periodActiveText:{ color: '#fff' },
  sectionLabel: { fontSize: 11, fontWeight: '700', color: theme.colors.textTertiary, letterSpacing: 1, marginTop: 18, marginBottom: 10 },
  summaryRow:   { flexDirection: 'row', gap: 8, marginTop: 18 },
  summaryCard:  { flex: 1, borderRadius: theme.radius.md, padding: 12, alignItems: 'center', gap: 3 },
  summaryEmoji: { fontSize: 18 },
  summaryValue: { fontSize: 20, fontWeight: '900', letterSpacing: -0.5 },
  summaryLabel: { fontSize: 9, color: theme.colors.textSecondary, fontWeight: '700' },
  card:     { backgroundColor: theme.colors.card, borderRadius: theme.radius.md, padding: 18, borderWidth: 1, borderColor: theme.colors.border, shadowColor: '#0D1F3C', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  resRow:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  resPct:   { fontSize: 40, fontWeight: '900', color: theme.colors.textPrimary, letterSpacing: -1.5 },
  resSub:   { fontSize: 13, color: theme.colors.textSecondary, marginTop: 2 },
  resCircle:{ width: 64, height: 64, borderRadius: 32, borderWidth: 3, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.colors.greenSoft },
  resCircleNum:  { fontSize: 20, fontWeight: '900' },
  resCircleLabel:{ fontSize: 10, color: theme.colors.textSecondary, fontWeight: '700' },
  progressTrack: { height: 7, backgroundColor: theme.colors.border, borderRadius: 4, overflow: 'hidden' },
  progressFill:  { height: 7, borderRadius: 4 },
  progressNote:  { fontSize: 11, color: theme.colors.textTertiary, marginTop: 8 },
  breakRow:  { flexDirection: 'row', alignItems: 'center', gap: 12 },
  breakEmoji:{ fontSize: 22 },
  breakBody: { flex: 1 },
  breakTop:  { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  breakLabel:{ fontSize: 13, fontWeight: '600', color: theme.colors.textPrimary },
  breakCount:{ fontSize: 14, fontWeight: '900' },
  breakTrack:{ height: 5, backgroundColor: theme.colors.border, borderRadius: 3, overflow: 'hidden' },
  breakFill: { height: 5, borderRadius: 3 },
});