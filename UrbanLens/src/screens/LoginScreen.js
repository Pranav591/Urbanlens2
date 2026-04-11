import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { theme } from '../utils/theme';
import { login, guestLogin } from '../services/authService';
import {
  Card,
  TextInputField,
  PasswordField,
  PrimaryButton,
  SecondaryButton,
  GhostButton,
} from '../components';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [guestLoading, setGuestLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      setError('Please enter your email and password.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await login(email.trim(), password);
      navigation.replace('Main');
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGuest = async () => {
    setGuestLoading(true);
    try {
      await guestLogin();
      navigation.replace('Main');
    } finally {
      setGuestLoading(false);
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
          {/* Logo */}
          <View style={styles.logoSection}>
            <View style={styles.logoBox}>
              <Text style={styles.logoEmoji}>🏙️</Text>
            </View>
            <Text style={styles.appName}>UrbanLens</Text>
            <Text style={styles.tagline}>AI-Powered Civic Issue Detection</Text>
          </View>

          {/* Form card */}
          <Card style={styles.card}>
            <Text style={styles.cardTitle}>Sign In</Text>
            <Text style={styles.cardSubtitle}>Welcome back. Report and track civic issues.</Text>

            {error ? (
              <View style={styles.errorBanner}>
                <Text style={styles.errorText}>⚠️  {error}</Text>
              </View>
            ) : null}

            <View style={styles.fields}>
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
                placeholder="••••••••"
                value={password}
                onChangeText={setPassword}
              />
            </View>

            <GhostButton
              label="Forgot Password?"
              color={theme.colors.blue}
              style={styles.forgotBtn}
            />

            <View style={styles.actions}>
              <PrimaryButton
                label="Sign In"
                onPress={handleLogin}
                loading={loading}
                style={styles.fullWidth}
              />
              <SecondaryButton
                label="Continue as Guest"
                onPress={handleGuest}
                icon="👤"
                style={styles.fullWidth}
              />
            </View>
          </Card>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <GhostButton
              label="Sign Up"
              color={theme.colors.blue}
              onPress={() => navigation.navigate('Signup')}
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
  scroll: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoBox: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: theme.colors.blue,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    ...theme.shadow,
  },
  logoEmoji: { fontSize: 36 },
  appName: {
    fontSize: 28,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },
  card: { gap: 0 },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginBottom: 20,
  },
  errorBanner: {
    backgroundColor: theme.colors.red + '22',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: theme.colors.red + '44',
  },
  errorText: { color: theme.colors.red, fontSize: 13 },
  fields: { gap: 14, marginBottom: 8 },
  forgotBtn: { alignSelf: 'flex-end', paddingVertical: 6 },
  actions: { gap: 10, marginTop: 16 },
  fullWidth: { width: '100%' },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  footerText: { fontSize: 14, color: theme.colors.textSecondary },
});