import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Alert,
  PermissionsAndroid,
  Platform,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Geolocation from 'react-native-geolocation-service';

import Button from "../components/Button";
import Input from "../components/Input";
import Card from "../components/Card";
import { colors, spacing } from "../theme";
import { addIssue } from "../services/issueService";

const categories = [
  { id: "pothole", label: "Pothole", icon: "report-problem" },
  { id: "garbage", label: "Garbage", icon: "delete" },
  { id: "traffic", label: "Traffic", icon: "traffic" },
  { id: "accident", label: "Accident", icon: "warning" },
  { id: "construction", label: "Construction", icon: "construction" },
];

export default function ReportScreen({ navigation }) {
  const [description, setDescription] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'UrbanLens needs access to your camera to take photos of issues.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        return false;
      }
    }
    return true;
  };

  const handleImagePick = () => {
    Alert.alert(
      "Select Image",
      "Choose a photo from gallery or take a new one",
      [
        {
          text: "Camera",
          onPress: async () => {
            const hasPermission = await requestCameraPermission();
            if (hasPermission) {
              launchCamera({ mediaType: 'photo', quality: 0.8 }, (response) => {
                if (response.assets && response.assets.length > 0) {
                  setImage(response.assets[0].uri);
                }
              });
            }
          }
        },
        {
          text: "Gallery",
          onPress: () => {
            launchImageLibrary({ mediaType: 'photo', quality: 0.8 }, (response) => {
              if (response.assets && response.assets.length > 0) {
                setImage(response.assets[0].uri);
              }
            });
          }
        },
        { text: "Cancel", style: "cancel" }
      ]
    );
  };

  const handleSubmit = async () => {
    if (!description || !selectedCategory) {
      Alert.alert("Missing Information", "Please select a category and provide a description.");
      return;
    }

    setLoading(true);

    const hasLocationPermission = await requestLocationPermission();

    if (hasLocationPermission) {
      Geolocation.getCurrentPosition(
        async (position) => {
          await saveReport(position.coords.latitude, position.coords.longitude);
        },
        async (error) => {
          // Fallback to Bangalore
          await saveReport(12.9716, 77.5946);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    } else {
      await saveReport(12.9716, 77.5946);
    }
  };

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  const saveReport = async (lat, lng) => {
    const issue = {
      title: categories.find(c => c.id === selectedCategory)?.label || "Issue",
      description,
      type: selectedCategory,
      photo: image,
      lat,
      lng,
      status: "Reported",
      timestamp: new Date().toISOString()
    };

    await addIssue(issue);
    setLoading(false);
    Alert.alert("Success", "Your report has been submitted.", [
      { text: "OK", onPress: () => navigation.navigate("Home") }
    ]);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.header}>Report Issue</Text>

        <Card style={styles.sectionCard}>
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

        <Card style={styles.sectionCard}>
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
                      color={isSelected ? "#FFFFFF" : colors.textSecondary}
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

        <Card style={styles.sectionCard}>
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

      <View style={styles.footer}>
        <Button
          title={loading ? "Submitting..." : "Submit Report"}
          onPress={handleSubmit}
          disabled={loading}
        />
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
    marginBottom: spacing.lg,
    color: colors.text,
    letterSpacing: -0.5,
  },
  sectionCard: {
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: spacing.md,
    color: colors.text,
  },
  imageBox: {
    height: 180,
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
    width: 60,
    height: 60,
    borderRadius: 30,
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
    marginTop: 2,
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
    paddingVertical: spacing.lg,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: colors.border,
    marginBottom: spacing.md,
    backgroundColor: colors.surface,
  },
  categoryItemSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  categoryIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
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
    color: colors.primary,
    fontWeight: "700",
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
    paddingTop: spacing.md,
    backgroundColor: colors.background,
    borderColor: 'transparent',
  },
  footer: {
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    elevation: 10,
  },
});
