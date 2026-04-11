import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Animated,
} from 'react-native';
import { theme } from '../../utils/theme';

/**
 * TextInputField — styled text input with floating label support.
 *
 * Props:
 *   label         — field label displayed above the input
 *   placeholder   — placeholder text
 *   value         — controlled value
 *   onChangeText  — change handler
 *   icon          — optional emoji icon shown on the left
 *   error         — error message string; turns border red when set
 *   multiline     — enables multi-line mode
 *   numberOfLines — hint for multiline height
 *   style         — additional container styles
 *   inputProps    — any extra TextInput props (keyboardType, etc.)
 */
export default function TextInputField({
  label,
  placeholder,
  value,
  onChangeText,
  icon,
  error,
  multiline = false,
  numberOfLines = 1,
  style,
  inputProps = {},
}) {
  const [focused, setFocused] = useState(false);
  const borderAnim = useRef(new Animated.Value(0)).current;

  const handleFocus = () => {
    setFocused(true);
    Animated.timing(borderAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handleBlur = () => {
    setFocused(false);
    Animated.timing(borderAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
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

      <Animated.View
        style={[
          styles.inputContainer,
          multiline && styles.multiline,
          { borderColor },
        ]}
      >
        {icon ? <Text style={styles.icon}>{icon}</Text> : null}
        <TextInput
          style={[styles.input, icon && styles.inputWithIcon]}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.textMuted}
          value={value}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          multiline={multiline}
          numberOfLines={multiline ? numberOfLines : undefined}
          textAlignVertical={multiline ? 'top' : 'center'}
          {...inputProps}
        />
      </Animated.View>

      {error ? <Text style={styles.error}>{error}</Text> : null}
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
    letterSpacing: 0.2,
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
  multiline: {
    alignItems: 'flex-start',
    paddingVertical: 12,
    minHeight: 100,
  },
  icon: {
    fontSize: 18,
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: theme.colors.textPrimary,
    fontSize: 15,
    paddingVertical: 0,
    includeFontPadding: false,
  },
  inputWithIcon: {
    marginLeft: 2,
  },
  error: {
    fontSize: 12,
    color: theme.colors.red,
    marginTop: 2,
  },
});