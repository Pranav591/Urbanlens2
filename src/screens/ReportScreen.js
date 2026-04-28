import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

import Button from "../components/Button";
import Input from "../components/Input";
import Card from "../components/Card";
import { colors, spacing, typography } from "../theme";

const categories = [
  { id: "pothole", label: "Pothole", icon: "report-problem" },
  { id: "traffic", label: "Traffic", icon: "traffic" },
  { id: "accident", label: "Accident", icon: "warning" },
  { id: "construction", label: "Construction", icon: "construction" },
];

export default function ReportScreen() {
  const [description, setDescription] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [image, setImage] = useState(null);

  const handleImagePick = () => {};

  const handleSubmit = () => {
    if (!description || !selectedCategory) return;
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.header}>Report Issue</Text>

        {/* SECTION 1: Image Upload */}
        <Card style={styles.cardShadow}>
          <TouchableOpacity
            style={styles.imageBox}
            onPress={handleImagePick}
            activeOpacity={0.8}
          >
            {image ? (
              <Image source={{ uri: image }} style={styles.image} />
            ) : (
              <View style={styles.uploadPlaceholder}>
                <View style={styles.iconCircle}>
                  <Icon name="camera-alt" size={32} color={colors.primary} />
                </View>
                <Text style={styles.uploadText}>Upload Photo</Text>
                <Text style={styles.uploadSubtext}>JPEG or PNG (Max 5MB)</Text>
              </View>
            )}
          </TouchableOpacity>
        </Card>

        {/* SECTION 2: Category Selection */}
        <Card style={styles.cardShadow}>
          <Text style={styles.sectionTitle}>Select Category</Text>
          <View style={styles.grid}>
            {categories.map((item) => {
              const isSelected = selectedCategory === item.id;
              return (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => setSelectedCategory(item.id)}
                  activeOpacity={0.7}
                  style={[
                    styles.categoryItem,
                    isSelected && styles.categoryItemSelected,
                  ]}
                >
                  <Icon
                    name={item.icon}
                    size={26}
                    color={isSelected ? colors.primary : colors.textSecondary}
                  />
                  <Text
                    style={[
                      styles.categoryLabel,
                      isSelected && styles.categoryLabelSelected,
                    ]}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </Card>

        {/* SECTION 3: Description */}
        <Card style={styles.cardShadow}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Input
            placeholder="What's happening? Be specific..."
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
          />
        </Card>
      </ScrollView>

      {/* SECTION 4: Submit Button */}
      <View style={styles.footer}>
        <Button title="Submit Report" onPress={handleSubmit} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  header: {
    ...typography.title,
    fontSize: 28,
    fontWeight: "800",
    marginBottom: spacing.lg,
    color: colors.text,
    letterSpacing: -0.5,
  },
  sectionTitle: {
    ...typography.subtitle,
    fontWeight: "700",
    marginBottom: spacing.md,
    color: colors.text,
    fontSize: 16,
    letterSpacing: 0.2,
  },
  cardShadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.04)",
  },
  imageBox: {
    height: 180,
    width: "100%",
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.02)",
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: "dashed",
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary + "15",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  uploadPlaceholder: {
    alignItems: "center",
  },
  uploadText: {
    ...typography.body,
    color: colors.text,
    fontWeight: "700",
    fontSize: 16,
  },
  uploadSubtext: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 4,
    fontSize: 12,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  categoryItem: {
    width: "48%",
    flexDirection: "column",
    alignItems: "flex-start",
    padding: spacing.md,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.border,
    marginBottom: spacing.sm,
    backgroundColor: colors.surface,
  },
  categoryItemSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + "12",
    borderWidth: 2,
  },
  categoryLabel: {
    ...typography.body,
    marginTop: spacing.xs,
    color: colors.textSecondary,
    fontWeight: "600",
  },
  categoryLabelSelected: {
    color: colors.primary,
    fontWeight: "700",
  },
  footer: {
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 10,
  },
});
