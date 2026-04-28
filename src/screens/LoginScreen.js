import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Alert,
    StatusBar,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from 'react-native';

import { saveUser } from '../services/authService';
import { colors, spacing } from '../theme';
import Button from '../components/Button';
import Input from '../components/Input';
import Card from '../components/Card';

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert("Error", "Please enter email and password");
            return;
        }

        await saveUser({ email, type: "user" });
        navigation.replace("App");
    };

    const handleGuest = async () => {
        await saveUser({ type: "guest" });
        navigation.replace("App");
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
            <StatusBar barStyle="light-content" />
            <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
                <View style={styles.header}>
                    <Text style={styles.title}>UrbanLens</Text>
                    <Text style={styles.subtitle}>Modern Civic Utility</Text>
                </View>

                <Card style={styles.loginCard}>
                    <Text style={styles.cardTitle}>Login</Text>
                    <Input
                        placeholder="Email Address"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />

                    <Input
                        placeholder="Password"
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                    />

                    <Button
                        title="Sign In"
                        onPress={handleLogin}
                        style={styles.loginBtn}
                    />

                    <TouchableOpacity
                        style={styles.forgotLink}
                        onPress={() => navigation.navigate("Forgot")}
                    >
                        <Text style={styles.linkText}>Forgot Password?</Text>
                    </TouchableOpacity>
                </Card>

                <View style={styles.footer}>
                    <Button
                        title="Continue as Guest"
                        onPress={handleGuest}
                        style={styles.guestBtn}
                    />

                    <View style={styles.signupContainer}>
                        <Text style={styles.noAccountText}>Don't have an account? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
                            <Text style={styles.signupLink}>Sign Up</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

// Custom TouchableOpacity for components that don't have it imported locally
const TouchableOpacity = require('react-native').TouchableOpacity;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: spacing.lg,
    },
    header: {
        alignItems: 'center',
        marginBottom: spacing.xl,
    },
    title: {
        fontSize: 42,
        fontWeight: '900',
        color: colors.text,
        letterSpacing: -1,
    },
    subtitle: {
        fontSize: 16,
        color: colors.primary,
        fontWeight: '600',
        letterSpacing: 2,
        textTransform: 'uppercase',
        marginTop: 4,
    },
    loginCard: {
        padding: spacing.lg,
    },
    cardTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: colors.text,
        marginBottom: spacing.lg,
    },
    loginBtn: {
        marginTop: spacing.md,
    },
    forgotLink: {
        alignItems: 'center',
        marginTop: spacing.md,
    },
    linkText: {
        color: colors.textSecondary,
        fontSize: 14,
    },
    footer: {
        marginTop: spacing.xl,
    },
    guestBtn: {
        backgroundColor: 'transparent',
        borderWidth: 1.5,
        borderColor: colors.primary,
        elevation: 0,
        shadowOpacity: 0,
    },
    signupContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: spacing.xl,
    },
    noAccountText: {
        color: colors.textSecondary,
        fontSize: 15,
    },
    signupLink: {
        color: colors.primary,
        fontWeight: '700',
        fontSize: 15,
    },
});
