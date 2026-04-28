import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { colors, spacing, typography } from "../theme";

export default function Button({ title, onPress }) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: 12,
    alignItems: "center"
  },
  text: {
    color: "#fff",
    ...typography.subtitle
  }
});