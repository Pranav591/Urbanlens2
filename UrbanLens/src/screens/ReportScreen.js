import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { theme } from '../utils/theme';
import { createIssue } from '../services/issueService';
import { getCurrentLocation, reverseGeocode } from '../services/locationService';
import { captureFromCamera, pickFromLibrary } from '../services/imageService';
import {
  ScreenContainer,
  Card,
  TextInputField,
  PrimaryButton,
  EmojiIcon,
  SectionHeader,
} from '../components';

const ISSUE_TYPES = [
  { type: 'Pothole', icon: '🕳️', color: '#EF4444' },
  { type: 'Garbage', icon: '🗑️', color: '#F59E0B' },
  { type: 'Streetlight', icon: '💡', color: '#EAB308' },
  { type: 'Flooding', icon: '🌊', color: '#06B6D4' },
  { type: 'Graffiti', icon: '🖌️', color: '#A855F7' },
  { type: 'Other', icon: '⚠️', color: '#6366F1' },
];

const SEVERITIES = [
  { label: 'Low', color: theme.colors.green },
  { label: 'Medium', color: theme.colors.amber },
  { label: 'High', color: theme.colors.red },
];

export default function ReportScreen({ navigation }) {
  const [photo, setPhoto] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [severity, setSeverity] = useState('Medium');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('Tap to fetch location…');
  const [coordinates, setCoordinates] = useState(null);
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);

  const handleCamera = async () => {
    try {
      const asset = await captureFromCamera();
      if (asset) setPhoto(asset.uri);
    } catch (e) { Alert.alert('Camera Error', e.message); }
  };

  const handleGallery = async () => {
    try {
      const asset = await pickFromLibrary();
      if (asset) setPhoto(asset.uri);
    } catch (e) { Alert.alert('Gallery Error', e.message); }
  };

  const handleFetchLocation = async () => {
    setLocationLoading(true);
    try {
      const loc = await getCurrentLocation();
      setCoordinates(loc);
      const addr = await reverseGeocode(loc.latitude, loc.longitude);
      setAddress(addr);
    } catch (e) {
      Alert.alert('Location Error', e.message);
    } finally {
      setLocationLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedType) { Alert.alert('Missing Info', 'Please select an issue type.'); return; }
    if (!title.trim()) { Alert.alert('Missing Info', 'Please enter a title.'); return; }

    const issueType = ISSUE_TYPES.find(t => t.type === selectedType);
    setLoading(true);
    try {
      await createIssue({
        title: title.trim(),
        description: description.trim(),
        type: selectedType,
        icon: issueType.icon,
        color: issueType.color,
        severity,
        address: coordinates ? address : 'Location not set',
        coordinates: coordinates ?? { latitude: 12.9716, longitude: 77.5946 },
        photo,
      });
      Alert.alert('Report Submitted! ✅', 'Thank you for helping improve your city.', [
        { text: 'View Map', onPress: () => navigation.navigate('Map') },
        { text: 'OK' },
      ]);
      // Reset form
      setPhoto(null); setSelectedType(null); setSeverity('Medium');
      setTitle(''); setDescription(''); setAddress('Tap to fetch location…');
      setCoordinates(null);
    } catch (e) {
      Alert.alert('Error', e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer scrollable padding={20}>
      <SectionHeader title="Report Issue" style={styles.pageTitle} />

      {/* ── Photo ── */}
      <Card noPadding style={styles.photoCard}>
        {photo ? (
          <View>
            <Image source={{ uri: photo }} style={styles.photoPreview} />
            <TouchableOpacity style={styles.removePhoto} onPress={() => setPhoto(null)}>
              <Text style={styles.removePhotoText}>✕</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.photoPlaceholder}>
            <Text style={styles.cameraEmoji}>📷</Text>
            <Text style={styles.photoHint}>Add a photo of the issue</Text>
            <View style={styles.photoButtons}>
              <TouchableOpacity style={styles.photoBtn} onPress={handleCamera} activeOpacity={0.8}>
                <Text style={styles.photoBtnText}>📸  Camera</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.photoBtn} onPress={handleGallery} activeOpacity={0.8}>
                <Text style={styles.photoBtnText}>🖼️  Gallery</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Card>

      {/* ── Issue type grid ── */}
      <Text style={styles.sectionLabel}>Issue Type</Text>
      <View style={styles.typeGrid}>
        {ISSUE_TYPES.map(t => {
          const active = selectedType === t.type;
          return (
            <TouchableOpacity
              key={t.type}
              style={[
                styles.typeCell,
                active && { borderColor: t.color, backgroundColor: t.color + '22' },
              ]}
              onPress={() => setSelectedType(t.type)}
              activeOpacity={0.75}
            >
              <EmojiIcon emoji={t.icon} color={t.color} size="md" />
              <Text style={[styles.typeCellLabel, active && { color: t.color }]}>{t.type}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* ── Severity ── */}
      <Text style={styles.sectionLabel}>Severity</Text>
      <View style={styles.severityRow}>
        {SEVERITIES.map(s => {
          const active = severity === s.label;
          return (
            <TouchableOpacity
              key={s.label}
              style={[
                styles.severityBtn,
                active && { backgroundColor: s.color + '22', borderColor: s.color },
              ]}
              onPress={() => setSeverity(s.label)}
              activeOpacity={0.8}
            >
              <Text style={[styles.severityLabel, active && { color: s.color }]}>{s.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* ── Details ── */}
      <Text style={styles.sectionLabel}>Details</Text>
      <TextInputField
        placeholder="e.g. Large pothole on MG Road"
        value={title}
        onChangeText={setTitle}
        label="Title *"
      />
      <View style={styles.gap} />
      <TextInputField
        placeholder="Describe the issue in detail…"
        value={description}
        onChangeText={setDescription}
        label="Description"
        multiline
        numberOfLines={4}
      />

      {/* ── Location ── */}
      <Text style={styles.sectionLabel}>Location</Text>
      <TouchableOpacity
        style={styles.locationCard}
        onPress={handleFetchLocation}
        activeOpacity={0.8}
      >
        <Text style={styles.locationEmoji}>📍</Text>
        <View style={styles.locationText}>
          <Text style={styles.locationAddr} numberOfLines={1}>{address}</Text>
          <Text style={styles.locationHint}>
            {locationLoading ? 'Fetching…' : 'Tap to use current location'}
          </Text>
        </View>
        <Text style={styles.locationRefresh}>🔄</Text>
      </TouchableOpacity>

      {/* ── Submit ── */}
      <PrimaryButton
        label="Submit Report"
        onPress={handleSubmit}
        loading={loading}
        icon="📤"
        style={styles.submitBtn}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  pageTitle: { marginBottom: 4 },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    letterSpacing: 0.4,
    marginTop: 20,
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  photoCard: { overflow: 'hidden' },
  photoPlaceholder: {
    height: 160,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  cameraEmoji: { fontSize: 36 },
  photoHint: { fontSize: 13, color: theme.colors.textSecondary },
  photoButtons: { flexDirection: 'row', gap: 10, marginTop: 4 },
  photoBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: theme.colors.elevated,
    borderRadius: theme.radius.button,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  photoBtnText: { color: theme.colors.textPrimary, fontWeight: '500', fontSize: 13 },
  photoPreview: { width: '100%', height: 200, borderRadius: 16 },
  removePhoto: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.6)',
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removePhotoText: { color: '#fff', fontSize: 14, fontWeight: '700' },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  typeCell: {
    width: '30%',
    aspectRatio: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  typeCellLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: theme.colors.textSecondary,
  },
  severityRow: { flexDirection: 'row', gap: 10 },
  severityBtn: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: theme.radius.button,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
  },
  severityLabel: { fontSize: 14, fontWeight: '600', color: theme.colors.textSecondary },
  gap: { height: 14 },
  locationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.card,
    padding: 14,
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: 12,
  },
  locationEmoji: { fontSize: 22 },
  locationText: { flex: 1 },
  locationAddr: { fontSize: 14, color: theme.colors.textPrimary, fontWeight: '500' },
  locationHint: { fontSize: 11, color: theme.colors.textSecondary, marginTop: 2 },
  locationRefresh: { fontSize: 18 },
  submitBtn: { marginTop: 28, width: '100%' },
});