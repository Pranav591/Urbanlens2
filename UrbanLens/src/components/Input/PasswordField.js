import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { theme } from '../../utils/theme';

/**
 * PasswordField — secure password input with visibility toggle.
 *
 * Props:
 *   label        — field label
 *   placeholder  — placeholder text
 *   value        — controlled value
 *   onChangeText — change handler
 *   error        — error message string
 *   style        — additional container styles
 *   showStrength — if true, renders a 3-segment strength bar
 */

function getStrength(password) {
  if (!password || password.length < 4) return 0;
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) score++;
  return score;
}

const STRENGTH_COLORS = [theme.colors.red, theme.colors.amber, theme.colors.green];
const STRENGTH_LABELS = ['Weak', 'Medium', 'Strong'];

export default function PasswordField({
  label = 'Password',
  placeholder = '••••••••',
  value,
  onChangeText,
  error,
  showStrength = false,
  style,
}) {
  const [visible, setVisible] = useState(false);
  const [focused, setFocused] = useState(false);
  const borderAnim = useRef(new Animated.Value(0)).current;

  const strength = showStrength ? getStrength(value) : 0;

  const handleFocus = () => {
    setFocused(true);
    Animated.timing(borderAnim, { toValue: 1, duration: 200, useNativeDriver: false }).start();
  };

  const handleBlur = () => {
    setFocused(false);
    Animated.timing(borderAnim, { toValue: 0, duration: 200, useNativeDriver: false }).start();
  };

  const borderColor = error
    ? theme.colors.red
    : borderAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [theme.colors.border, theme.colors.blue],
      });

  return (
    <View style={[styles.wrapper, style]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}

      <Animated.View style={[styles.inputContainer, { borderColor }]}>
        <Text style={styles.lockIcon}>🔒</Text>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.textMuted}
          value={value}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          secureTextEntry={!visible}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TouchableOpacity
          onPress={() => setVisible(v => !v)}
          style={styles.toggle}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={styles.toggleIcon}>{visible ? '🙈' : '👁️'}</Text>
        </TouchableOpacity>
      </Animated.View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {showStrength && value?.length > 0 ? (
        <View style={styles.strengthRow}>
          {[0, 1, 2].map(i => (
            <View
              key={i}
              style={[
                styles.strengthSegment,
                {
                  backgroundColor:
                    i <= strength - 1
                      ? STRENGTH_COLORS[strength - 1]
                      : theme.colors.border,
                },
              ]}
            />
          ))}
          <Text style={[styles.strengthLabel, { color: STRENGTH_COLORS[strength - 1] ?? theme.colors.border }]}>
            {strength > 0 ? STRENGTH_LABELS[strength - 1] : ''}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    color: theme.colors.textSecondary,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.elevated,
    borderRadius: theme.radius.input,
    borderWidth: 1.5,
    paddingHorizontal: 14,
    minHeight: 48,
  },
  lockIcon: {
    fontSize: 16,
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: theme.colors.textPrimary,
    fontSize: 15,
    paddingVertical: 0,
    includeFontPadding: false,
    letterSpacing: 0.5,
  },
  toggle: {
    paddingLeft: 8,
  },
  toggleIcon: {
    fontSize: 16,
  },
  error: {
    fontSize: 12,
    color: theme.colors.red,
  },
  strengthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  strengthSegment: {
    flex: 1,
    height: 3,
    borderRadius: 999,
  },
  strengthLabel: {
    fontSize: 11,
    fontWeight: '600',
    width: 44,
    textAlign: 'right',
  },
});