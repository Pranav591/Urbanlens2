import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { theme } from '../../utils/theme';

/**
 * SectionHeader — two-column header with a title and optional action link.
 *
 * Props:
 *   title       — section title text
 *   actionLabel — optional label for the right-side action (e.g. "See Map →")
 *   onAction    — tap handler for the action
 *   style       — additional container styles
 */
export default function SectionHeader({
  title,
  actionLabel,
  onAction,
  style,
}) {
  return (
    <View style={[styles.row, style]}>
      <Text style={styles.title}>{title}</Text>
      {actionLabel ? (
        <TouchableOpacity onPress={onAction} activeOpacity={0.7}>
          <Text style={styles.action}>{actionLabel}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  action: {
    fontSize: 13,
    color: theme.colors.blue,
    fontWeight: '500',
  },
});