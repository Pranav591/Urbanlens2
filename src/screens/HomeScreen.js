import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    StatusBar,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getIssues } from '../services/issueService';
import { colors, spacing } from '../theme';
import Card from '../components/Card';
import Icon from 'react-native-vector-icons/MaterialIcons';

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

    const stats = [
        { label: "Total", value: issues.length, icon: "analytics" },
        { label: "Potholes", value: issues.filter(i => i.type === "pothole").length, icon: "report-problem" },
        { label: "Garbage", value: issues.filter(i => i.type === "garbage").length, icon: "delete" },
        { label: "Traffic", value: issues.filter(i => i.type === "traffic").length, icon: "traffic" },
    ];

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={colors.background} />

            {/* HEADER */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.welcomeText}>Welcome to</Text>
                    <Text style={styles.title}>UrbanLens</Text>
                </View>
                <TouchableOpacity
                    style={styles.profileButton}
                    onPress={() => navigation.navigate("Profile")}
                >
                    <Icon name="person" size={24} color={colors.text} />
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                {/* STATS GRID */}
                <Text style={styles.sectionTitle}>Overview</Text>
                <View style={styles.statsGrid}>
                    {stats.map((item, index) => (
                        <Card key={index} style={styles.statCard}>
                            <Icon name={item.icon} size={24} color={colors.primary} />
                            <Text style={styles.statNumber}>{item.value}</Text>
                            <Text style={styles.statLabel}>{item.label}</Text>
                        </Card>
                    ))}
                </View>

                {/* QUICK ACTIONS */}
                <Text style={styles.sectionTitle}>Quick Actions</Text>

                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => navigation.navigate("Map")}
                >
                    <Card style={styles.actionCard}>
                        <View style={styles.actionIconContainer}>
                            <Icon name="map" size={28} color={colors.primary} />
                        </View>
                        <View style={styles.actionTextContainer}>
                            <Text style={styles.actionTitle}>Explore Map</Text>
                            <Text style={styles.actionDesc}>View reported issues in your area</Text>
                        </View>
                        <Icon name="chevron-right" size={24} color={colors.textSecondary} />
                    </Card>
                </TouchableOpacity>

                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => navigation.navigate("Report")}
                >
                    <Card style={styles.actionCard}>
                        <View style={styles.actionIconContainer}>
                            <Icon name="add-a-photo" size={28} color={colors.primary} />
                        </View>
                        <View style={styles.actionTextContainer}>
                            <Text style={styles.actionTitle}>Report Issue</Text>
                            <Text style={styles.actionDesc}>Submit a new report with photos</Text>
                        </View>
                        <Icon name="chevron-right" size={24} color={colors.textSecondary} />
                    </Card>
                </TouchableOpacity>

            </ScrollView>
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
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.xl,
        paddingBottom: spacing.md,
    },
    welcomeText: {
        color: colors.textSecondary,
        fontSize: 14,
        fontWeight: '500',
    },
    title: {
        color: colors.text,
        fontSize: 28,
        fontWeight: '800',
        letterSpacing: -0.5,
    },
    profileButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: colors.surface,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.border,
    },
    sectionTitle: {
        color: colors.text,
        fontSize: 18,
        fontWeight: '700',
        marginBottom: spacing.md,
        marginTop: spacing.md,
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    statCard: {
        width: '48%',
        alignItems: 'center',
        paddingVertical: spacing.lg,
        marginBottom: spacing.md,
    },
    statNumber: {
        color: colors.text,
        fontSize: 22,
        fontWeight: '800',
        marginTop: spacing.sm,
    },
    statLabel: {
        color: colors.textSecondary,
        fontSize: 12,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    actionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.lg,
        marginBottom: spacing.sm,
    },
    actionIconContainer: {
        width: 56,
        height: 56,
        borderRadius: 16,
        backgroundColor: colors.primaryLight,
        justifyContent: 'center',
        alignItems: 'center',
    },
    actionTextContainer: {
        flex: 1,
        marginLeft: spacing.md,
    },
    actionTitle: {
        color: colors.text,
        fontSize: 16,
        fontWeight: '700',
    },
    actionDesc: {
        color: colors.textSecondary,
        fontSize: 13,
        marginTop: 2,
    },
});
