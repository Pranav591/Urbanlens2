import React from "react";
import { View, StyleSheet } from "react-native";
import { colors, spacing } from "../theme";

export default function Card({ children }) {
  return <View style={styles.card}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: 16,
    marginBottom: spacing.md,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2
  }
});