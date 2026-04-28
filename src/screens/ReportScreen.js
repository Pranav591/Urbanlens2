import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  StatusBar,
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
      <StatusBar barStyle="light-content" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.header}>Report Issue</Text>

        {/* SECTION 1: Image Upload */}
        <Card style={styles.cardShadow}>
          <Text style={styles.sectionTitle}>Evidence</Text>
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
                  <Icon name="add-a-photo" size={32} color={colors.primary} />
                </View>
                <Text style={styles.uploadText}>Capture or Upload</Text>
                <Text style={styles.uploadSubtext}>Help us locate the issue faster</Text>
              </View>
            )}
          </TouchableOpacity>
        </Card>

        {/* SECTION 2: Category Selection */}
        <Card style={styles.cardShadow}>
          <Text style={styles.sectionTitle}>Category</Text>
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
                  <View style={[styles.categoryIconCircle, isSelected && styles.categoryIconCircleSelected]}>
                    <Icon
                      name={item.icon}
                      size={24}
                      color={isSelected ? colors.text : colors.textSecondary}
                    />
                  </View>
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
            placeholder="Describe the situation..."
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            style={styles.textArea}
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
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
  header: {
    fontSize: 32,
    fontWeight: "800",
    marginBottom: spacing.xl,
    color: colors.text,
    letterSpacing: -1,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: spacing.md,
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  cardShadow: {
    marginBottom: spacing.lg,
    padding: spacing.lg,
  },
  imageBox: {
    height: 200,
    width: "100%",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
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
    backgroundColor: colors.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  uploadPlaceholder: {
    alignItems: "center",
  },
  uploadText: {
    color: colors.text,
    fontWeight: "700",
    fontSize: 16,
  },
  uploadSubtext: {
    color: colors.textSecondary,
    marginTop: 4,
    fontSize: 13,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  categoryItem: {
    width: "48%",
    alignItems: "center",
    padding: spacing.md,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: colors.border,
    marginBottom: spacing.sm,
    backgroundColor: colors.background,
  },
  categoryItemSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  categoryIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryIconCircleSelected: {
    backgroundColor: colors.primary,
  },
  categoryLabel: {
    color: colors.textSecondary,
    fontWeight: "600",
    fontSize: 14,
  },
  categoryLabelSelected: {
    color: colors.text,
    fontWeight: "700",
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
    paddingTop: spacing.md,
  },
  footer: {
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});
