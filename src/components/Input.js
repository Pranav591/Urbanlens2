import React from "react";
import { TextInput, StyleSheet } from "react-native";
import { colors, spacing } from "../theme";

export default function Input(props) {
  return <TextInput style={styles.input} {...props} />;
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    borderRadius: 10,
    marginBottom: spacing.md
  }
});