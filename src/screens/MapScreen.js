import React, { useRef, useState } from 'react';
import {
    View,
    StyleSheet,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { getIssues } from '../services/issueService';
import { useFocusEffect } from '@react-navigation/native';

export default function MapScreen() {
    const webviewRef = useRef(null);
    const [issues, setIssues] = useState([]);
    const [selectedIssue, setSelectedIssue] = useState(null);
    const [filter, setFilter] = useState("all");

    useFocusEffect(
        React.useCallback(() => {
            loadIssues();
        }, [])
    );

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
        html, body, #map { height: 100%; margin: 0; }
    </style>
    </head>
    <body>
    <div id="map"></div>

    <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
    <script>
        var map = L.map('map').setView([12.9716, 77.5946], 13);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

        var issues = ${JSON.stringify(filteredIssues)};

        issues.forEach(issue => {
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
            window.ReactNativeWebView.postMessage(
                JSON.stringify(issue)
            );
            });
        }
        });

        if (issues.length > 0) {
        var first = issues[0];
        map.setView([first.lat, first.lng], 15);
        }
    </script>
    </body>
    </html>
    `;

    return (
        <View style={styles.container}>

            {/* 🔥 FILTER CHIPS */}
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

            {/* 🗺️ MAP */}
            <WebView
                key={JSON.stringify(filteredIssues)}
                ref={webviewRef}
                source={{ html }}
                style={styles.map}
                onMessage={handleMessage}
            />

            {/* 🗺️ LEGEND */}
            <View style={styles.legend}>
                <Text>🔴 Pothole</Text>
                <Text>🟢 Garbage</Text>
                <Text>🟠 Traffic</Text>
                <Text>🟣 Police</Text>
                <Text>🟤 Construction</Text>
                <Text>⚫ Accident</Text>
            </View>

            {/* 🔥 BOTTOM CARD */}
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