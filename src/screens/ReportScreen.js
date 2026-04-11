import React, { useState } from 'react';
import {
    View,
    TextInput,
    Alert,
    Image,
    Text,
    PermissionsAndroid,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
} from 'react-native';

import { addIssue } from '../services/issueService';
import { getCurrentLocation } from '../services/locationService';
import { launchCamera } from 'react-native-image-picker';

export default function ReportScreen({ navigation }) {
    const [title, setTitle] = useState('');
    const [location, setLocation] = useState(null);
    const [photo, setPhoto] = useState(null);
    const [type, setType] = useState("pothole");

    const fetchLocation = async () => {
        try {
            const loc = await getCurrentLocation();
            setLocation(loc);
        } catch (e) {
            Alert.alert(e.message);
        }
    };

    const openCamera = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.CAMERA
            );

            if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
                Alert.alert("Camera permission denied");
                return;
            }

            launchCamera(
                {
                    mediaType: 'photo',
                    quality: 0.7,
                    includeBase64: true,
                },
                (response) => {
                    const base64 = response.assets?.[0]?.base64;
                    if (base64) {
                        setPhoto(`data:image/jpeg;base64,${base64}`);
                    }
                }
            );
        } catch {
            Alert.alert("Camera error");
        }
    };

    const handleSubmit = async () => {
        if (!title || !location) {
            Alert.alert("Fill all fields");
            return;
        }

        await addIssue({
            title,
            lat: location.lat,
            lng: location.lng,
            photo,
            type,
        });

        Alert.alert("Issue added!");
        navigation.navigate("Map");
    };

    return (
        <ScrollView style={styles.container}>

            <Text style={styles.heading}>Report Issue</Text>

            <TextInput
                placeholder="Describe the issue..."
                value={title}
                onChangeText={setTitle}
                style={styles.input}
            />

            <Text style={styles.label}>Select Type</Text>

            <View style={styles.typeContainer}>
                {[
                    { label: "🕳️", value: "pothole" },
                    { label: "🗑️", value: "garbage" },
                    { label: "🚗", value: "traffic" },
                    { label: "🚓", value: "police" },
                    { label: "🚧", value: "construction" },
                    { label: "🚨", value: "accident" },
                ].map(item => (
                    <TouchableOpacity
                        key={item.value}
                        style={[
                            styles.typeBtn,
                            type === item.value && styles.activeType
                        ]}
                        onPress={() => setType(item.value)}
                    >
                        <Text style={styles.typeText}>{item.label}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <TouchableOpacity style={styles.btn} onPress={fetchLocation}>
                <Text style={styles.btnText}>📍 Get Location</Text>
            </TouchableOpacity>

            {location && (
                <Text style={styles.info}>
                    {location.lat}, {location.lng}
                </Text>
            )}

            <TouchableOpacity style={styles.btn} onPress={openCamera}>
                <Text style={styles.btnText}>📸 Take Photo</Text>
            </TouchableOpacity>

            {photo && <Image source={{ uri: photo }} style={styles.image} />}

            <TouchableOpacity style={styles.submit} onPress={handleSubmit}>
                <Text style={styles.submitText}>Submit Issue</Text>
            </TouchableOpacity>

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#f7f7f7' },

    heading: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 15,
    },

    input: {
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 10,
        marginBottom: 15,
    },

    label: { marginBottom: 5, fontWeight: '600' },

    typeContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 15,
    },

    typeBtn: {
        backgroundColor: '#ddd',
        padding: 10,
        borderRadius: 10,
        margin: 5,
    },

    activeType: {
        backgroundColor: '#007bff',
    },

    typeText: { fontSize: 18 },

    btn: {
        backgroundColor: '#eee',
        padding: 12,
        borderRadius: 10,
        marginBottom: 10,
    },

    btnText: { textAlign: 'center' },

    submit: {
        backgroundColor: '#007bff',
        padding: 15,
        borderRadius: 12,
        marginTop: 10,
    },

    submitText: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
    },

    image: {
        height: 180,
        borderRadius: 10,
        marginVertical: 10,
    },

    info: { marginBottom: 10 },
});