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
                if (granted !== PermissionsAndroid.RESULTS.GRANTED) return;
            }

            Geolocation.getCurrentPosition(
                (pos) => {
                    const { latitude, longitude } = pos.coords;
                    setLocation({ lat: latitude, lng: longitude });
                },
                () => {},
                { enableHighAccuracy: true, timeout: 10000 }
            );
        } catch {}
    };

    const loadIssues = async () => {
        try {
            const data = await getIssues();
            console.log("FINAL MAP DATA:", data);
            setIssues(data);
        } catch (err) {
            console.error(err);
        }
    };

    const filteredIssues =
        filter === "all"
            ? issues
            : issues.filter(i => i.category === filter);

    const normalizedIssues = filteredIssues.map(i => {
        if (!i.location) return null;

        return {
            ...i,
            lat: i.location.lat || i.location.latitude,
            lng: i.location.lng || i.location.longitude,
        };
    }).filter(Boolean);

    const buildHtml = (loc, issueList) => `
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

        // user marker
        L.marker([${loc.lat}, ${loc.lng}]).addTo(map)
            .bindPopup("You are here");

        var issues = ${JSON.stringify(issueList)};

        issues.forEach(function(issue) {
            if (!issue.lat || !issue.lng) return;

            var color = "blue";

            if (issue.category === "pothole") color = "red";
            else if (issue.category === "garbage") color = "green";
            else if (issue.category === "traffic") color = "orange";
            else if (issue.category === "construction") color = "brown";

            L.circleMarker([issue.lat, issue.lng], {
                color: color,
                fillColor: color,
                fillOpacity: 0.9,
                radius: 9
            })
            .addTo(map)
            .bindPopup(issue.category);
        });
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
                key={JSON.stringify(normalizedIssues) + JSON.stringify(location)}
                source={{ html: buildHtml(location, normalizedIssues) }}
                style={styles.map}
            />
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
});