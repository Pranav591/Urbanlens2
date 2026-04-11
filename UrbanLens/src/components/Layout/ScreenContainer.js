import React from 'react';
import {
  View,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { theme } from '../../utils/theme';

/**
 * ScreenContainer — base wrapper for every screen.
 *
 * Handles background color, SafeAreaView, StatusBar, and
 * optional scroll behaviour.
 *
 * Props:
 *   children    — screen content
 *   scrollable  — if true, wraps content in a ScrollView
 *   padding     — horizontal/vertical padding (default: 20)
 *   style       — additional inner content styles
 *   scrollProps — extra props passed to ScrollView
 */
export default function ScreenContainer({
  children,
  scrollable = false,
  padding = 20,
  style,
  scrollProps = {},
}) {
  const innerStyle = [styles.inner, { padding }, style];

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.background} />
      <View style={styles.root}>
        {scrollable ? (
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={innerStyle}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            {...scrollProps}
          >
            {children}
          </ScrollView>
        ) : (
          <View style={[styles.fill, innerStyle]}>{children}</View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  root: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scroll: {
    flex: 1,
  },
  inner: {
    // padding applied dynamically
  },
  fill: {
    flex: 1,
  },
});