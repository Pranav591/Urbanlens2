# UrbanLens

Urban infrastructure fails quietly. Potholes go unlogged, accidents get forgotten, and construction zones catch people off guard — not because no one cares, but because there's no simple way to document and surface these issues in real time. UrbanLens is an attempt to fix that.

It's a React Native mobile app that lets anyone report real-world civic issues — with photo evidence, GPS coordinates, and context — and visualize them on a live map. Built offline-first, no backend required to get started.

---

## Features

**Authentication**  
Login, signup, guest access, and persistent sessions via local storage.

**Issue Reporting**  
Capture a photo, pull your current GPS location, categorize the issue (pothole, traffic, accident, construction, police activity), add a title, and submit — all in under a minute.

**Map View**  
All reported issues rendered as markers on an interactive Leaflet/OpenStreetMap map. Tap any marker to see the full report with image. Auto-focuses on the most recent submission.

**Dashboard**  
A clean summary of total reports broken down by category — useful for spotting patterns at a glance.

**Profile**  
Account info, initial-based avatar, and logout. Works for both authenticated users and guests.

---

## Tech Stack

- React Native (CLI)
- JavaScript (ES6+)
- AsyncStorage — local persistence
- React Navigation
- React Native WebView
- Leaflet + OpenStreetMap
- React Native Image Picker

---

## Project Structure

```
UrbanLens2/
│
├── src/
│   ├── navigation/
│   │   └── MainNavigator.js
│   │
│   ├── screens/
│   │   ├── LoginScreen.js
│   │   ├── SignupScreen.js
│   │   ├── ForgotPasswordScreen.js
│   │   ├── HomeScreen.js
│   │   ├── MapScreen.js
│   │   ├── ReportScreen.js
│   │   └── ProfileScreen.js
│   │
│   ├── services/
│   │   ├── authService.js
│   │   ├── issueService.js
│   │   └── locationService.js
│
├── android/
├── ios/
├── App.js
└── package.json
```

---

## Getting Started

```bash
# Clone the repo
git clone https://github.com/Pranav591/Urbanlens2.git
cd urbanlens

# Install dependencies
npm install

# Start Metro bundler
npx react-native start

# Run on Android
npx react-native run-android
```

---

## Android Permissions

The following permissions need to be declared in `AndroidManifest.xml`:

- `INTERNET`
- `CAMERA`
- `ACCESS_FINE_LOCATION`
- `ACCESS_COARSE_LOCATION`
- `READ_MEDIA_IMAGES` / `READ_EXTERNAL_STORAGE`
- `WRITE_EXTERNAL_STORAGE`

---

## What's Next

The current version runs entirely on-device. The roadmap moves toward making reports shareable and persistent:

- Firebase Authentication
- Cloud-synced issue database (so reports are visible across devices)
- Live location tracking
- Push notifications for nearby reports
- Dark mode

---

## Authors

Nishit Patel, Pragun Shrestha, Pranav Adhikari, Unique Shrestha, Sameera Simha J

---

## License

MIT