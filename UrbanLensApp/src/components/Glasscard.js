import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { theme } from '../utils/theme';

let BlurView = null;
try {
  BlurView = require('@react-native-community/blur').BlurView;
} catch (e) {
  // Library not installed — use CSS fallback
}

export function GlassCard({
  children,
  style,
  intensity = 18,
  tint = 'dark',
  borderOpacity = 1,
  innerGlow = false,
  glowColor = theme.colors.blue,
}) {
  const containerStyle = [styles.base, style];

  if (BlurView) {
    return (
      <View style={[containerStyle, styles.blurOuter, borderOpacity && { borderColor: theme.colors.glassBorder }]}>
        <BlurView
          style={StyleSheet.absoluteFill}
          blurType={tint}
          blurAmount={intensity}
          reducedTransparencyFallbackColor="rgba(10,20,60,0.75)"
        />
        {/* Top edge highlight — the "liquid glass" shimmer line */}
        <View style={styles.edgeHighlight} />
        {/* Optional inner glow */}
        {innerGlow && (
          <View style={[styles.innerGlow, { backgroundColor: glowColor + '12' }]} />
        )}
        <View style={styles.content}>{children}</View>
      </View>
    );
  }

  // CSS Fallback — layered semi-transparent backgrounds mimic glass
  return (
    <View style={[containerStyle, styles.fallbackGlass]}>
      {/* Simulated blur: dark base + white overlay */}
      <View style={[StyleSheet.absoluteFill, styles.fallbackBase]} />
      <View style={[StyleSheet.absoluteFill, styles.fallbackOverlay]} />
      <View style={styles.edgeHighlight} />
      {innerGlow && (
        <View style={[styles.innerGlow, { backgroundColor: glowColor + '18' }]} />
      )}
      <View style={styles.content}>{children}</View>
    </View>
  );
}

// Lighter glass pill (for badges, chips)
export function GlassPill({ children, style, color }) {
  return (
    <View style={[styles.pill, { borderColor: (color || theme.colors.glassBorder), backgroundColor: color ? color + '25' : theme.colors.glassWhite }, style]}>
      {children}
    </View>
  );
}

// Glowing button with glass tint
export function GlassButton({ children, style, color = theme.colors.blue, onPress }) {
  const { TouchableOpacity } = require('react-native');
  return (
    <TouchableOpacity
      style={[styles.glassBtn, { borderColor: color + '60', backgroundColor: color + '30', shadowColor: color }, style]}
      onPress={onPress}
      activeOpacity={0.8}>
      {children}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base:     { borderRadius: theme.radius.lg, overflow: 'hidden', borderWidth: 1 },
  blurOuter:{ borderColor: theme.colors.glassBorder },

  fallbackGlass: {
    borderColor: theme.colors.glassBorder,
    position: 'relative',
  },
  fallbackBase:    { backgroundColor: 'rgba(8,16,50,0.72)', borderRadius: theme.radius.lg },
  fallbackOverlay: { backgroundColor: 'rgba(255,255,255,0.07)', borderRadius: theme.radius.lg },

  edgeHighlight: {
    position: 'absolute', top: 0, left: 0, right: 0, height: 1,
    backgroundColor: 'rgba(255,255,255,0.30)',
    borderTopLeftRadius: theme.radius.lg,
    borderTopRightRadius: theme.radius.lg,
  },
  innerGlow: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    borderRadius: theme.radius.lg,
  },
  content: { flex: 1 },

  pill: {
    borderRadius: theme.radius.full, borderWidth: 1,
    paddingHorizontal: 12, paddingVertical: 5,
  },
  glassBtn: {
    borderRadius: theme.radius.md, borderWidth: 1.5,
    paddingHorizontal: 20, paddingVertical: 12,
    alignItems: 'center', justifyContent: 'center',
    shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.5, shadowRadius: 12, elevation: 6,
  },
});