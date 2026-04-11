import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Marker } from 'react-native-maps';
import { theme } from '../../utils/theme';

const SEVERITY_BORDER = {
  Low: theme.colors.green,
  Medium: theme.colors.amber,
  High: theme.colors.red,
  Critical: theme.colors.red,
};

/**
 * MapMarker — custom emoji marker for react-native-maps.
 *
 * Props:
 *   coordinate — { latitude, longitude }
 *   issue      — issue object with { id, icon, severity, title, color }
 *   onPress    — called when the marker is tapped
 *   selected   — if true, renders a larger highlighted state
 */
export default function MapMarker({ coordinate, issue, onPress, selected = false }) {
  const borderColor = SEVERITY_BORDER[issue.severity] ?? issue.color ?? theme.colors.blue;

  return (
    <Marker
      coordinate={coordinate}
      onPress={onPress}
      tracksViewChanges={false}
    >
      <View style={[styles.wrapper, selected && styles.wrapperSelected]}>
        <View
          style={[
            styles.circle,
            { borderColor },
            selected && styles.circleSelected,
          ]}
        >
          <Text style={[styles.emoji, selected && styles.emojiSelected]}>
            {issue.icon}
          </Text>
        </View>
        {/* Small triangle pointer */}
        <View style={[styles.pointer, { borderTopColor: borderColor }]} />
      </View>
    </Marker>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
  },
  wrapperSelected: {
    transform: [{ scale: 1.2 }],
  },
  circle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    borderWidth: 2.5,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
  circleSelected: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 3,
  },
  emoji: {
    fontSize: 18,
    includeFontPadding: false,
  },
  emojiSelected: {
    fontSize: 22,
  },
  pointer: {
    width: 0,
    height: 0,
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderTopWidth: 6,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    marginTop: -1,
  },
});