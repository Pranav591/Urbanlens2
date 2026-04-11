import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import { theme } from '../../utils/theme';
import EmojiIcon from '../EmojiIcon/EmojiIcon';
import Pill from '../Pill/Pill';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const SHEET_HEIGHT = 320;

const SEVERITY_COLORS = {
  Low: theme.colors.green,
  Medium: theme.colors.amber,
  High: theme.colors.red,
  Critical: theme.colors.red,
};

/**
 * BottomSheetIssue — animated bottom sheet showing issue details.
 * Appears when a MapMarker is tapped.
 *
 * Props:
 *   issue     — the issue object to display (null = hidden)
 *   onClose   — called when the sheet is dismissed
 *   onUpvote  — called with issue.id when upvote button pressed
 *   onNavigate — called with issue when "Navigate" is pressed
 */
export default function BottomSheetIssue({ issue, onClose, onUpvote, onNavigate }) {
  const translateY = useRef(new Animated.Value(SHEET_HEIGHT)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (issue) {
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.spring(translateY, {
          toValue: 0,
          tension: 65,
          friction: 11,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }),
        Animated.timing(translateY, { toValue: SHEET_HEIGHT, duration: 250, useNativeDriver: true }),
      ]).start();
    }
  }, [issue]);

  if (!issue && translateY._value >= SHEET_HEIGHT - 1) return null;

  const severityColor = SEVERITY_COLORS[issue?.severity] ?? theme.colors.blue;

  return (
    <>
      {/* Dimmed backdrop */}
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View style={[styles.backdrop, { opacity }]} />
      </TouchableWithoutFeedback>

      {/* Sheet */}
      <Animated.View style={[styles.sheet, { transform: [{ translateY }] }]}>
        {/* Drag handle */}
        <View style={styles.handle} />

        {issue ? (
          <>
            <View style={styles.header}>
              <EmojiIcon emoji={issue.icon} color={issue.color} size="lg" />
              <View style={styles.headerText}>
                <Text style={styles.title} numberOfLines={2}>
                  {issue.title}
                </Text>
                <Text style={styles.address} numberOfLines={1}>
                  📍 {issue.address}
                </Text>
              </View>
              <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                <Text style={styles.closeIcon}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.pills}>
              <Pill text={issue.severity} color={severityColor} />
              {issue.status ? (
                <Pill
                  text={issue.status}
                  color={
                    issue.status === 'Resolved'
                      ? theme.colors.green
                      : theme.colors.blue
                  }
                />
              ) : null}
              {issue.type ? (
                <Pill text={issue.type} color={issue.color} />
              ) : null}
            </View>

            {issue.description ? (
              <Text style={styles.description} numberOfLines={3}>
                {issue.description}
              </Text>
            ) : null}

            <View style={styles.meta}>
              {issue.reportedAt ? (
                <Text style={styles.metaText}>🕐 {issue.reportedAt}</Text>
              ) : null}
              {issue.upvotes !== undefined ? (
                <Text style={styles.metaText}>👍 {issue.upvotes} upvotes</Text>
              ) : null}
            </View>

            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.upvoteBtn}
                onPress={() => onUpvote?.(issue.id)}
                activeOpacity={0.75}
              >
                <Text style={styles.upvoteBtnText}>👍 Upvote</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.navigateBtn}
                onPress={() => onNavigate?.(issue)}
                activeOpacity={0.75}
              >
                <Text style={styles.navigateBtnText}>🗺️ Navigate</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : null}
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: SHEET_HEIGHT,
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    borderTopWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadow,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.colors.border,
    alignSelf: 'center',
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 12,
  },
  headerText: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  address: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  closeBtn: {
    padding: 4,
  },
  closeIcon: {
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  pills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 10,
  },
  description: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    lineHeight: 19,
    marginBottom: 10,
  },
  meta: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  metaText: {
    fontSize: 12,
    color: theme.colors.textMuted,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
  },
  upvoteBtn: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: theme.colors.elevated,
    borderRadius: theme.radius.button,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
  },
  upvoteBtnText: {
    color: theme.colors.textPrimary,
    fontWeight: '600',
    fontSize: 14,
  },
  navigateBtn: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: theme.colors.blue,
    borderRadius: theme.radius.button,
    alignItems: 'center',
  },
  navigateBtnText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
});