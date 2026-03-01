# 🏙️ UrbanLens
### AI-Powered Hyperlocal Civic Issue Detection & Mapping System

> Report it. Map it. Fix it.

UrbanLens is a mobile-first civic-tech application that empowers citizens to detect, report, and visualize urban infrastructure issues — potholes, garbage overflow, streetlight failures, water leakage, and more. Built with React Native and powered by geolocation, interactive mapping, and machine learning, UrbanLens bridges the gap between citizens and city authorities through data-driven urban monitoring.

---

## 📸 Screenshots

> *(Coming soon — Phase 1 build in progress)*

---

## ✨ Features

| Feature | Description |
|--------|-------------|
| 📸 **Issue Reporting** | Capture and submit civic issues with photo evidence |
| 📍 **Auto Location Tagging** | GPS-based geolocation attached to every report |
| 🗺️ **Interactive Map** | India map centered on Bengaluru with live issue markers |
| 🔥 **Heatmap Visualization** | Density overlays to identify issue hotspots |
| 🎯 **Severity Classification** | Tag issues as Low, Medium, or High severity |
| 📊 **Analytics Dashboard** | Trends, distributions, and historical insights |
| 👤 **User Authentication** | Dynamic auth with profile management |
| 🎛️ **Smart Filters** | Filter by issue type and status (Pending / In Progress / Resolved) |
| 🔁 **Upvote System** | Upvote existing reports to avoid duplicates and signal urgency |
| 📶 **Offline Support** | Queue reports locally and sync when back online |

---

## 🧠 Tech Stack

### Frontend
- **React Native** (CLI)
- **React Navigation**
- **React Native Maps**
- **Async Storage** — offline-first local queuing

### Mapping
- **Google Maps / Mapbox** integration
- Marker clustering
- Heatmap overlays
- Severity color coding

### Backend *(Phase 2)*
- **Firebase** / **Node.js + Express**
- **MongoDB** / **Firestore**
- Cloud image storage

### Machine Learning *(Phase 3)*
- **TensorFlow / PyTorch**
- **TensorFlow Lite** — on-device inference
- Lightweight image classification model for automated issue tagging

---

## 📍 Map Configuration

| Parameter | Value |
|-----------|-------|
| Default Center | Bengaluru, India |
| Latitude | `12.9716` |
| Longitude | `77.5946` |

**Map Capabilities:**
- Issue markers with severity color coding
- Marker clustering for dense areas
- Heatmap density layer
- Status-based filtering
- Real-time region updates

---

## 🚀 Getting Started

### Prerequisites

- Node.js `>= 18.x`
- React Native CLI
- Android Studio / Xcode
- Google Maps API Key or Mapbox Token

### Installation

```bash
# Clone the repository
git clone https://github.com/nish-debug15/UrbanLens.git
cd urbanlens

# Install dependencies
npm install

# iOS only
cd ios && pod install && cd ..
```

### Running the App

```bash
# Android
npx react-native run-android

# iOS
npx react-native run-ios
```

### Environment Setup

Create a `.env` file in the root directory:

```env
GOOGLE_MAPS_API_KEY=your_api_key_here
MAPBOX_TOKEN=your_mapbox_token_here        # if using Mapbox
FIREBASE_API_KEY=your_firebase_key_here    # Phase 2
```

---

## 📁 Project Structure

```
urbanlens/
├── src/
│   ├── screens/          # App screens (Home, Report, Map, Dashboard, Profile)
│   ├── components/       # Reusable UI components
│   ├── navigation/       # React Navigation setup
│   ├── services/         # API, location, image services
│   ├── store/            # State management
│   ├── utils/            # Helpers and constants
│   └── assets/           # Icons, images, fonts
├── android/
├── ios/
├── .env.example
└── README.md
```

---

## 🗂️ Issue Data Model

```json
{
  "id": "uuid",
  "type": "pothole | garbage | streetlight | water_leakage | other",
  "severity": "low | medium | high",
  "status": "pending | in_progress | resolved",
  "location": {
    "latitude": 12.9716,
    "longitude": 77.5946,
    "address": "MG Road, Bengaluru"
  },
  "imageUrl": "https://...",
  "description": "string",
  "upvotes": 0,
  "reportedBy": "userId",
  "createdAt": "ISO timestamp",
  "updatedAt": "ISO timestamp"
}
```

---

## 🔮 Roadmap

- ✅ **Phase 1** — Mobile-first issue reporting, GPS tagging, interactive map, heatmap, severity filters, analytics dashboard
- 🔄 **Phase 2** — Backend integration (Firebase/Node.js), cloud image storage, user auth, real-time sync
- 🔮 **Phase 3** — On-device ML inference (TFLite) for automated issue classification, smart duplicate detection, municipal API hooks

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch — `git checkout -b feature/your-feature`
3. Commit your changes — `git commit -m 'Add some feature'`
4. Push to the branch — `git push origin feature/your-feature`
5. Open a Pull Request

Please make sure your code follows the existing style and all tests pass before submitting.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 🌆 Built for Bengaluru. Designed for Every City.

> UrbanLens is an open initiative to make cities more responsive, transparent, and livable — one report at a time.
