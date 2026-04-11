import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { theme } from '../utils/theme';
import { getIssues } from '../services/issueService';
import { getCurrentLocation } from '../services/locationService';
import { MapMarker, BottomSheetIssue, Chip } from '../components';

const BENGALURU = { latitude: 12.9716, longitude: 77.5946, latitudeDelta: 0.08, longitudeDelta: 0.08 };

const FILTERS = [
  { label: 'All', type: 'All' },
  { label: '🕳️ Potholes', type: 'Pothole' },
  { label: '🗑️ Garbage', type: 'Garbage' },
  { label: '💡 Lights', type: 'Streetlight' },
  { label: '🌊 Flooding', type: 'Flooding' },
  { label: '🖌️ Graffiti', type: 'Graffiti' },
];

const DARK_MAP_STYLE = [
  { elementType: 'geometry', stylers: [{ color: '#0B1220' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#0B1220' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#9CA3AF' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#1F2937' }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#111827' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#06374a' }] },
  { featureType: 'poi', stylers: [{ visibility: 'off' }] },
  { featureType: 'transit', stylers: [{ visibility: 'off' }] },
];

export default function MapScreen({ navigation }) {
  const mapRef = useRef(null);
  const [issues, setIssues] = useState([]);
  const [filteredIssues, setFilteredIssues] = useState([]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedIssue, setSelectedIssue] = useState(null);

  useEffect(() => {
    loadIssues();
  }, []);

  useEffect(() => {
    if (activeFilter === 'All') {
      setFilteredIssues(issues);
    } else {
      setFilteredIssues(issues.filter(i => i.type === activeFilter));
    }
  }, [activeFilter, issues]);

  const loadIssues = async () => {
    const data = await getIssues();
    setIssues(data);
    setFilteredIssues(data);
  };

  const handleLocate = async () => {
    try {
      const loc = await getCurrentLocation();
      mapRef.current?.animateToRegion({
        ...loc,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      }, 800);
    } catch (e) {
      // permission denied — silently ignore
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.background} />

      {/* Map */}
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={StyleSheet.absoluteFill}
        initialRegion={BENGALURU}
        customMapStyle={DARK_MAP_STYLE}
        showsUserLocation
        showsMyLocationButton={false}
        onPress={() => setSelectedIssue(null)}
      >
        {filteredIssues.map(issue => (
          <MapMarker
            key={issue.id}
            coordinate={issue.coordinates}
            issue={issue}
            selected={selectedIssue?.id === issue.id}
            onPress={() => setSelectedIssue(issue)}
          />
        ))}
      </MapView>

      {/* ── Filter chips ── */}
      <View style={styles.filterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
          {FILTERS.map(f => (
            <Chip
              key={f.type}
              label={f.label}
              active={activeFilter === f.type}
              onPress={() => setActiveFilter(f.type)}
            />
          ))}
        </ScrollView>
      </View>

      {/* ── Issue counter badge ── */}
      <View style={styles.badge}>
        <Text style={styles.badgeText}>🗺️  {filteredIssues.length} issues</Text>
      </View>

      {/* ── Floating controls ── */}
      <View style={styles.controls}>
        <TouchableOpacity style={styles.controlBtn} onPress={handleLocate} activeOpacity={0.85}>
          <Text style={styles.controlEmoji}>📍</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.reportBtn}
          onPress={() => navigation.navigate('Report')}
          activeOpacity={0.85}
        >
          <Text style={styles.reportBtnText}>📸  Report</Text>
        </TouchableOpacity>
      </View>

      {/* ── Bottom sheet ── */}
      <BottomSheetIssue
        issue={selectedIssue}
        onClose={() => setSelectedIssue(null)}
        onUpvote={() => {}}
        onNavigate={() => {}}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.colors.background },
  filterContainer: {
    position: 'absolute',
    top: 12,
    left: 0,
    right: 0,
  },
  filterRow: {
    paddingHorizontal: 16,
    gap: 8,
  },
  badge: {
    position: 'absolute',
    top: 64,
    alignSelf: 'center',
    backgroundColor: theme.colors.surface + 'EE',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  badgeText: { fontSize: 12, color: theme.colors.textPrimary, fontWeight: '600' },
  controls: {
    position: 'absolute',
    right: 16,
    bottom: 32,
    gap: 10,
    alignItems: 'flex-end',
  },
  controlBtn: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadow,
  },
  controlEmoji: { fontSize: 20 },
  reportBtn: {
    backgroundColor: theme.colors.blue,
    paddingHorizontal: 18,
    paddingVertical: 13,
    borderRadius: theme.radius.button,
    ...theme.shadow,
  },
  reportBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
});