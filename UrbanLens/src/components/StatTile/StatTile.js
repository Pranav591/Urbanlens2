import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../../utils/theme';
import EmojiIcon from '../EmojiIcon/EmojiIcon';

/**
 * StatTile — compact metric card for dashboards and HomeScreen.
 *
 * Props:
 *   icon   — emoji string
 *   label  — metric label (e.g. "Total Reports")
 *   value  — metric value (e.g. "128")
 *   color  — accent color for tint and value highlight
 *   style  — additional container styles
 */
export default function StatTile({ icon, label, value, color = theme.colors.blue, style }) {
  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: color + '18',
          borderColor: color + '33',
        },
        style,
      ]}
    >
      <EmojiIcon emoji={icon} color={color} size="sm" style={styles.iconOffset} />
      <Text style={[styles.value, { color }]}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: theme.radius.card,
    padding: 14,
    borderWidth: 1,
    minWidth: 0,
  },
  iconOffset: {
    marginBottom: 8,
  },
  value: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 2,
    letterSpacing: -0.5,
  },
  label: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    fontWeight: '500',
    letterSpacing: 0.2,
  },
});