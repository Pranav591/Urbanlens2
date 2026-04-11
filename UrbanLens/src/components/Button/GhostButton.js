import React, { useRef } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
  View,
} from 'react-native';
import { theme } from '../../utils/theme';

/**
 * GhostButton — transparent text-only button for tertiary actions.
 *
 * Props:
 *   label    — button text
 *   onPress  — tap handler
 *   color    — text color (default: blue)
 *   disabled — disables interaction
 *   icon     — optional emoji prepended before label
 *   style    — additional styles
 */
export default function GhostButton({
  label,
  onPress,
  color = theme.colors.blue,
  disabled = false,
  icon,
  style,
}) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () =>
    Animated.spring(scale, { toValue: 0.96, useNativeDriver: true, speed: 50 }).start();

  const handlePressOut = () =>
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 30 }).start();

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        activeOpacity={0.7}
        style={[styles.button, disabled && styles.disabled, style]}
      >
        <View style={styles.inner}>
          {icon ? <Text style={[styles.icon, { color }]}>{icon}</Text> : null}
          <Text style={[styles.label, { color }]}>{label}</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: {
    opacity: 0.4,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  icon: {
    fontSize: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
});