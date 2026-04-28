import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { colors, spacing } from "../theme";

export default function CategoryChip({ label, selected, onPress }) {
  return (
    <TouchableOpacity
      style={[
        styles.chip,
        { backgroundColor: selected ? colors.primary : colors.surface }
      ]}
      onPress={onPress}
    >
      <Text style={{ color: selected ? "#fff" : colors.textPrimary }}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 20,
    marginRight: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border
  }
});