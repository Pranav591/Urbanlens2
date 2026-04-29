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
import { getIssues } from '../services/issueService';
import { useFocusEffect } from '@react-navigation/native';
import Geolocation from 'react-native-geolocation-service';
import { colors, spacing } from '../theme';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function MapScreen() {
    const webviewRef = useRef(null);
    const [issues, setIssues] = useState([]);
    const [selectedIssue, setSelectedIssue] = useState(null);
    const [filter, setFilter] = useState("all");
    const [userLocation, setUserLocation] = useState({ latitude: 12.9716, longitude: 77.5946 });

    useFocusEffect(
        React.useCallback(() => {
            loadIssues();
            getCurrentLocation();
        }, [])
    );

    const getCurrentLocation = async () => {
        const hasPermission = await requestLocationPermission();
        if (hasPermission) {
            Geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    });
                },
                (error) => {
                    console.log(error);
                },
                { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
            );
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

    const html = `
    <!DOCTYPE html>
    <html>
    <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
    <style>
        html, body, #map { height: 100%; margin: 0; background: #F1F5F9; }
        .leaflet-container { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
    </style>
    </head>
    <body>
    <div id="map"></div>

    <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
    <script>
        var map = L.map('map', { zoomControl: false }).setView([${userLocation.latitude}, ${userLocation.longitude}], 14);

        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; OpenStreetMap'
        }).addTo(map);

        var issues = ${JSON.stringify(filteredIssues)};

        issues.forEach(issue => {
            if (issue.lat && issue.lng) {
                var color = "#4F46E5";
                if (issue.type === "pothole") color = "#EF4444";
                if (issue.type === "garbage") color = "#10B981";
                if (issue.type === "traffic") color = "#F59E0B";
                if (issue.type === "accident") color = "#0F172A";
                if (issue.type === "construction") color = "#64748B";

                var marker = L.circleMarker([issue.lat, issue.lng], {
                    color: '#FFFFFF',
                    fillColor: color,
                    fillOpacity: 1,
                    weight: 2,
                    radius: 10
                }).addTo(map);

                marker.on('click', function() {
                    window.ReactNativeWebView.postMessage(JSON.stringify(issue));
                });
            }
        });

        // Add User Location Marker
        L.circleMarker([${userLocation.latitude}, ${userLocation.longitude}], {
            color: '#FFFFFF',
            fillColor: '#3B82F6',
            fillOpacity: 1,
            weight: 3,
            radius: 8
        }).addTo(map).bindPopup("You are here");

    </script>
    </body>
    </html>
    `;

    return (
        <View style={styles.container}>
            <WebView
                key={`${filter}-${userLocation.latitude}`}
                ref={webviewRef}
                source={{ html }}
                style={styles.map}
                onMessage={handleMessage}
            />

            <View style={styles.overlay}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterBar}>
                    {[
                        { label: "All", value: "all", icon: "apps" },
                        { label: "Pothole", value: "pothole", icon: "report-problem" },
                        { label: "Garbage", value: "garbage", icon: "delete" },
                        { label: "Traffic", value: "traffic", icon: "traffic" },
                        { label: "Accident", value: "accident", icon: "warning" },
                    ].map(item => (
                        <TouchableOpacity
                            key={item.value}
                            style={[
                                styles.chip,
                                filter === item.value && styles.activeChip
                            ]}
                            onPress={() => setFilter(item.value)}
                        >
                            <Icon name={item.icon} size={18} color={filter === item.value ? "#FFF" : colors.textSecondary} />
                            <Text style={[styles.chipText, filter === item.value && styles.activeChipText]}>{item.label}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {selectedIssue && (
                <View style={styles.cardContainer}>
                    <View style={styles.issueCard}>
                        <View style={styles.cardHeader}>
                            <View style={styles.typeBadge}>
                                <Text style={styles.typeText}>{selectedIssue.type.toUpperCase()}</Text>
                            </View>
                            <TouchableOpacity onPress={() => setSelectedIssue(null)}>
                                <Icon name="close" size={24} color={colors.textSecondary} />
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.cardTitle}>{selectedIssue.title}</Text>

                        {selectedIssue.photo && (
                            <Image source={{ uri: selectedIssue.photo }} style={styles.issueImage} />
                        )}

                        <View style={styles.locationRow}>
                            <Icon name="location-on" size={16} color={colors.primary} />
                            <Text style={styles.locationText}>{selectedIssue.lat.toFixed(4)}, {selectedIssue.lng.toFixed(4)}</Text>
                        </View>

                        <Text style={styles.description} numberOfLines={2}>
                            {selectedIssue.description || "No description provided."}
                        </Text>
                    </View>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    map: { flex: 1 },
    overlay: {
        position: 'absolute',
        top: 50,
        left: 0,
        right: 0,
    },
    filterBar: {
        paddingHorizontal: spacing.md,
    },
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 25,
        marginRight: 10,
        borderWidth: 1,
        borderColor: colors.border,
        elevation: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    activeChip: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    chipText: {
        marginLeft: 6,
        color: colors.textSecondary,
        fontWeight: '600',
    },
    activeChipText: {
        color: '#FFF',
    },
    cardContainer: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
    },
    issueCard: {
        backgroundColor: colors.surface,
        borderRadius: 20,
        padding: spacing.lg,
        elevation: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    typeBadge: {
        backgroundColor: colors.primaryLight,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    typeText: {
        color: colors.primary,
        fontSize: 10,
        fontWeight: '800',
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: colors.text,
        marginBottom: 10,
    },
    issueImage: {
        width: '100%',
        height: 150,
        borderRadius: 12,
        marginBottom: 10,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    locationText: {
        marginLeft: 4,
        color: colors.textSecondary,
        fontSize: 14,
    },
    description: {
        color: colors.textSecondary,
        fontSize: 14,
        lineHeight: 20,
    }
});
