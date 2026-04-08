// src/services/imageService.js
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { PermissionsAndroid, Platform } from 'react-native';

const IMAGE_OPTIONS = {
  mediaType: 'photo',
  quality: 0.8,
  maxWidth: 1280,
  maxHeight: 1280,
  includeBase64: false,
};

export const imageService = {
  async requestCameraPermission() {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'UrbanLens needs camera access to photograph issues.',
          buttonPositive: 'Allow',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  },

  async captureFromCamera() {
    const granted = await this.requestCameraPermission();
    if (!granted) throw new Error('Camera permission denied.');

    return new Promise((resolve, reject) => {
      launchCamera(IMAGE_OPTIONS, response => {
        if (response.didCancel) { resolve(null); return; }
        if (response.errorCode) { reject(new Error(response.errorMessage)); return; }
        const asset = response.assets?.[0];
        if (asset) resolve({ uri: asset.uri, width: asset.width, height: asset.height, type: asset.type });
        else resolve(null);
      });
    });
  },

  async pickFromLibrary() {
    return new Promise((resolve, reject) => {
      launchImageLibrary(IMAGE_OPTIONS, response => {
        if (response.didCancel) { resolve(null); return; }
        if (response.errorCode) { reject(new Error(response.errorMessage)); return; }
        const asset = response.assets?.[0];
        if (asset) resolve({ uri: asset.uri, width: asset.width, height: asset.height, type: asset.type });
        else resolve(null);
      });
    });
  },

  async uploadImage(uri, path) {
    // TODO: Firebase Storage upload
    // const ref = storage().ref(path);
    // await ref.putFile(uri);
    // return await ref.getDownloadURL();
    console.log('[imageService] uploadImage stub — implement Firebase Storage in Phase 2');
    return uri; // return local URI as placeholder
  },

  async analyzeWithML(uri) {
    // TODO: TensorFlow Lite inference in Phase 3
    // Run on-device model to classify issue type and severity
    console.log('[imageService] analyzeWithML stub — implement TFLite in Phase 3');
    return { type: 'unknown', confidence: 0, severity: 'medium' };
  },
};