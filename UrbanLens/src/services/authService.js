/**
 * authService.js
 * Stub authentication service using AsyncStorage for session persistence.
 * Replace the mock logic here with real API calls when a backend is ready.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@urbanlens_user';

// Simulated user database (replace with real API)
const MOCK_USERS = [
  { id: '1', name: 'Arjun Sharma', email: 'arjun@example.com', password: 'password123' },
];

/**
 * Login with email and password.
 * Returns the user object on success, throws on failure.
 */
export async function login(email, password) {
  // Simulate network delay
  await delay(600);

  const user = MOCK_USERS.find(
    u => u.email.toLowerCase() === email.toLowerCase() && u.password === password,
  );

  if (!user) {
    throw new Error('Invalid email or password.');
  }

  const session = { id: user.id, name: user.name, email: user.email, isGuest: false };
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  return session;
}

/**
 * Register a new user.
 * Returns the created user object on success, throws on failure.
 */
export async function signup(name, email, password) {
  await delay(800);

  const exists = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (exists) {
    throw new Error('An account with this email already exists.');
  }

  const newUser = { id: String(Date.now()), name, email, password };
  MOCK_USERS.push(newUser);

  const session = { id: newUser.id, name: newUser.name, email: newUser.email, isGuest: false };
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  return session;
}

/**
 * Continue as a guest (no account required).
 */
export async function guestLogin() {
  await delay(300);
  const session = { id: 'guest', name: 'Guest', email: '', isGuest: true };
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  return session;
}

/**
 * Sign out the current user and clear the session.
 */
export async function logout() {
  await AsyncStorage.removeItem(STORAGE_KEY);
}

/**
 * Restore session from storage (call on app launch).
 * Returns the user object or null if no session exists.
 */
export async function getSession() {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : null;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}