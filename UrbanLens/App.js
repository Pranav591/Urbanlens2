/**
 * App.js — Root component for UrbanLens
 * Mounts the AppNavigator which handles all routing.
 */

import React from 'react';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return <AppNavigator />;
}