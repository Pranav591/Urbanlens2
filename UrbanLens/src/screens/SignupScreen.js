import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  StatusBar,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { theme } from '../utils/theme';
import { signup } from '../services/authService';
import {
  Card,
  TextInputField,
  PasswordField,
  PrimaryButton,
  GhostButton,
} from '../components';

export default function SignupScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignup = async () => {
    if (!name.trim()) { setError('Please enter your name.'); return; }
    if (!email.trim()) { setError('Please enter your email.'); return; }
    if (!password || password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (!agreed) { setError('Please accept the terms and conditions.'); return; }

    setError('');
    setLoading(true);
    try {
      await signup(name.trim(), email.trim(), password);
      navigation.replace('Main');
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.background} />
      <KeyboardAvoidingView style={styles.flex} behavior="height">
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Back */}
          <GhostButton
            label="← Back"
            color={theme.colors.textSecondary}
            onPress={() => navigation.goBack()}
            style={styles.back}
          />

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join UrbanLens and help improve your city.</Text>
          </View>

          <Card>
            {error ? (
              <View style={styles.errorBanner}>
                <Text style={styles.errorText}>⚠️  {error}</Text>
              </View>
            ) : null}

            <View style={styles.fields}>
              <TextInputField
                label="Full Name"
                placeholder="Arjun Sharma"
                value={name}
                onChangeText={setName}
                icon="👤"
                inputProps={{ autoCapitalize: 'words' }}
              />
              <TextInputField
                label="Email"
                placeholder="you@example.com"
                value={email}
                onChangeText={setEmail}
                icon="✉️"
                inputProps={{ keyboardType: 'email-address', autoCapitalize: 'none' }}
              />
              <PasswordField
                label="Password"
                placeholder="Min. 6 characters"
                value={password}
                onChangeText={setPassword}
                showStrength
              />
            </View>

            {/* Terms */}
            <TouchableOpacity
              style={styles.termsRow}
              onPress={() => setAgreed(v => !v)}
              activeOpacity={0.7}
            >
              <View style={[styles.checkbox, agreed && styles.checkboxChecked]}>
                {agreed ? <Text style={styles.checkmark}>✓</Text> : null}
              </View>
              <Text style={styles.termsText}>
                I agree to the{' '}
                <Text style={styles.termsLink}>Terms of Service</Text>
                {' '}and{' '}
                <Text style={styles.termsLink}>Privacy Policy</Text>
              </Text>
            </TouchableOpacity>

            <PrimaryButton
              label="Create Account"
              onPress={handleSignup}
              loading={loading}
              style={styles.btn}
            />
          </Card>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <GhostButton
              label="Sign In"
              color={theme.colors.blue}
              onPress={() => navigation.navigate('Login')}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.colors.background },
  flex: { flex: 1 },
  scroll: { flexGrow: 1, padding: 24 },
  back: { alignSelf: 'flex-start', marginBottom: 8 },
  header: { marginBottom: 24 },
  title: { fontSize: 26, fontWeight: '700', color: theme.colors.textPrimary },
  subtitle: { fontSize: 14, color: theme.colors.textSecondary, marginTop: 4 },
  errorBanner: {
    backgroundColor: theme.colors.red + '22',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: theme.colors.red + '44',
  },
  errorText: { color: theme.colors.red, fontSize: 13 },
  fields: { gap: 14, marginBottom: 20 },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 20,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  checkboxChecked: {
    backgroundColor: theme.colors.blue,
    borderColor: theme.colors.blue,
  },
  checkmark: { color: '#fff', fontSize: 12, fontWeight: '700' },
  termsText: { flex: 1, fontSize: 13, color: theme.colors.textSecondary, lineHeight: 19 },
  termsLink: { color: theme.colors.blue, fontWeight: '600' },
  btn: { width: '100%' },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  footerText: { fontSize: 14, color: theme.colors.textSecondary },
});