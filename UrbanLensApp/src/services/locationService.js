// src/services/locationService.js
import { PermissionsAndroid, Platform } from 'react-native';
import Geolocation from '@react-native-community/geolocation';

export const locationService = {
  async requestPermission() {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'UrbanLens needs your location to show nearby issues.',
          buttonPositive: 'Allow',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  },

  getCurrentLocation() {
    return new Promise(async (resolve, reject) => {
      const granted = await this.requestPermission();
      if (!granted) {
        // Fallback to Delhi centre
        resolve({ latitude: 28.6139, longitude: 77.2090 });
        return;
      }
      Geolocation.getCurrentPosition(
        pos => resolve({
          latitude:  pos.coords.latitude,
          longitude: pos.coords.longitude,
        }),
        err => {
          console.warn('Location error:', err);
          resolve({ latitude: 28.6139, longitude: 77.2090 });
        },
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 10000 },
      );
    });
  },

  async reverseGeocode(coords) {
    // TODO: Google Maps Geocoding API or react-native-geocoder
    // Returns human-readable address from lat/lng
    if (!coords) return 'Unknown location';
    return `${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)}`;
  },

  watchPosition(callback) {
    // TODO: For live tracking
    return Geolocation.watchPosition(
      pos => callback({
        latitude:  pos.coords.latitude,
        longitude: pos.coords.longitude,
      }),
      err => console.warn(err),
      { enableHighAccuracy: true, distanceFilter: 10 },
    );
  },

  clearWatch(watchId) {
    Geolocation.clearWatch(watchId);
  },
};