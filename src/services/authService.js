import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_KEY = "USER";

export const saveUser = async (user) => {
    try {
        await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch (e) {
        console.log("Save error:", e);
    }
};

export const getUser = async () => {
    try {
        const data = await AsyncStorage.getItem(USER_KEY);
        return data ? JSON.parse(data) : null;
    } catch (e) {
        console.log("Get error:", e);
        return null;
    }
};

export const logout = async () => {
    try {
        await AsyncStorage.removeItem(USER_KEY);
    } catch (e) {
        console.log("Logout error:", e);
    }
};