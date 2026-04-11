/**
 * imageService.js
 * Camera capture and gallery picker helpers.
 * Uses react-native-image-picker.
 */

import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { PermissionsAndroid, Platform } from 'react-native';

const IMAGE_OPTIONS = {
  mediaType: 'photo',
  quality: 0.85,
  maxWidth: 1920,
  maxHeight: 1920,
  includeBase64: false,
  saveToPhotos: false,
};

/**
 * Open the device camera and capture a photo.
 * Resolves with an asset object { uri, fileName, fileSize, width, height }
 * or null if the user cancelled.
 */
export async function captureFromCamera() {
  if (Platform.OS === 'android') {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        title: 'Camera Permission',
        message: 'UrbanLens needs camera access to photograph civic issues.',
        buttonPositive: 'Allow',
        buttonNegative: 'Deny',
      },
    );
    if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
      throw new Error('Camera permission denied.');
    }
  }

  return new Promise((resolve, reject) => {
    launchCamera(IMAGE_OPTIONS, response => {
      if (response.didCancel) return resolve(null);
      if (response.errorCode) return reject(new Error(response.errorMessage));
      resolve(response.assets?.[0] ?? null);
    });
  });
}

/**
 * Open the device photo library and pick an image.
 * Resolves with an asset object { uri, fileName, fileSize, width, height }
 * or null if the user cancelled.
 */
export async function pickFromLibrary() {
  return new Promise((resolve, reject) => {
    launchImageLibrary(IMAGE_OPTIONS, response => {
      if (response.didCancel) return resolve(null);
      if (response.errorCode) return reject(new Error(response.errorMessage));
      resolve(response.assets?.[0] ?? null);
    });
  });
}

/**
 * Pick multiple images from the library (up to maxCount).
 * Resolves with an array of asset objects.
 */
export async function pickMultipleFromLibrary(maxCount = 3) {
  return new Promise((resolve, reject) => {
    launchImageLibrary(
      { ...IMAGE_OPTIONS, selectionLimit: maxCount },
      response => {
        if (response.didCancel) return resolve([]);
        if (response.errorCode) return reject(new Error(response.errorMessage));
        resolve(response.assets ?? []);
      },
    );
  });
}