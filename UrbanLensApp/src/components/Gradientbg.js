import React from 'react';
import { View, StyleSheet } from 'react-native';
import { theme } from '../utils/theme';

let LinearGradient = null;
try {
  LinearGradient = require('react-native-linear-gradient').default;
} catch (e) {
  // Fallback to solid
}

export function GradientBg({ children, style, variant = 'default' }) {
  const gradients = {
    default: [theme.colors.gradA, theme.colors.gradB, theme.colors.gradC],
    violet:  [theme.colors.gradA, theme.colors.gradD, theme.colors.gradC],
    teal:    [theme.colors.gradA, '#0A2040', '#063545'],
  };
  const colors = gradients[variant] || gradients.default;

  // Decorative ambient orbs for the liquid light feel
  const Orbs = () => (
    <>
      <View style={[orb.base, orb.blue,   { backgroundColor: theme.colors.blue   + '20' }]} />
      <View style={[orb.base, orb.violet, { backgroundColor: theme.colors.violet + '18' }]} />
      <View style={[orb.base, orb.teal,   { backgroundColor: theme.colors.teal   + '14' }]} />
    </>
  );

  if (LinearGradient) {
    return (
      <LinearGradient colors={colors} start={{ x: 0.1, y: 0 }} end={{ x: 0.9, y: 1 }} style={[s.fill, style]}>
        <Orbs />
        {children}
      </LinearGradient>
    );
  }

  // Fallback
  return (
    <View style={[s.fill, { backgroundColor: theme.colors.gradB }, style]}>
      <Orbs />
      {children}
    </View>
  );
}

const s = StyleSheet.create({ fill: { flex: 1 } });

const orb = StyleSheet.create({
  base:   { position: 'absolute', borderRadius: 999 },
  blue:   { width: 280, height: 280, top: -80,  right: -60 },
  violet: { width: 200, height: 200, top: 200,  left: -80 },
  teal:   { width: 180, height: 180, bottom: 80, right: -40 },
});

