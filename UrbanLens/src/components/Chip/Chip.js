import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { theme } from '../../utils/theme';

/**
 * Chip — filter/tag toggle chip used in MapScreen and elsewhere.
 *
 * Props:
 *   label    — display text (or "emoji label" string)
 *   active   — whether the chip is currently selected
 *   onPress  — tap handler
 *   color    — custom accent color when active (default: blue)
 *   style    — additional container styles
 */
export default function Chip({
  label,
  active = false,
  onPress,
  color = theme.colors.blue,
  style,
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      style={[
        styles.chip,
        active
          ? { backgroundColor: color, borderColor: color }
          : styles.inactive,
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          active ? styles.activeText : styles.inactiveText,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: theme.radius.pill,
    borderWidth: 1,
  },
  inactive: {
    backgroundColor: theme.colors.elevated,
    borderColor: theme.colors.border,
  },
  text: {
    fontSize: 13,
    fontWeight: '500',
  },
  activeText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  inactiveText: {
    color: theme.colors.textSecondary,
  },
});