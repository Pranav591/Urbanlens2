import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { theme } from '../../utils/theme';
import EmojiIcon from '../EmojiIcon/EmojiIcon';
import Pill from '../Pill/Pill';

const SEVERITY_COLORS = {
  Low: theme.colors.green,
  Medium: theme.colors.amber,
  High: theme.colors.red,
  Critical: theme.colors.red,
};

const STATUS_COLORS = {
  Open: theme.colors.blue,
  Pending: theme.colors.amber,
  Resolved: theme.colors.green,
  Closed: theme.colors.textSecondary,
};

/**
 * IssueItem — row card used in Recent Issues lists and feeds.
 *
 * Props:
 *   issue: {
 *     id, title, address, type, severity, status,
 *     reportedAt, icon, color
 *   }
 *   onPress — optional tap handler
 *   style   — additional container styles
 */
export default function IssueItem({ issue, onPress, style }) {
  const severityColor = SEVERITY_COLORS[issue.severity] ?? theme.colors.blue;
  const statusColor = STATUS_COLORS[issue.status] ?? theme.colors.blue;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      style={[styles.container, style]}
    >
      <EmojiIcon emoji={issue.icon} color={issue.color} size="md" />

      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>
          {issue.title}
        </Text>
        <Text style={styles.location} numberOfLines={1}>
          📍 {issue.address}
        </Text>
        {issue.reportedAt ? (
          <Text style={styles.time}>{issue.reportedAt}</Text>
        ) : null}
      </View>

      <View style={styles.badges}>
        <Pill text={issue.severity} color={severityColor} />
        {issue.status ? (
          <Pill text={issue.status} color={statusColor} style={styles.statusPill} />
        ) : null}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 14,
    borderRadius: 14,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  info: {
    flex: 1,
    gap: 3,
  },
  title: {
    color: theme.colors.textPrimary,
    fontWeight: '600',
    fontSize: 14,
  },
  location: {
    color: theme.colors.textSecondary,
    fontSize: 12,
  },
  time: {
    color: theme.colors.textMuted,
    fontSize: 11,
  },
  badges: {
    alignItems: 'flex-end',
    gap: 4,
  },
  statusPill: {
    marginTop: 2,
  },
});