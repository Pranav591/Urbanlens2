import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../../utils/theme';

/**
 * Avatar — initials-based avatar circle.
 *
 * Props:
 *   name   — full name string; first char is used as the initial
 *   size   — 'sm' (32), 'md' (40, default), 'lg' (64), 'xl' (80)
 *   color  — background color override (default: blue)
 *   style  — additional container styles
 */
export default function Avatar({
  name,
  size = 'md',
  color = theme.colors.blue,
  style,
}) {
  const initial = name ? name.charAt(0).toUpperCase() : '?';
  const dim =
    size === 'sm' ? 32 : size === 'lg' ? 64 : size === 'xl' ? 80 : 40;
  const fontSize =
    size === 'sm' ? 13 : size === 'lg' ? 26 : size === 'xl' ? 32 : 16;

  return (
    <View
      style={[
        styles.avatar,
        {
          width: dim,
          height: dim,
          borderRadius: dim / 2,
          backgroundColor: color,
        },
        style,
      ]}
    >
      <Text style={[styles.text, { fontSize }]}>{initial}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#FFFFFF',
    fontWeight: '700',
    includeFontPadding: false,
  },
});