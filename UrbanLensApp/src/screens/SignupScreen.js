import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  SafeAreaView, KeyboardAvoidingView, Platform,
  ActivityIndicator, StatusBar, ScrollView,
} from 'react-native';
import { theme } from '../utils/theme';
import { authService } from '../services/authService';

export default function SignupScreen({ navigation, onLogin }) {
  const [name, setName]       = useState('');
  const [email, setEmail]     = useState('');
  const [password, setPass]   = useState('');
  const [showPass, setShow]   = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [focused, setFocused] = useState('');

  const handleSignup = async () => {
    if (!name || !email || !password) { setError('Please fill in all fields.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setError(''); setLoading(true);
    try { const user = await authService.signup(name, email, password); onLogin(user); }
    catch (e) { setError(e.message || 'Signup failed.'); }
    finally { setLoading(false); }
  };

  const strength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3;
  const strengthColor = ['transparent', theme.colors.red, theme.colors.orange, theme.colors.green][strength];
  const strengthLabel = ['', 'Weak', 'Fair', 'Strong'][strength];

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.navy} />
      <View style={s.navBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={s.backText}>← Back</Text>
        </TouchableOpacity>
        <View style={s.logoSmall}><Text style={{ fontSize: 16 }}>🏙️</Text></View>
      </View>
      <KeyboardAvoidingView style={s.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={s.card}>
          <Text style={s.cardTitle}>Create account</Text>
          <Text style={s.cardSub}>Join UrbanLens and help fix your city</Text>
          {error ? (
            <View style={s.errorBox}>
              <Text style={s.errorIcon}>⚠️</Text>
              <Text style={s.errorText}>{error}</Text>
            </View>
          ) : null}
          <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            <View style={s.fields}>
              {[
                { key: 'name',  label: 'Full Name',  icon: '👤', ph: 'Your name',        val: name,  set: setName,  kb: 'default',       cap: 'words' },
                { key: 'email', label: 'Email',       icon: '✉️',  ph: 'you@example.com', val: email, set: setEmail, kb: 'email-address', cap: 'none' },
              ].map(f => (
                <View key={f.key} style={s.field}>
                  <Text style={s.label}>{f.label}</Text>
                  <View style={[s.inputRow, focused === f.key && s.inputActive]}>
                    <Text style={s.inputIcon}>{f.icon}</Text>
                    <TextInput style={s.input} value={f.val} onChangeText={f.set} placeholder={f.ph} placeholderTextColor={theme.colors.textTertiary} keyboardType={f.kb} autoCapitalize={f.cap} onFocus={() => setFocused(f.key)} onBlur={() => setFocused('')} />
                  </View>
                </View>
              ))}
              <View style={s.field}>
                <Text style={s.label}>Password</Text>
                <View style={[s.inputRow, focused === 'pass' && s.inputActive]}>
                  <Text style={s.inputIcon}>🔒</Text>
                  <TextInput style={[s.input, { flex: 1 }]} value={password} onChangeText={setPass} placeholder="Min. 6 characters" placeholderTextColor={theme.colors.textTertiary} secureTextEntry={!showPass} onFocus={() => setFocused('pass')} onBlur={() => setFocused('')} />
                  <TouchableOpacity onPress={() => setShow(p => !p)}><Text style={{ fontSize: 16 }}>{showPass ? '🙈' : '👁️'}</Text></TouchableOpacity>
                </View>
                {password.length > 0 && (
                  <View style={s.strengthRow}>
                    <View style={s.strengthBars}>{[1,2,3].map(i => <View key={i} style={[s.strengthBar, { backgroundColor: i <= strength ? strengthColor : theme.colors.border }]} />)}</View>
                    <Text style={[s.strengthLabel, { color: strengthColor }]}>{strengthLabel}</Text>
                  </View>
                )}
              </View>
            </View>
            <TouchableOpacity style={s.primaryBtn} onPress={handleSignup} disabled={loading} activeOpacity={0.88}>
              {loading ? <ActivityIndicator color="#fff" size="small" /> : <Text style={s.primaryBtnText}>Create Account</Text>}
            </TouchableOpacity>
            <Text style={s.terms}>By signing up you agree to our <Text style={s.termsLink}>Terms</Text> and <Text style={s.termsLink}>Privacy Policy</Text></Text>
            <View style={s.footer}>
              <Text style={s.footerText}>Already have an account?  </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}><Text style={s.footerLink}>Sign in</Text></TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: theme.colors.navy },
  flex:   { flex: 1 },
  navBar: { backgroundColor: theme.colors.navy, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12 },
  backText:  { fontSize: 14, color: theme.colors.blue, fontWeight: '700' },
  logoSmall: { width: 34, height: 34, borderRadius: 10, backgroundColor: theme.colors.blue, alignItems: 'center', justifyContent: 'center' },
  card:      { backgroundColor: '#fff', borderTopLeftRadius: 28, borderTopRightRadius: 28, flex: 1, padding: 28, paddingTop: 30 },
  cardTitle: { fontSize: 22, fontWeight: '800', color: theme.colors.textPrimary, marginBottom: 4 },
  cardSub:   { fontSize: 14, color: theme.colors.textSecondary, marginBottom: 22 },
  errorBox:  { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: theme.colors.redSoft, borderRadius: theme.radius.sm, borderLeftWidth: 3, borderLeftColor: theme.colors.red, padding: 12, marginBottom: 16 },
  errorIcon: { fontSize: 14 },
  errorText: { fontSize: 13, color: theme.colors.red, flex: 1 },
  fields:    { gap: 14, marginBottom: 20 },
  field:     { gap: 6 },
  label:     { fontSize: 12, fontWeight: '700', color: theme.colors.textSecondary, letterSpacing: 0.4 },
  inputRow:  { flexDirection: 'row', alignItems: 'center', gap: 10, height: 50, borderRadius: theme.radius.sm, borderWidth: 1.5, borderColor: theme.colors.border, paddingHorizontal: 14, backgroundColor: theme.colors.bg },
  inputActive: { borderColor: theme.colors.blue, backgroundColor: theme.colors.blueSoft },
  inputIcon: { fontSize: 16 },
  input:     { flex: 1, fontSize: 15, color: theme.colors.textPrimary },
  strengthRow:  { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 6 },
  strengthBars: { flexDirection: 'row', flex: 1, gap: 4 },
  strengthBar:  { flex: 1, height: 3, borderRadius: 2 },
  strengthLabel:{ fontSize: 11, fontWeight: '700' },
  primaryBtn:    { height: 52, borderRadius: theme.radius.sm, backgroundColor: theme.colors.blue, alignItems: 'center', justifyContent: 'center', marginBottom: 14, shadowColor: theme.colors.blue, shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.4, shadowRadius: 12, elevation: 6 },
  primaryBtnText:{ fontSize: 16, fontWeight: '800', color: '#fff' },
  terms:     { fontSize: 12, color: theme.colors.textTertiary, textAlign: 'center', marginBottom: 20, lineHeight: 18 },
  termsLink: { color: theme.colors.blue, fontWeight: '700' },
  footer:    { flexDirection: 'row', justifyContent: 'center' },
  footerText:{ fontSize: 14, color: theme.colors.textSecondary },
  footerLink:{ fontSize: 14, fontWeight: '800', color: theme.colors.blue },
});