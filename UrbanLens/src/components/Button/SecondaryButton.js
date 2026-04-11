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
 * SecondaryButton — outlined surface button for secondary actions.
 *
 * Props:
 *   label    — button text
 *   onPress  — tap handler
 *   color    — border and text color (default: blue)
 *   disabled — disables interaction
 *   icon     — optional emoji prepended before label
 *   style    — additional container styles
 */
export default function SecondaryButton({
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
        activeOpacity={0.85}
        style={[
          styles.button,
          {
            borderColor: color + '66',
            backgroundColor: theme.colors.elevated,
          },
          disabled && styles.disabled,
          style,
        ]}
      >
        <View style={styles.inner}>
          {icon ? <Text style={styles.icon}>{icon}</Text> : null}
          <Text style={[styles.label, { color }]}>{label}</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 13,
    paddingHorizontal: 24,
    borderRadius: theme.radius.button,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  icon: {
    fontSize: 16,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
});