import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../../utils/theme';

/**
 * EmojiIcon — standardised emoji container used across the app.
 *
 * Props:
 *   emoji  — the emoji string to display
 *   color  — accent color; used for the tinted background (color + '22')
 *   size   — 'sm' (28), 'md' (36, default), 'lg' (48)
 *   style  — additional styles for the container
 */
export default function EmojiIcon({ emoji, color, size = 'md', style }) {
  const dim = size === 'sm' ? 28 : size === 'lg' ? 48 : 36;
  const fontSize = size === 'sm' ? 14 : size === 'lg' ? 24 : 18;
  const radius = size === 'sm' ? 8 : size === 'lg' ? 14 : theme.radius.icon;

  return (
    <View
      style={[
        styles.container,
        {
          width: dim,
          height: dim,
          borderRadius: radius,
          backgroundColor: color ? color + '22' : theme.colors.elevated,
        },
        style,
      ]}
    >
      <Text style={[styles.emoji, { fontSize }]}>{emoji}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    lineHeight: undefined,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
});