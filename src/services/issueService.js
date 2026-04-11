import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = "ISSUES";

export const getIssues = async () => {
    const data = await AsyncStorage.getItem(KEY);
    return data ? JSON.parse(data) : [];
};

export const addIssue = async (issue) => {
    const existing = await getIssues();

    const updated = [
        ...existing,
        {
            id: Date.now(),
            ...issue,
        },
    ];

    await AsyncStorage.setItem(KEY, JSON.stringify(updated));
};