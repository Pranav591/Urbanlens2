import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getIssues } from '../services/issueService';

export default function HomeScreen({ navigation }) {
    const [issues, setIssues] = useState([]);

    useFocusEffect(
        React.useCallback(() => {
            loadData();
        }, [])
    );

    const loadData = async () => {
        const data = await getIssues();
        setIssues(data);
    };

    // 🔥 Emoji Stats
    const stats = [
        { emoji: "📊", value: issues.length },
        { emoji: "🕳️", value: issues.filter(i => i.type === "pothole").length },
        { emoji: "🗑️", value: issues.filter(i => i.type === "garbage").length },
        { emoji: "🚗", value: issues.filter(i => i.type === "traffic").length },
        { emoji: "🚓", value: issues.filter(i => i.type === "police").length },
        { emoji: "🚧", value: issues.filter(i => i.type === "construction").length },
        { emoji: "🚨", value: issues.filter(i => i.type === "accident").length },
    ];

    return (
        <ScrollView style={styles.container}>

            {/* 🔥 HEADER */}
            <View style={styles.header}>

                <Text style={styles.title}>UrbanLens</Text>

                <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
                    <Text style={styles.profileIcon}>👤</Text>
                </TouchableOpacity>

            </View>

            {/* 📊 STATS */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.statsContainer}>
                    {stats.map((item, index) => (
                        <View key={index} style={styles.statBox}>
                            <Text style={styles.statEmoji}>{item.emoji}</Text>
                            <Text style={styles.statNumber}>{item.value}</Text>
                        </View>
                    ))}
                </View>
            </ScrollView>

            {/* ⚡ QUICK ACTIONS */}
            <View style={styles.actions}>

                <TouchableOpacity
                    onPress={() => navigation.navigate("Profile")}>
                    <Text style={{ position: 'absolute', top: 20, right: 20 }}>👤</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.actionCard}
                    onPress={() => navigation.navigate("Map")}
                >
                    <Text style={styles.icon}>🗺️</Text>
                    <Text style={styles.actionTitle}>View Map</Text>
                    <Text style={styles.actionDesc}>Explore nearby issues</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.actionCard}
                    onPress={() => navigation.navigate("Report")}
                >
                    <Text style={styles.icon}>📸</Text>
                    <Text style={styles.actionTitle}>Report Issue</Text>
                    <Text style={styles.actionDesc}>Submit a new issue</Text>
                </TouchableOpacity>

            </View>

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#adc5f7',
        padding: 20,
    },

    title: {
        fontSize: 26,
        fontWeight: 'bold',
    },

    subtitle: {
        color: '#a09e9e',
        marginBottom: 20,
    },

    statsContainer: {
        flexDirection: 'row',
        gap: 10,
    },

    statBox: {
        backgroundColor: '#8ed8fa',
        padding: 15,
        borderRadius: 12,
        alignItems: 'center',
        elevation: 4,
        marginRight: 10,
        minWidth: 70,
    },

    statEmoji: {
        fontSize: 22,
        marginBottom: 5,
    },

    statNumber: {
        fontSize: 18,
        fontWeight: 'bold',
    },

    actions: {
        marginTop: 30,
    },

    actionCard: {
        backgroundColor: '#8ed8fa',
        padding: 20,
        borderRadius: 15,
        marginBottom: 15,
        elevation: 4,
    },

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },

    profileIcon: {
        fontSize: 26,
    },

    icon: {
        fontSize: 28,
    },

    actionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 5,
    },

    actionDesc: {
        color: '#a09e9e',
        marginTop: 3,
    },
});