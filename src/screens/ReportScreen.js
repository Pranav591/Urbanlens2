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
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import Geolocation from "react-native-geolocation-service";

import Button from "../components/Button";
import Input from "../components/Input";
import Card from "../components/Card";
import { colors, spacing } from "../theme";

import { addIssue } from "../services/firestoreService";

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
    if (Platform.OS === "android") {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  const requestLocationPermission = async () => {
    if (Platform.OS === "android") {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  const handleImagePick = () => {
    Alert.alert("Select Image", "Choose source", [
      {
        text: "Camera",
        onPress: async () => {
          const ok = await requestCameraPermission();
          if (ok) {
            launchCamera({ mediaType: "photo", quality: 0.8 }, (res) => {
              if (res.assets && res.assets.length > 0) {
                setImage(res.assets[0].uri);
              }
            });
          }
        },
      },
      {
        text: "Gallery",
        onPress: () => {
          launchImageLibrary({ mediaType: "photo", quality: 0.8 }, (res) => {
            if (res.assets && res.assets.length > 0) {
              setImage(res.assets[0].uri);
            }
          });
        },
      },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const saveReport = async (lat, lng) => {
    try {
      const issue = {
        category: selectedCategory,
        description,
        image: image || null,
        location: {
          lat,
          lng,
        },
      };

      await addIssue(issue);

      setLoading(false);

      Alert.alert("Success", "Report submitted");

      setDescription("");
      setSelectedCategory(null);
      setImage(null);

      navigation.navigate("Home");
    } catch (err) {
      console.log("Firestore Error:", err);
      setLoading(false);
      Alert.alert("Error submitting report");
    }
  };

  const handleSubmit = async () => {
    if (!description || !selectedCategory) {
      Alert.alert("Error", "Fill all fields");
      return;
    }

    setLoading(true);

    const hasLocation = await requestLocationPermission();

    if (hasLocation) {
      Geolocation.getCurrentPosition(
        (pos) => {
          saveReport(pos.coords.latitude, pos.coords.longitude);
        },
        () => {
          // fallback Bangalore
          saveReport(12.9716, 77.5946);
        },
        { enableHighAccuracy: true }
      );
    } else {
      saveReport(12.9716, 77.5946);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.header}>Report Issue</Text>

        {/* IMAGE */}
        <Card>
          <TouchableOpacity style={styles.imageBox} onPress={handleImagePick}>
            {image ? (
              <Image source={{ uri: image }} style={styles.image} />
            ) : (
              <View style={styles.placeholder}>
                <Icon name="camera-alt" size={30} color={colors.primary} />
                <Text>Upload Photo</Text>
              </View>
            )}
          </TouchableOpacity>
        </Card>

        {/* CATEGORY */}
        <Card>
          <Text style={styles.section}>Category</Text>
          <View style={styles.grid}>
            {categories.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.cat,
                  selectedCategory === item.id && styles.catSelected,
                ]}
                onPress={() => setSelectedCategory(item.id)}
              >
                <Icon name={item.icon} size={20} />
                <Text>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* DESCRIPTION */}
        <Card>
          <Text style={styles.section}>Description</Text>
          <Input
            placeholder="Describe issue"
            value={description}
            onChangeText={setDescription}
          />
        </Card>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title={loading ? "Submitting..." : "Submit Report"}
          onPress={handleSubmit}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.md },
  header: { fontSize: 26, fontWeight: "bold", marginBottom: 10 },
  section: { fontWeight: "bold", marginBottom: 10 },

  imageBox: {
    height: 150,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderStyle: "dashed",
  },
  placeholder: { alignItems: "center" },
  image: { width: "100%", height: "100%" },

  grid: { flexDirection: "row", flexWrap: "wrap" },
  cat: {
    width: "48%",
    padding: 10,
    margin: "1%",
    borderWidth: 1,
    alignItems: "center",
  },
  catSelected: {
    borderColor: colors.primary,
    backgroundColor: "#eee",
  },

  footer: { padding: 10 },
});