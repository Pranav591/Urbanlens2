import React, { useRef, useState, useEffect } from 'react';
import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
    ScrollView,
    PermissionsAndroid,
    Platform,
} from 'react-native';
import { WebView } from 'react-native-webview';
import Geolocation from '@react-native-community/geolocation';
import { getIssues } from '../services/issueService';
import { useFocusEffect } from '@react-navigation/native';

const DEFAULT_LOCATION = { lat: 12.9716, lng: 77.5946 };

export default function MapScreen() {
    const webviewRef = useRef(null);

    const [issues, setIssues] = useState([]);
    const [selectedIssue, setSelectedIssue] = useState(null);
    const [filter, setFilter] = useState("all");
    const [location, setLocation] = useState(DEFAULT_LOCATION);

    useEffect(() => {
        requestLocation();
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            loadIssues();
        }, [])
    );

    const requestLocation = async () => {
        try {
            if (Platform.OS === 'android') {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
                );

                if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
                    console.log("Permission denied → using default");
                    return;
                }
            }

            Geolocation.getCurrentPosition(
                (pos) => {
                    const { latitude, longitude } = pos.coords;
                    console.log("GPS:", latitude, longitude);
                    setLocation({ lat: latitude, lng: longitude });
                },
                (err) => {
                    console.log("GPS failed:", err);
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 5000,
                }
            );
        } catch (err) {
            console.log("Location error:", err);
        }
    };

    const loadIssues = async () => {
        try {
            const data = await getIssues();
            console.log("FIRESTORE DATA:", data);
            setIssues(data);
        } catch (err) {
            console.error("FETCH ERROR:", err);
        }
    };

    const handleMessage = (event) => {
        const data = JSON.parse(event.nativeEvent.data);
        setSelectedIssue(data);
    };

    const filteredIssues =
        filter === "all"
            ? issues
            : issues.filter(i => i.category === filter);

    const buildHtml = (loc) => `
    <!DOCTYPE html>
    <html>
    <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
    <style>
        html, body, #map { height: 100%; margin: 0; padding: 0; }
    </style>
    </head>
    <body>
    <div id="map"></div>
    <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
    <script>
        var map = L.map('map').setView([${loc.lat}, ${loc.lng}], 14);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        L.marker([${loc.lat}, ${loc.lng}]).addTo(map)
            .bindPopup("You are here")
            .openPopup();
    </script>
    </body>
    </html>
    `;

    return (
        <View style={styles.container}>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterBar}>
                {[
                    { label: "All", value: "all" },
                    { label: "🕳️", value: "pothole" },
                    { label: "🗑️", value: "garbage" },
                    { label: "🚗", value: "traffic" },
                    { label: "🚧", value: "construction" },
                ].map(item => (
                    <TouchableOpacity
                        key={item.value}
                        style={[
                            styles.chip,
                            filter === item.value && styles.activeChip
                        ]}
                        onPress={() => setFilter(item.value)}
                    >
                        <Text>{item.label}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <WebView
                key={JSON.stringify(location)}
                source={{ html: buildHtml(location) }}
                style={styles.map}
                onMessage={handleMessage}
            />

            {selectedIssue && (
                <View style={styles.card}>
                    <Text>{selectedIssue.category}</Text>

                    <TouchableOpacity
                        style={styles.closeBtn}
                        onPress={() => setSelectedIssue(null)}
                    >
                        <Text style={{ color: '#fff' }}>Close</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    map: { flex: 1 },

    filterBar: {
        position: 'absolute',
        top: 40,
        zIndex: 10,
        paddingHorizontal: 10,
    },

    chip: {
        backgroundColor: '#eee',
        padding: 10,
        borderRadius: 20,
        marginRight: 8,
    },

    activeChip: {
        backgroundColor: '#007bff',
    },

    card: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        padding: 20,
    },

    closeBtn: {
        marginTop: 10,
        backgroundColor: '#007bff',
        padding: 10,
        alignItems: 'center',
    },
});