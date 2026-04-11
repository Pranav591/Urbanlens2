import React from 'react';
import { View, StyleSheet } from 'react-native';
import { theme } from '../../utils/theme';

/**
 * Card — base surface component used across the entire app.
 *
 * Props:
 *   children   — content rendered inside the card
 *   style      — additional styles to merge (overrides defaults)
 *   elevated   — if true, uses the elevated surface color (#1F2937)
 *   noPadding  — if true, removes default inner padding
 *   accentColor — if provided, adds a subtle left border accent
 */
export default function Card({
  children,
  style,
  elevated = false,
  noPadding = false,
  accentColor,
}) {
  return (
    <View
      style={[
        styles.card,
        elevated && styles.elevated,
        noPadding && styles.noPadding,
        accentColor && {
          borderLeftWidth: 3,
          borderLeftColor: accentColor,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.card,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadow,
  },
  elevated: {
    backgroundColor: theme.colors.elevated,
  },
  noPadding: {
    padding: 0,
  },
});