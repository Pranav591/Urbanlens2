import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  SafeAreaView, KeyboardAvoidingView, Platform,
  ActivityIndicator, StatusBar,
} from 'react-native';
import { theme } from '../utils/theme';
import { authService } from '../services/authService';

export default function LoginScreen({ navigation, onLogin }) {
  const [email, setEmail]     = useState('');
  const [password, setPass]   = useState('');
  const [showPass, setShow]   = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [focused, setFocused] = useState('');

  const handleLogin = async () => {
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    setError(''); setLoading(true);
    try { const user = await authService.login(email, password); onLogin(user); }
    catch (e) { setError(e.message || 'Login failed. Please try again.'); }
    finally { setLoading(false); }
  };

  const handleGuest = async () => {
    setLoading(true);
    try { const user = await authService.guestLogin(); onLogin(user); }
    catch { setError('Guest login failed.'); }
    finally { setLoading(false); }
  };

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.navy} />

      {/* Navy top */}
      <View style={s.top}>
        <View style={s.topBg1} /><View style={s.topBg2} />
        <View style={s.logoBox}>
          <Text style={s.logoEmoji}>🏙️</Text>
        </View>
        <Text style={s.brandName}>UrbanLens</Text>
        <Text style={s.tagline}>Track · Report · Resolve</Text>
      </View>

      {/* White form card */}
      <KeyboardAvoidingView style={s.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={s.card}>
          <Text style={s.cardTitle}>Welcome back</Text>
          <Text style={s.cardSub}>Sign in to your account</Text>

          {error ? (
            <View style={s.errorBox}>
              <Text style={s.errorIcon}>⚠️</Text>
              <Text style={s.errorText}>{error}</Text>
            </View>
          ) : null}

          <View style={s.fields}>
            <View style={s.field}>
              <Text style={s.label}>Email address</Text>
              <View style={[s.inputRow, focused === 'email' && s.inputActive]}>
                <Text style={s.inputIcon}>✉️</Text>
                <TextInput
                  style={s.input} value={email} onChangeText={setEmail}
                  placeholder="you@example.com" placeholderTextColor={theme.colors.textTertiary}
                  keyboardType="email-address" autoCapitalize="none"
                  onFocus={() => setFocused('email')} onBlur={() => setFocused('')}
                />
              </View>
            </View>

            <View style={s.field}>
              <Text style={s.label}>Password</Text>
              <View style={[s.inputRow, focused === 'pass' && s.inputActive]}>
                <Text style={s.inputIcon}>🔒</Text>
                <TextInput
                  style={[s.input, { flex: 1 }]} value={password} onChangeText={setPass}
                  placeholder="Your password" placeholderTextColor={theme.colors.textTertiary}
                  secureTextEntry={!showPass}
                  onFocus={() => setFocused('pass')} onBlur={() => setFocused('')}
                />
                <TouchableOpacity onPress={() => setShow(p => !p)}>
                  <Text style={{ fontSize: 16 }}>{showPass ? '🙈' : '👁️'}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <TouchableOpacity style={s.primaryBtn} onPress={handleLogin} disabled={loading} activeOpacity={0.88}>
            {loading
              ? <ActivityIndicator color="#fff" size="small" />
              : <Text style={s.primaryBtnText}>Sign In</Text>}
          </TouchableOpacity>

          <View style={s.divider}>
            <View style={s.divLine} /><Text style={s.divText}>or</Text><View style={s.divLine} />
          </View>

          <TouchableOpacity style={s.ghostBtn} onPress={handleGuest} disabled={loading} activeOpacity={0.75}>
            <Text style={s.ghostText}>👤  Continue as Guest</Text>
          </TouchableOpacity>

          <View style={s.footer}>
            <Text style={s.footerText}>Don't have an account?  </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
              <Text style={s.footerLink}>Sign up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.colors.navy },
  flex: { flex: 1 },

  top: {
    backgroundColor: theme.colors.navy,
    alignItems: 'center', paddingTop: 28, paddingBottom: 44,
    position: 'relative', overflow: 'hidden',
  },
  topBg1: { position: 'absolute', width: 240, height: 240, borderRadius: 120, backgroundColor: theme.colors.navyLight, top: -100, right: -80 },
  topBg2: { position: 'absolute', width: 100, height: 100, borderRadius: 50,  backgroundColor: theme.colors.blue, opacity: 0.10, bottom: 10, left: 20 },

  logoBox: {
    width: 72, height: 72, borderRadius: 22,
    backgroundColor: theme.colors.blue,
    alignItems: 'center', justifyContent: 'center', marginBottom: 14,
    shadowColor: theme.colors.blue, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.5, shadowRadius: 14, elevation: 8,
  },
  logoEmoji: { fontSize: 34 },
  brandName: { fontSize: 28, fontWeight: '900', color: '#fff', letterSpacing: 0.5, marginBottom: 5 },
  tagline:   { fontSize: 12, color: 'rgba(255,255,255,0.45)', letterSpacing: 2, fontWeight: '600' },

  card: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 28, borderTopRightRadius: 28,
    flex: 1, padding: 28, paddingTop: 30,
  },
  cardTitle: { fontSize: 22, fontWeight: '800', color: theme.colors.textPrimary, marginBottom: 4 },
  cardSub:   { fontSize: 14, color: theme.colors.textSecondary, marginBottom: 24 },

  errorBox: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: theme.colors.redSoft, borderRadius: theme.radius.sm,
    borderLeftWidth: 3, borderLeftColor: theme.colors.red,
    padding: 12, marginBottom: 16,
  },
  errorIcon: { fontSize: 14 },
  errorText: { fontSize: 13, color: theme.colors.red, flex: 1 },

  fields:  { gap: 16, marginBottom: 22 },
  field:   { gap: 7 },
  label:   { fontSize: 12, fontWeight: '700', color: theme.colors.textSecondary, letterSpacing: 0.4 },
  inputRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    height: 50, borderRadius: theme.radius.sm,
    borderWidth: 1.5, borderColor: theme.colors.border,
    paddingHorizontal: 14, backgroundColor: theme.colors.bg,
  },
  inputActive: { borderColor: theme.colors.blue, backgroundColor: theme.colors.blueSoft },
  inputIcon:   { fontSize: 16 },
  input:       { flex: 1, fontSize: 15, color: theme.colors.textPrimary },

  primaryBtn: {
    height: 52, borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.blue,
    alignItems: 'center', justifyContent: 'center', marginBottom: 20,
    shadowColor: theme.colors.blue, shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.4, shadowRadius: 12, elevation: 6,
  },
  primaryBtnText: { fontSize: 16, fontWeight: '800', color: '#fff', letterSpacing: 0.3 },

  divider: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16 },
  divLine: { flex: 1, height: 1, backgroundColor: theme.colors.border },
  divText: { fontSize: 12, color: theme.colors.textTertiary },

  ghostBtn: {
    height: 50, borderRadius: theme.radius.sm,
    borderWidth: 1.5, borderColor: theme.colors.border,
    alignItems: 'center', justifyContent: 'center', marginBottom: 26,
  },
  ghostText: { fontSize: 15, fontWeight: '600', color: theme.colors.textSecondary },

  footer:     { flexDirection: 'row', justifyContent: 'center' },
  footerText: { fontSize: 14, color: theme.colors.textSecondary },
  footerLink: { fontSize: 14, fontWeight: '800', color: theme.colors.blue },
});