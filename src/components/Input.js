import React from "react";
import { TextInput, StyleSheet } from "react-native";
import { colors, spacing } from "../theme";

export default function Input(props) {
  return (
    <TextInput
      style={styles.input}
      placeholderTextColor={colors.textSecondary}
      selectionColor={colors.primary}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    height: 54,
    borderRadius: 14,
    marginBottom: spacing.md,
    color: colors.text,
    fontSize: 16,
  }
});
