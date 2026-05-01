# UrbanLens

Urban infrastructure fails quietly. Potholes go unlogged, accidents get forgotten, construction zones catch people off guard — not because no one cares, but because there is no simple way to document and surface these issues in real time. UrbanLens fixes that.

A React Native mobile application that lets anyone report real-world civic issues with photo evidence, GPS coordinates, and category context — then visualizes all reports on a live map. The current MVP runs entirely on-device with local persistence. No backend required to get started.

---

## Features

**Authentication**
Login, signup, guest access, and persistent sessions via AsyncStorage.

**Issue Reporting**
Capture a photo, pull current GPS coordinates, select a category (pothole, garbage, traffic, accident, construction), add a description, and submit. The system checks for existing reports within a 100-meter radius before creating a new entry — matching reports increment a shared report count rather than spawning duplicates.

**Severity Classification**
Severity is auto-assigned at submission based on category and description keywords. Accidents default to high, traffic incidents to medium, minor infrastructure issues to low.

**Map View**
All reported issues rendered as interactive markers on a Leaflet and OpenStreetMap map via WebView. Markers are color-coded by category. Tap any marker to view the full report including image, description, severity, report count, and coordinates. Map auto-focuses on the most recent submission.

| Category     | Marker Color |
|--------------|--------------|
| Pothole      | Red          |
| Garbage      | Green        |
| Traffic      | Orange       |
| Construction | Brown        |
| Accident     | Black        |

**Dashboard**
Summary of total reports broken down by category with live updates via Firestore listeners. Reflects changes across devices in real time once cloud sync is active.

**Issue Status Lifecycle**
Each issue progresses through: `open` → `in_progress` → `resolved`. Status can be updated from the issue detail view, transforming the app from a passive reporting tool into an active issue management system.

**Profile**
Account info, initial-based avatar, and logout. Functional for both authenticated users and guests.

---

## Tech Stack

| Layer         | Technology                          |
|---------------|--------------------------------------|
| Frontend      | React Native (CLI), JavaScript ES6+  |
| Navigation    | React Navigation                     |
| Local Storage | AsyncStorage                         |
| Map Rendering | Leaflet + OpenStreetMap via WebView  |
| Camera / Media| React Native Image Picker            |
| Database      | Firebase Firestore (NoSQL, realtime) |

---

## Architecture

The application follows a direct client-to-database loop with no intermediate server:

```
User Action → Firestore Write → Realtime Listener → UI Update
```

Firestore serves as both the data store and the realtime event system. Key operations:

```javascript
// Submit new issue
firestore().collection("issues").add(issue)

// Listen for live updates
firestore().collection("issues").onSnapshot(...)

// Update issue status
firestore().collection("issues").doc(id).update({ status: "resolved" })
```

Each issue document:

```json
{
  "category": "garbage",
  "description": "not collected since Tuesday",
  "location": { "lat": 12.97, "lng": 77.59 },
  "severity": "low | medium | high",
  "status": "open | in_progress | resolved",
  "reportCount": 1,
  "userId": "temp_user",
  "createdAt": "timestamp"
}
```

**Duplicate Detection Logic**

On each new report submission, the system queries existing issues within a 100-meter radius. If a match is found, it increments `reportCount` on the existing document. If no match, a new document is created. This prevents redundant entries and surfaces high-impact issues through aggregated report counts.

---

## Project Structure

```
UrbanLens2/
├── src/
│   ├── components/
│   ├── navigation/
│   │   ├── AppTabs.js
│   │   ├── AuthStack.js
│   │   └── MainNavigator.js
│   ├── screens/
│   │   ├── ForgotPasswordScreen.js
│   │   ├── HomeScreen.js
│   │   ├── IssueDetailScreen.js
│   │   ├── LoginScreen.js
│   │   ├── MapScreen.js
│   │   ├── ProfileScreen.js
│   │   ├── ReportScreen.js
│   │   └── SignupScreen.js
│   ├── services/
│   │   ├── authService.js
│   │   ├── firestoreService.js
│   │   ├── issueService.js
│   │   └── locationService.js
│   └── theme/
├── android/
├── ios/
├── App.js
├── app.json
├── babel.config.js
├── Gemfile
├── index.js
├── jest.config.js
├── metro.config.js
├── tsconfig.json
├── .eslintrc.js
├── .prettierrc.js
├── .watchmanconfig
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

Declare the following in `AndroidManifest.xml`:

- `INTERNET`
- `CAMERA`
- `ACCESS_FINE_LOCATION`
- `ACCESS_COARSE_LOCATION`
- `READ_MEDIA_IMAGES` / `READ_EXTERNAL_STORAGE`
- `WRITE_EXTERNAL_STORAGE`

---

## Known Limitations

- No authentication layer — all submissions use `temp_user` as the identifier
- No role-based access control — anyone can update any issue status
- No backend validation — data integrity enforced client-side only
- No map marker clustering — overlapping markers handled via coordinate jitter
- No push notifications

---

## Roadmap

- Firebase Authentication with persistent user identity
- Cloud-synced issue database visible across devices
- Live location tracking
- Push notifications for nearby or high-severity reports
- Map marker clustering for dense urban areas
- Dark mode

---

## Authors

Nishit Patel, Pragun Shrestha, Pranav Adhikari, Unique Shrestha, Sameera Simha J

---

## License

MIT
