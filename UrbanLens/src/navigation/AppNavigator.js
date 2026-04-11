/**
 * AppNavigator.js
 * Root navigation — Stack wraps Auth screens and the Main tab bar.
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { theme } from '../utils/theme';

import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import HomeScreen from '../screens/HomeScreen';
import MapScreen from '../screens/MapScreen';
import ReportScreen from '../screens/ReportScreen';
import DashboardScreen from '../screens/DashboardScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// ─── Tab definitions ──────────────────────────────────────────────────────────
const TABS = [
  { name: 'Home', emoji: '🏠', component: HomeScreen },
  { name: 'Map', emoji: '🗺️', component: MapScreen },
  { name: 'Report', emoji: '📸', component: ReportScreen },
  { name: 'Dashboard', emoji: '📊', component: DashboardScreen },
  { name: 'Profile', emoji: '👤', component: ProfileScreen },
];

// ─── Custom Tab Bar ───────────────────────────────────────────────────────────
function CustomTabBar({ state, descriptors, navigation }) {
  return (
    <View style={styles.tabBar}>
      {state.routes.map((route, index) => {
        const tab = TABS.find(t => t.name === route.name);
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            activeOpacity={0.8}
            style={styles.tabItem}
          >
            <View style={[styles.tabPill, isFocused && styles.tabPillActive]}>
              <Text style={styles.tabEmoji}>{tab?.emoji}</Text>
              {isFocused && (
                <Text style={styles.tabLabel}>{route.name}</Text>
              )}
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

// ─── Main tabs ────────────────────────────────────────────────────────────────
function MainTabs() {
  return (
    <Tab.Navigator
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      {TABS.map(tab => (
        <Tab.Screen key={tab.name} name={tab.name} component={tab.component} />
      ))}
    </Tab.Navigator>
  );
}

// ─── Root navigator ───────────────────────────────────────────────────────────
export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{ headerShown: false, animation: 'fade' }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Main" component={MainTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: theme.colors.navBackground,
    height: 64,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: theme.radius.pill,
    gap: 5,
  },
  tabPillActive: {
    backgroundColor: theme.colors.blue + '22',
    borderWidth: 1,
    borderColor: theme.colors.blue + '44',
  },
  tabEmoji: {
    fontSize: 20,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.blue,
  },
});