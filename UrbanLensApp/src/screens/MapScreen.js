import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Animated, ActivityIndicator, StatusBar } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { theme } from '../utils/theme';
import { issueService } from '../services/issueService';
import { locationService } from '../services/locationService';

const FILTERS = [
  { id: 'all',         label: 'All',       emoji: '🗂️', color: theme.colors.blue },
  { id: 'pothole',     label: 'Potholes',  emoji: '🕳️', color: theme.colors.red },
  { id: 'garbage',     label: 'Garbage',   emoji: '🗑️', color: theme.colors.orange },
  { id: 'streetlight', label: 'Lights',    emoji: '💡', color: '#D97706' },
  { id: 'flooding',    label: 'Flooding',  emoji: '🌊', color: theme.colors.blue },
  { id: 'graffiti',    label: 'Graffiti',  emoji: '🖌️', color: theme.colors.purple },
];
const SEV_COLOR = { high: theme.colors.red, medium: theme.colors.orange, low: theme.colors.green };
const SEV_EMOJI = { high: '🔴', medium: '🟠', low: '🟢' };

const CLEAN_MAP = [
  { elementType: 'geometry',           stylers: [{ color: '#F0F4F8' }] },
  { elementType: 'labels.text.fill',   stylers: [{ color: '#64748B' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#F0F4F8' }] },
  { featureType: 'road',         elementType: 'geometry',        stylers: [{ color: '#FFFFFF' }] },
  { featureType: 'road',         elementType: 'geometry.stroke', stylers: [{ color: '#E2E8F0' }] },
  { featureType: 'road.highway', elementType: 'geometry',        stylers: [{ color: '#FFFFFF' }] },
  { featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{ color: '#CBD5E1' }] },
  { featureType: 'poi',          elementType: 'geometry',        stylers: [{ color: '#E8F0F8' }] },
  { featureType: 'poi.park',     elementType: 'geometry',        stylers: [{ color: '#D1FAE5' }] },
  { featureType: 'water',        elementType: 'geometry',        stylers: [{ color: '#BFDBFE' }] },
  { featureType: 'transit',      elementType: 'geometry',        stylers: [{ color: '#E2E8F0' }] },
];

function IssueMarker({ issue, selected, onPress }) {
  const color = SEV_COLOR[issue.severity] || theme.colors.orange;
  const f = FILTERS.find(f => f.id === issue.type);
  const size = selected ? 38 : 30;
  return (
    <Marker coordinate={issue.coordinates} onPress={() => onPress(issue)} tracksViewChanges={false}>
      <View style={{ width: size, height: size, borderRadius: size / 2, borderWidth: selected ? 2.5 : 2, borderColor: color, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', shadowColor: color, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.4, shadowRadius: 6, elevation: 4 }}>
        <Text style={{ fontSize: selected ? 15 : 11 }}>{f?.emoji || '⚠️'}</Text>
      </View>
    </Marker>
  );
}

function BottomSheet({ issue, onClose }) {
  const slideY = useRef(new Animated.Value(340)).current;
  useEffect(() => {
    Animated.spring(slideY, { toValue: issue ? 0 : 340, tension: 70, friction: 12, useNativeDriver: true }).start();
  }, [issue]);
  const sevColor = SEV_COLOR[issue?.severity] || theme.colors.orange;
  const f = FILTERS.find(f => f.id === issue?.type);
  return (
    <Animated.View style={[s.sheet, { transform: [{ translateY: slideY }] }]}>
      <View style={s.sheetHandle} />
      {issue && (
        <>
          <View style={s.sheetTop}>
            <View style={[s.sheetIconWrap, { backgroundColor: sevColor + '18' }]}>
              <Text style={s.sheetEmoji}>{f?.emoji || '⚠️'}</Text>
            </View>
            <View style={s.sheetInfo}>
              <Text style={s.sheetTitle} numberOfLines={1}>{issue.title}</Text>
              <Text style={s.sheetAddr} numberOfLines={1}>📍 {issue.address}</Text>
            </View>
            <TouchableOpacity style={s.closeBtn} onPress={onClose}>
              <Text style={s.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>
          <View style={s.sheetMeta}>
            <View style={[s.sevPill, { backgroundColor: sevColor + '18' }]}>
              <Text>{SEV_EMOJI[issue.severity]}</Text>
              <Text style={[s.sevPillText, { color: sevColor }]}>{issue.severity?.toUpperCase()}</Text>
            </View>
            <Text style={s.sheetDate}>{issue.reportedAt}</Text>
            <Text style={s.upvotes}>👍 {issue.upvotes ?? 0}</Text>
          </View>
          {issue.description ? <Text style={s.sheetDesc}>{issue.description}</Text> : null}
          <View style={s.sheetActions}>
            <TouchableOpacity style={s.actionGhost}><Text style={[s.actionGhostText, { color: theme.colors.blue }]}>👍 Upvote</Text></TouchableOpacity>
            <TouchableOpacity style={s.actionGhost}><Text style={s.actionGhostText}>↗ Share</Text></TouchableOpacity>
            <TouchableOpacity style={s.actionPrimary}><Text style={s.actionPrimaryText}>🧭 Directions</Text></TouchableOpacity>
          </View>
        </>
      )}
    </Animated.View>
  );
}

export default function MapScreen({ navigation }) {
  const mapRef = useRef(null);
  const [issues, setIssues]     = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [activeFilter, setAF]   = useState('all');
  const [selected, setSelected] = useState(null);
  const [userLoc, setUserLoc]   = useState(null);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        const [data, loc] = await Promise.all([issueService.getIssues(), locationService.getCurrentLocation()]);
        setIssues(data); setFiltered(data);
        if (loc) setUserLoc(loc);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    init();
  }, []);

  useEffect(() => {
    setFiltered(activeFilter === 'all' ? issues : issues.filter(i => i.type === activeFilter));
    setSelected(null);
  }, [activeFilter, issues]);

  const defaultRegion = userLoc ? { ...userLoc, latitudeDelta: 0.025, longitudeDelta: 0.025 } : { latitude: 28.6139, longitude: 77.2090, latitudeDelta: 0.025, longitudeDelta: 0.025 };

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.navy} />
      <View style={s.filterBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.filterScroll}>
          {FILTERS.map(f => {
            const active = f.id === activeFilter;
            return (
              <TouchableOpacity key={f.id} style={[s.filterChip, active && { backgroundColor: f.color, borderColor: f.color }]} onPress={() => setAF(f.id)} activeOpacity={0.75}>
                <Text style={s.filterEmoji}>{f.emoji}</Text>
                <Text style={[s.filterLabel, { color: active ? '#fff' : 'rgba(255,255,255,0.6)' }]}>{f.label}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
      <View style={s.mapWrap}>
        {loading ? (
          <View style={s.loadingOverlay}>
            <ActivityIndicator color={theme.colors.blue} size="large" />
            <Text style={s.loadingText}>Loading map…</Text>
          </View>
        ) : (
          <MapView ref={mapRef} style={s.map} provider={PROVIDER_GOOGLE} initialRegion={defaultRegion} customMapStyle={CLEAN_MAP} showsUserLocation showsMyLocationButton={false} onPress={() => setSelected(null)}>
            {filtered.map(issue => <IssueMarker key={issue.id} issue={issue} selected={selected?.id === issue.id} onPress={setSelected} />)}
          </MapView>
        )}
        <View style={s.countBadge}><Text style={s.countText}>📌 {filtered.length} issues</Text></View>
        <TouchableOpacity style={s.locBtn} onPress={async () => { const loc = await locationService.getCurrentLocation(); if (loc && mapRef.current) mapRef.current.animateToRegion({ ...loc, latitudeDelta: 0.01, longitudeDelta: 0.01 }, 400); }}>
          <Text style={{ fontSize: 20 }}>🎯</Text>
        </TouchableOpacity>
        <TouchableOpacity style={s.fab} onPress={() => navigation.navigate('Report')} activeOpacity={0.88}>
          <Text style={s.fabText}>+ Report</Text>
        </TouchableOpacity>
      </View>
      <BottomSheet issue={selected} onClose={() => setSelected(null)} />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:         { flex: 1, backgroundColor: theme.colors.navy },
  filterBar:    { backgroundColor: theme.colors.navy, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.08)' },
  filterScroll: { paddingHorizontal: 16, paddingVertical: 10, gap: 8 },
  filterChip:   { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 12, paddingVertical: 7, borderRadius: theme.radius.full, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.15)', backgroundColor: 'rgba(255,255,255,0.05)' },
  filterEmoji:  { fontSize: 13 },
  filterLabel:  { fontSize: 12, fontWeight: '600' },
  mapWrap:      { flex: 1 },
  map:          { flex: 1 },
  loadingOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: theme.colors.bg, alignItems: 'center', justifyContent: 'center', gap: 12 },
  loadingText:  { fontSize: 14, color: theme.colors.textSecondary, fontWeight: '600' },
  countBadge:   { position: 'absolute', top: 12, left: 12, backgroundColor: 'rgba(255,255,255,0.96)', borderWidth: 1, borderColor: theme.colors.border, borderRadius: theme.radius.full, paddingHorizontal: 12, paddingVertical: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 6, elevation: 3 },
  countText:    { fontSize: 12, fontWeight: '700', color: theme.colors.textSecondary },
  locBtn:       { position: 'absolute', top: 12, right: 12, width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.96)', borderWidth: 1, borderColor: theme.colors.border, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 6, elevation: 3 },
  fab:          { position: 'absolute', bottom: 24, right: 16, backgroundColor: theme.colors.blue, paddingHorizontal: 20, paddingVertical: 12, borderRadius: theme.radius.full, shadowColor: theme.colors.blue, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.45, shadowRadius: 12, elevation: 8 },
  fabText:      { fontSize: 14, fontWeight: '800', color: '#fff' },
  sheet:        { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, borderTopWidth: 1, borderColor: theme.colors.border, paddingHorizontal: 20, paddingBottom: 32, shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 8 },
  sheetHandle:  { width: 40, height: 4, borderRadius: 2, backgroundColor: theme.colors.border, alignSelf: 'center', marginTop: 12, marginBottom: 16 },
  sheetTop:     { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  sheetIconWrap:{ width: 42, height: 42, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  sheetEmoji:   { fontSize: 22 },
  sheetInfo:    { flex: 1 },
  sheetTitle:   { fontSize: 15, fontWeight: '800', color: theme.colors.textPrimary },
  sheetAddr:    { fontSize: 12, color: theme.colors.textTertiary, marginTop: 2 },
  closeBtn:     { width: 28, height: 28, borderRadius: 14, backgroundColor: theme.colors.bg, alignItems: 'center', justifyContent: 'center' },
  closeBtnText: { fontSize: 12, color: theme.colors.textTertiary, fontWeight: '800' },
  sheetMeta:    { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  sevPill:      { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 10, paddingVertical: 4, borderRadius: theme.radius.full },
  sevPillText:  { fontSize: 11, fontWeight: '700' },
  sheetDate:    { flex: 1, fontSize: 12, color: theme.colors.textTertiary },
  upvotes:      { fontSize: 13, color: theme.colors.textSecondary, fontWeight: '600' },
  sheetDesc:    { fontSize: 13, color: theme.colors.textSecondary, lineHeight: 19, marginBottom: 14 },
  sheetActions: { flexDirection: 'row', gap: 8 },
  actionGhost:  { paddingHorizontal: 14, paddingVertical: 10, borderWidth: 1.5, borderColor: theme.colors.border, borderRadius: theme.radius.sm },
  actionGhostText: { fontSize: 13, fontWeight: '600', color: theme.colors.textSecondary },
  actionPrimary:   { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.colors.blue, borderRadius: theme.radius.sm, paddingVertical: 10, shadowColor: theme.colors.blue, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.4, shadowRadius: 8, elevation: 4 },
  actionPrimaryText: { fontSize: 13, fontWeight: '800', color: '#fff' },
});