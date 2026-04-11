/**
 * locationService.js
 * Device location and reverse-geocoding helpers.
 * Uses react-native's PermissionsAndroid + Geolocation API.
 * Replace reverseGeocode() with a real geocoding API call (Google Maps, Nominatim, etc.)
 */

import { PermissionsAndroid, Platform } from 'react-native';
import Geolocation from '@react-native-community/geolocation';

/**
 * Request location permission on Android and return the current position.
 * Resolves with { latitude, longitude, accuracy } or throws an error.
 */
export async function getCurrentLocation() {
  if (Platform.OS === 'android') {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'UrbanLens Location Access',
        message: 'UrbanLens needs your location to pin reported issues on the map.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Deny',
        buttonPositive: 'Allow',
      },
    );

    if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
      throw new Error('Location permission denied.');
    }
  }

  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      position => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
      },
      error => reject(new Error(error.message)),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
    );
  });
}

/**
 * Reverse-geocode a coordinate into a human-readable address string.
 * Currently returns a stub — replace with Google Maps Geocoding API or Nominatim.
 *
 * @param {number} latitude
 * @param {number} longitude
 * @returns {Promise<string>} address string
 */
export async function reverseGeocode(latitude, longitude) {
  // ── Stub implementation ──────────────────────────────────────────────────
  // Replace the URL below with your real geocoding endpoint, e.g.:
  // const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=YOUR_KEY`;

  await delay(300);

  // Return a placeholder based on rough Bengaluru zones
  if (latitude > 12.97) return 'North Bengaluru, Karnataka';
  if (latitude > 12.95) return 'Central Bengaluru, Karnataka';
  if (latitude > 12.93) return 'South Bengaluru, Karnataka';
  return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
}

/**
 * Watch position changes and call the callback on each update.
 * Returns a watchId that can be passed to clearWatch() to stop tracking.
 *
 * @param {function} callback - called with { latitude, longitude }
 * @returns {number} watchId
 */
export function watchLocation(callback) {
  return Geolocation.watchPosition(
    position => {
      callback({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    },
    error => console.warn('[locationService] watchPosition error:', error.message),
    { enableHighAccuracy: true, distanceFilter: 10 },
  );
}

/**
 * Stop watching position updates.
 * @param {number} watchId
 */
export function clearWatch(watchId) {
  Geolocation.clearWatch(watchId);
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}