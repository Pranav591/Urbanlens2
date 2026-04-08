import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, ScrollView,
  TouchableOpacity, TextInput, StatusBar, ActivityIndicator,
  Image, Alert,
} from 'react-native';
import { theme } from '../utils/theme';
import { issueService } from '../services/issueService';
import { imageService } from '../services/imageService';
import { locationService } from '../services/locationService';

const TYPES = [
  { id: 'pothole',     label: 'Pothole',      emoji: '🕳️', color: theme.colors.red,    bg: theme.colors.redSoft },
  { id: 'garbage',     label: 'Garbage',      emoji: '🗑️', color: theme.colors.orange, bg: theme.colors.orangeSoft },
  { id: 'streetlight', label: 'Street Light', emoji: '💡', color: '#D97706',            bg: '#FFFBEB' },
  { id: 'flooding',    label: 'Flooding',     emoji: '🌊', color: theme.colors.blue,    bg: theme.colors.blueSoft },
  { id: 'graffiti',    label: 'Graffiti',     emoji: '🖌️', color: theme.colors.purple,  bg: theme.colors.purpleSoft },
  { id: 'other',       label: 'Other',        emoji: '⚠️', color: theme.colors.textSecondary, bg: '#F8FAFC' },
];
const SEVERITIES = [
  { id: 'low',    label: 'Low',    desc: 'Minor inconvenience',  emoji: '🟢', color: theme.colors.green,  bg: theme.colors.greenSoft },
  { id: 'medium', label: 'Medium', desc: 'Needs attention soon', emoji: '🟠', color: theme.colors.orange, bg: theme.colors.orangeSoft },
  { id: 'high',   label: 'High',   desc: 'Urgent / dangerous',   emoji: '🔴', color: theme.colors.red,    bg: theme.colors.redSoft },
];

export default function ReportScreen({ navigation, user }) {
  const [title, setTitle]       = useState('');
  const [description, setDesc]  = useState('');
  const [type, setType]         = useState('');
  const [severity, setSeverity] = useState('');
  const [photo, setPhoto]       = useState(null);
  const [location, setLocation] = useState(null);
  const [locLoading, setLocLoad]= useState(false);
  const [submitting, setSubmit] = useState(false);
  const [focused, setFocused]   = useState('');

  useEffect(() => { fetchLoc(); }, []);
  const fetchLoc = async () => {
    setLocLoad(true);
    try {
      const loc = await locationService.getCurrentLocation();
      const addr = await locationService.reverseGeocode(loc);
      setLocation({ ...loc, address: addr });
    } catch (e) { console.error(e); }
    finally { setLocLoad(false); }
  };

  const isValid = title.trim() && type && severity && location;

  const handleSubmit = async () => {
    if (!isValid) { Alert.alert('Missing info', 'Please fill all required fields.'); return; }
    setSubmit(true);
    try {
      await issueService.createIssue({ title: title.trim(), description: description.trim(), type, severity, coordinates: { latitude: location.latitude, longitude: location.longitude }, address: location.address, photoUri: photo?.uri, reportedBy: user?.email || 'guest' });
      Alert.alert('✅ Reported!', 'Thank you for making your city better.', [
        { text: 'View on Map', onPress: () => navigation.navigate('Map') },
        { text: 'Done', onPress: () => navigation.goBack() },
      ]);
    } catch { Alert.alert('Error', 'Could not submit. Try again.'); }
    finally { setSubmit(false); }
  };

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.navy} />
      <View style={s.navBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={s.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={s.navTitle}>New Report</Text>
        <View style={{ width: 50 }} />
      </View>

      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

        {/* Photo */}
        <Text style={s.sectionLabel}>PHOTO</Text>
        {photo ? (
          <View style={s.photoPreviewWrap}>
            <Image source={{ uri: photo.uri }} style={s.photoPreview} resizeMode="cover" />
            <TouchableOpacity style={s.removeBtn} onPress={() => setPhoto(null)}>
              <Text style={s.removeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={s.photoRow}>
            {[{ label: 'Camera', emoji: '📷', fn: async () => { const r = await imageService.captureFromCamera(); if (r) setPhoto(r); } },
              { label: 'Gallery', emoji: '🖼️', fn: async () => { const r = await imageService.pickFromLibrary(); if (r) setPhoto(r); } }].map(b => (
              <TouchableOpacity key={b.label} style={s.photoBtn} onPress={b.fn} activeOpacity={0.75}>
                <Text style={s.photoBtnEmoji}>{b.emoji}</Text>
                <Text style={s.photoBtnLabel}>{b.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Issue type */}
        <Text style={s.sectionLabel}>ISSUE TYPE</Text>
        <View style={s.typeGrid}>
          {TYPES.map(t => {
            const active = type === t.id;
            return (
              <TouchableOpacity key={t.id} style={[s.typeCard, { backgroundColor: active ? t.bg : theme.colors.card, borderColor: active ? t.color : theme.colors.border }]} onPress={() => setType(t.id)} activeOpacity={0.75}>
                <Text style={s.typeEmoji}>{t.emoji}</Text>
                <Text style={[s.typeLabel, { color: active ? t.color : theme.colors.textSecondary, fontWeight: active ? '700' : '500' }]}>{t.label}</Text>
                {active && <View style={[s.typeActiveDot, { backgroundColor: t.color }]} />}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Severity */}
        <Text style={s.sectionLabel}>SEVERITY</Text>
        <View style={s.sevCol}>
          {SEVERITIES.map(sv => {
            const active = severity === sv.id;
            return (
              <TouchableOpacity key={sv.id} style={[s.sevCard, { backgroundColor: active ? sv.bg : theme.colors.card, borderColor: active ? sv.color : theme.colors.border }]} onPress={() => setSeverity(sv.id)} activeOpacity={0.75}>
                <Text style={s.sevEmoji}>{sv.emoji}</Text>
                <View style={s.sevBody}>
                  <Text style={[s.sevLabel, { color: active ? sv.color : theme.colors.textPrimary }]}>{sv.label}</Text>
                  <Text style={s.sevDesc}>{sv.desc}</Text>
                </View>
                <View style={[s.radio, { borderColor: active ? sv.color : theme.colors.borderStrong }]}>
                  {active && <View style={[s.radioFill, { backgroundColor: sv.color }]} />}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Title */}
        <Text style={s.sectionLabel}>TITLE <Text style={s.required}>*</Text></Text>
        <View style={[s.inputWrap, focused === 'title' && s.inputFocused]}>
          <TextInput style={s.input} value={title} onChangeText={setTitle} placeholder="e.g. Large pothole on MG Road" placeholderTextColor={theme.colors.textTertiary} maxLength={80} onFocus={() => setFocused('title')} onBlur={() => setFocused('')} />
        </View>
        <Text style={s.charCount}>{title.length}/80</Text>

        {/* Details */}
        <Text style={s.sectionLabel}>DETAILS <Text style={s.optional}>(optional)</Text></Text>
        <View style={[s.inputWrap, s.textAreaWrap, focused === 'desc' && s.inputFocused]}>
          <TextInput style={[s.input, s.textArea]} value={description} onChangeText={setDesc} placeholder="Describe the issue in more detail…" placeholderTextColor={theme.colors.textTertiary} multiline numberOfLines={4} textAlignVertical="top" maxLength={300} onFocus={() => setFocused('desc')} onBlur={() => setFocused('')} />
        </View>

        {/* Location */}
        <Text style={s.sectionLabel}>LOCATION</Text>
        <View style={s.locationCard}>
          <Text style={{ fontSize: 20 }}>📍</Text>
          <View style={s.locationBody}>
            {locLoading ? <ActivityIndicator size="small" color={theme.colors.blue} /> : <Text style={s.locationText}>{location?.address || 'Could not detect location'}</Text>}
          </View>
          <TouchableOpacity onPress={fetchLoc} style={s.refreshBtn}>
            <Text style={{ fontSize: 18 }}>🔄</Text>
          </TouchableOpacity>
        </View>

        {/* Submit */}
        <TouchableOpacity style={[s.submitBtn, !isValid && s.submitDisabled]} onPress={handleSubmit} disabled={!isValid || submitting} activeOpacity={0.88}>
          {submitting ? <ActivityIndicator color="#fff" size="small" /> : <Text style={s.submitText}>Submit Report</Text>}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:    { flex: 1, backgroundColor: theme.colors.bg },
  content: { paddingHorizontal: 20, paddingBottom: 48, paddingTop: 6 },
  navBar:  { backgroundColor: theme.colors.navy, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 14 },
  backText:{ fontSize: 14, color: theme.colors.blue, fontWeight: '700' },
  navTitle:{ fontSize: 16, fontWeight: '800', color: '#fff' },
  sectionLabel: { fontSize: 11, fontWeight: '700', color: theme.colors.textTertiary, letterSpacing: 1, marginTop: 22, marginBottom: 10 },
  required:     { color: theme.colors.red },
  optional:     { color: theme.colors.textTertiary, fontWeight: '400', fontSize: 11 },
  photoRow:     { flexDirection: 'row', gap: 12 },
  photoBtn:     { flex: 1, height: 90, borderRadius: theme.radius.md, borderWidth: 1.5, borderColor: theme.colors.border, borderStyle: 'dashed', backgroundColor: theme.colors.card, alignItems: 'center', justifyContent: 'center', gap: 8 },
  photoBtnEmoji:{ fontSize: 28 },
  photoBtnLabel:{ fontSize: 13, fontWeight: '600', color: theme.colors.textSecondary },
  photoPreviewWrap: { borderRadius: theme.radius.md, overflow: 'hidden', position: 'relative' },
  photoPreview: { width: '100%', height: 180 },
  removeBtn:    { position: 'absolute', top: 10, right: 10, width: 28, height: 28, borderRadius: 14, backgroundColor: 'rgba(0,0,0,0.55)', alignItems: 'center', justifyContent: 'center' },
  removeBtnText:{ color: '#fff', fontSize: 13, fontWeight: '700' },
  typeGrid:  { flexDirection: 'row', flexWrap: 'wrap', gap: 9 },
  typeCard:  { width: '30.5%', paddingVertical: 14, borderRadius: theme.radius.sm, borderWidth: 1.5, alignItems: 'center', gap: 5, position: 'relative' },
  typeEmoji: { fontSize: 24 },
  typeLabel: { fontSize: 11, textAlign: 'center' },
  typeActiveDot: { position: 'absolute', top: 6, right: 6, width: 8, height: 8, borderRadius: 4 },
  sevCol:   { gap: 9 },
  sevCard:  { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: theme.radius.sm, borderWidth: 1.5 },
  sevEmoji: { fontSize: 22 },
  sevBody:  { flex: 1 },
  sevLabel: { fontSize: 14, fontWeight: '700', marginBottom: 2 },
  sevDesc:  { fontSize: 12, color: theme.colors.textTertiary },
  radio:    { width: 20, height: 20, borderRadius: 10, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  radioFill:{ width: 10, height: 10, borderRadius: 5 },
  inputWrap: { borderWidth: 1.5, borderColor: theme.colors.border, borderRadius: theme.radius.sm, paddingHorizontal: 14, paddingVertical: 12, backgroundColor: theme.colors.card },
  inputFocused: { borderColor: theme.colors.blue, backgroundColor: theme.colors.blueSoft },
  textAreaWrap: { paddingTop: 12 },
  input:        { fontSize: 15, color: theme.colors.textPrimary },
  textArea:     { minHeight: 88 },
  charCount:    { fontSize: 11, color: theme.colors.textTertiary, textAlign: 'right', marginTop: 4 },
  locationCard: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: theme.colors.card, borderWidth: 1.5, borderColor: theme.colors.border, borderRadius: theme.radius.sm, padding: 14 },
  locationBody: { flex: 1 },
  locationText: { fontSize: 13, color: theme.colors.textSecondary, lineHeight: 18 },
  refreshBtn:   { padding: 4 },
  submitBtn:    { marginTop: 28, height: 54, borderRadius: theme.radius.sm, backgroundColor: theme.colors.blue, alignItems: 'center', justifyContent: 'center', shadowColor: theme.colors.blue, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.4, shadowRadius: 14, elevation: 7 },
  submitDisabled:{ opacity: 0.4, shadowOpacity: 0 },
  submitText:   { fontSize: 16, fontWeight: '800', color: '#fff' },
});