import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    StatusBar,
    Dimensions,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getIssues } from '../services/issueService';
import { colors, spacing } from '../theme';
import Card from '../components/Card';
import Icon from 'react-native-vector-icons/MaterialIcons';

const SCREEN_HEIGHT = Dimensions.get('window').height;

export default function HomeScreen({ navigation }) {
    const [issues, setIssues] = useState([]);

    useFocusEffect(
        useCallback(() => {
            fetchIssues();
        }, [])
    );

    const fetchIssues = async () => {
        try {
            const data = await getIssues();
            setIssues(data);
        } catch (err) {
            console.error("HOME FETCH ERROR:", err);
        }
    };

    const stats = [
        { label: "Potholes", value: issues.filter(i => i.category === "pothole").length, icon: "report-problem" },
        { label: "Garbage", value: issues.filter(i => i.category === "garbage").length, icon: "delete" },
        { label: "Traffic", value: issues.filter(i => i.category === "traffic").length, icon: "traffic" },
        { label: "Construction", value: issues.filter(i => i.category === "construction").length, icon: "engineering" },
    ];

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

            {/* HEADER */}
            <View style={styles.header}>
                <Text style={styles.title}>UrbanLens</Text>
                <TouchableOpacity
                    style={styles.profileButton}
                    onPress={() => navigation.navigate("Profile")}
                >
                    <Icon name="person" size={22} color={colors.primary} />
                </TouchableOpacity>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >

                {/* OVERVIEW */}
                <Text style={styles.sectionTitle}>Overview</Text>

                <View style={styles.statsGrid}>
                    {stats.map((item, index) => (
                        <Card key={index} style={styles.statCard}>
                            <View style={styles.statIconContainer}>
                                <Icon name={item.icon} size={20} color={colors.primary} />
                            </View>
                            <Text style={styles.statNumber}>{item.value}</Text>
                            <Text style={styles.statLabel}>{item.label}</Text>
                        </Card>
                    ))}
                </View>

                {/* QUICK ACTIONS */}
                <View style={styles.actionsWrapper}>
                    <Text style={styles.sectionTitle}>Quick Actions</Text>

                    <TouchableOpacity
                        activeOpacity={0.85}
                        onPress={() => navigation.navigate("Map")}
                    >
                        <Card style={styles.actionCard}>
                            <View style={styles.actionIconContainer}>
                                <Icon name="map" size={26} color={colors.primary} />
                            </View>
                            <View style={styles.actionTextContainer}>
                                <Text style={styles.actionTitle}>Explore Map</Text>
                                <Text style={styles.actionDesc}>View reported issues in your area</Text>
                            </View>
                            <Icon name="chevron-right" size={22} color={colors.textSecondary} />
                        </Card>
                    </TouchableOpacity>

                    <TouchableOpacity
                        activeOpacity={0.85}
                        onPress={() => navigation.navigate("Report")}
                    >
                        <Card style={styles.actionCard}>
                            <View style={styles.actionIconContainer}>
                                <Icon name="add-a-photo" size={26} color={colors.primary} />
                            </View>
                            <View style={styles.actionTextContainer}>
                                <Text style={styles.actionTitle}>Report Issue</Text>
                                <Text style={styles.actionDesc}>Submit a new report with photos</Text>
                            </View>
                            <Icon name="chevron-right" size={22} color={colors.textSecondary} />
                        </Card>
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.lg,
        paddingBottom: spacing.sm,
    },

    title: {
        fontSize: 26,
        fontWeight: '800',
        color: colors.text,
    },

    profileButton: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: colors.surface,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.border,
    },

    scrollContent: {
        paddingHorizontal: spacing.lg,
        paddingBottom: spacing.lg,
        minHeight: SCREEN_HEIGHT,
    },

    sectionTitle: {
        color: colors.text,
        fontSize: 18,
        fontWeight: '700',
        marginBottom: spacing.sm,
        marginTop: spacing.sm,
    },

    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: spacing.md,
    },

    statCard: {
        width: '48%',
        alignItems: 'center',
        paddingVertical: spacing.md,
        marginBottom: spacing.sm,
    },

    statIconContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: colors.primaryLight,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.xs,
    },

    statNumber: {
        fontSize: 20,
        fontWeight: '800',
        color: colors.text,
    },

    statLabel: {
        fontSize: 11,
        fontWeight: '600',
        color: colors.textSecondary,
        textTransform: 'uppercase',
    },

    actionsWrapper: {
        flex: 1,
        justifyContent: 'flex-start',
    },

    actionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md,
        marginBottom: spacing.sm,
    },

    actionIconContainer: {
        width: 50,
        height: 50,
        borderRadius: 14,
        backgroundColor: colors.primaryLight,
        justifyContent: 'center',
        alignItems: 'center',
    },

    actionTextContainer: {
        flex: 1,
        marginLeft: spacing.md,
    },

    actionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.text,
    },

    actionDesc: {
        fontSize: 13,
        color: colors.textSecondary,
        marginTop: 2,
    },
});