import React, { useRef, useState, useEffect } from 'react';
import {
    View,
    StyleSheet,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
    PermissionsAndroid,
    Platform,
} from 'react-native';
import { WebView } from 'react-native-webview';
import Geolocation from '@react-native-community/geolocation';
import { getIssues } from '../services/issueService';
import { useFocusEffect } from '@react-navigation/native';

const BANGALORE = { lat: 12.9716, lng: 77.5946 };

export default function MapScreen() {
    const webviewRef = useRef(null);

    const [issues, setIssues] = useState([]);
    const [selectedIssue, setSelectedIssue] = useState(null);
    const [filter, setFilter] = useState("all");
    const [location, setLocation] = useState(null);
    const [locationReady, setLocationReady] = useState(false);

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
                    console.log("Location permission denied, using Bangalore default");
                    setLocation(BANGALORE);
                    setLocationReady(true);
                    return;
                }
            }

            Geolocation.getCurrentPosition(
                (pos) => {
                    const { latitude, longitude } = pos.coords;
                    setLocation({ lat: latitude, lng: longitude });
                    setLocationReady(true);
                },
                (err) => {
                    console.log("Location error, using Bangalore default:", err);
                    setLocation(BANGALORE);
                    setLocationReady(true);
                },
                { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
            );
        } catch (err) {
            console.log("Location exception, using Bangalore default:", err);
            setLocation(BANGALORE);
            setLocationReady(true);
        }
    };

    const loadIssues = async () => {
        const data = await getIssues();
        setIssues(data);
    };

    const handleMessage = (event) => {
        const data = JSON.parse(event.nativeEvent.data);
        setSelectedIssue(data);
    };

    const filteredIssues =
        filter === "all"
            ? issues
            : issues.filter(i => i.type === filter);

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
        var userLocation = [${loc.lat}, ${loc.lng}];
        var map = L.map('map').setView(userLocation, 14);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        L.marker(userLocation).addTo(map)
            .bindPopup("You are here")
            .openPopup();

        var issues = ${JSON.stringify(issueList)};

        issues.forEach(function(issue) {
            if (issue.lat && issue.lng) {
                var color = "blue";
                if (issue.type === "pothole") color = "red";
                if (issue.type === "garbage") color = "green";
                if (issue.type === "traffic") color = "orange";
                if (issue.type === "police") color = "purple";
                if (issue.type === "construction") color = "brown";
                if (issue.type === "accident") color = "black";

                var marker = L.circleMarker([issue.lat, issue.lng], {
                    color: color,
                    radius: 8
                }).addTo(map);

                marker.on('click', function() {
                    window.ReactNativeWebView.postMessage(JSON.stringify(issue));
                });
            }
        });
    </script>
    </body>
    </html>
    `;

    if (!locationReady) {
        return (
            <View style={styles.loader}>
                <Text>Fetching location...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterBar}>
                {[
                    { label: "All", value: "all" },
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
                            styles.chip,
                            filter === item.value && styles.activeChip
                        ]}
                        onPress={() => setFilter(item.value)}
                    >
                        <Text style={styles.chipText}>{item.label}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <WebView
                key={filter}
                ref={webviewRef}
                source={{ html: buildHtml(location, filteredIssues) }}
                style={styles.map}
                onMessage={handleMessage}
                javaScriptEnabled={true}
                domStorageEnabled={true}
            />

            <View style={styles.legend}>
                <Text>🔴 Pothole</Text>
                <Text>🟢 Garbage</Text>
                <Text>🟠 Traffic</Text>
                <Text>🟣 Police</Text>
                <Text>🟤 Construction</Text>
                <Text>⚫ Accident</Text>
            </View>

            {selectedIssue && (
                <View style={styles.card}>
                    <Text style={styles.title}>{selectedIssue.title}</Text>

                    {selectedIssue.photo && (
                        <Image source={{ uri: selectedIssue.photo }} style={styles.image} />
                    )}

                    <Text style={styles.info}>
                        📍 {selectedIssue.lat}, {selectedIssue.lng}
                    </Text>

                    <Text style={styles.info}>
                        Type: {selectedIssue.type}
                    </Text>

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

    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },

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

    chipText: {
        color: '#000',
    },

    legend: {
        position: 'absolute',
        top: 100,
        right: 10,
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 10,
        elevation: 5,
    },

    card: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        elevation: 10,
    },

    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },

    image: {
        height: 160,
        borderRadius: 12,
        marginBottom: 10,
    },

    info: {
        marginBottom: 5,
    },

    closeBtn: {
        marginTop: 10,
        backgroundColor: '#007bff',
        padding: 12,
        borderRadius: 10,
        alignItems: 'center',
    },
});