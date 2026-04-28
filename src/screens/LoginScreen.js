import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
} from 'react-native';

import { saveUser } from '../services/authService';

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
        <View style={styles.container}>

            {/* 🔥 TITLE */}
            <Text style={styles.title}>UrbanLens</Text>
            <Text style={styles.subtitle}>Login to continue</Text>

            {/* 🔥 INPUTS */}
            <TextInput
                placeholder="Email"
                placeholderTextColor="#888"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
            />

            <TextInput
                placeholder="Password"
                placeholderTextColor="#888"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                style={styles.input}
            />

            {/* 🔥 LOGIN */}
            <TouchableOpacity style={styles.btn} onPress={handleLogin}>
                <Text style={styles.btnText}>Login</Text>
            </TouchableOpacity>

            {/* 🔥 GUEST */}
            <TouchableOpacity style={styles.guestBtn} onPress={handleGuest}>
                <Text style={styles.guestText}>Continue as Guest</Text>
            </TouchableOpacity>

            {/* 🔗 LINKS */}
            <TouchableOpacity onPress={() => navigation.navigate("Forgot")}>
                <Text style={styles.link}>Forgot Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
                <Text style={styles.link}>Create Account</Text>
            </TouchableOpacity>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#f5f7fb',
    },

    title: {
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'center',
    },

    subtitle: {
        textAlign: 'center',
        marginBottom: 30,
        color: '#666',
    },

    input: {
        backgroundColor: '#fff',
        padding: 14,
        borderRadius: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#ddd',   // 🔥 ADD BORDER
        color: '#000',         // 🔥 ENSURE TEXT VISIBLE
    },

    btn: {
        backgroundColor: '#007bff',
        padding: 16,
        borderRadius: 12,
        marginTop: 10,
    },

    btnText: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 16,
    },

    guestBtn: {
        marginTop: 12,
        padding: 14,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#007bff',
    },

    guestText: {
        textAlign: 'center',
        color: '#007bff',
        fontWeight: '600',
    },

    link: {
        textAlign: 'center',
        marginTop: 12,
        color: '#007bff',
    },
});