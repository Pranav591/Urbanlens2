import 'react-native-gesture-handler';
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { theme } from '../utils/theme';

import LoginScreen     from '../screens/LoginScreen';
import SignupScreen    from '../screens/SignupScreen';
import HomeScreen      from '../screens/HomeScreen';
import MapScreen       from '../screens/MapScreen';
import ReportScreen    from '../screens/ReportScreen';
import DashboardScreen from '../screens/DashboardScreen';
import ProfileScreen   from '../screens/ProfileScreen';

const Tab   = createBottomTabNavigator();
const Stack = createStackNavigator();

const TABS = [
  { name: 'Home',      label: 'Home',      emoji: '🏠' },
  { name: 'Map',       label: 'Map',       emoji: '🗺️' },
  { name: 'Report',    label: 'Report',    emoji: '📸' },
  { name: 'Dashboard', label: 'Analytics', emoji: '📊' },
  { name: 'Profile',   label: 'Profile',   emoji: '👤' },
];

function MainTabs({ user, onLogout }) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => {
        const tab = TABS.find(t => t.name === route.name);
        return {
          headerShown: false,
          tabBarStyle: ts.tabBar,
          tabBarIcon: ({ focused }) => (
            <View style={[ts.iconWrap, focused && ts.iconWrapActive]}>
              <Text style={ts.emoji}>{tab.emoji}</Text>
            </View>
          ),
          tabBarLabel: ({ focused }) => (
            <Text style={[ts.label, { color: focused ? theme.colors.blue : 'rgba(255,255,255,0.4)' }]}>
              {tab.label}
            </Text>
          ),
        };
      }}>
      <Tab.Screen name="Home">{props => <HomeScreen {...props} user={user} />}</Tab.Screen>
      <Tab.Screen name="Map" component={MapScreen} />
      <Tab.Screen name="Report">{props => <ReportScreen {...props} user={user} />}</Tab.Screen>
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Profile">{props => <ProfileScreen {...props} user={user} onLogout={onLogout} />}</Tab.Screen>
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const [user, setUser] = useState(null);
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false, animationEnabled: false }}>
        {!user ? (
          <>
            <Stack.Screen name="Login">{props => <LoginScreen {...props} onLogin={setUser} />}</Stack.Screen>
            <Stack.Screen name="Signup">{props => <SignupScreen {...props} onLogin={setUser} />}</Stack.Screen>
          </>
        ) : (
          <Stack.Screen name="Main">{props => <MainTabs {...props} user={user} onLogout={() => setUser(null)} />}</Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const ts = StyleSheet.create({
  tabBar: {
    backgroundColor: theme.colors.navy,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
    height: 64, paddingBottom: 8, paddingTop: 4,
    elevation: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: -3 }, shadowOpacity: 0.2, shadowRadius: 10,
  },
  iconWrap:       { width: 38, height: 28, alignItems: 'center', justifyContent: 'center', borderRadius: 8 },
  iconWrapActive: { backgroundColor: 'rgba(37,99,235,0.2)' },
  emoji:          { fontSize: 18 },
  label:          { fontSize: 10, fontWeight: '700', letterSpacing: 0.3 },
});