# 🚀 UrbanLens

UrbanLens is a **React Native mobile application** that allows users to **report real-world issues** like potholes, traffic jams, accidents, construction, etc., with **location and photo evidence**, and view them on an interactive map.

---

## 📱 Features

### 🔐 Authentication

* Login / Signup
* Guest login option
* Auto-login using local storage
* Logout functionality

### 📝 Issue Reporting

* Add issue title
* Select issue type (🚧 pothole, 🚦 traffic, 🚓 police, 🚑 accident, 🏗 construction)
* Capture photo using camera
* Get current location (GPS)
* Save issue locally

### 🗺 Map Integration

* Interactive map using Leaflet (OpenStreetMap)
* Displays all reported issues as markers
* Click marker → view details + image
* Auto-focus on latest issue

### 🎯 Dashboard

* View total issues
* Category-wise count (traffic, pothole, etc.)
* Clean UI with emoji indicators

### 👤 Profile

* View user info (email / guest)
* Avatar (initial-based)
* Logout option

---

## 🛠 Tech Stack

* React Native (CLI)
* JavaScript (ES6+)
* AsyncStorage (local database)
* React Navigation
* React Native WebView
* Leaflet + OpenStreetMap (free maps)
* React Native Image Picker (camera)

---

## 📂 Project Structure

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

## ⚙️ Installation & Setup

### 1️⃣ Clone the repo

```
git clone https://github.com/your-username/urbanlens.git
cd urbanlens
```

### 2️⃣ Install dependencies

```
npm install
```

### 3️⃣ Start Metro

```
npx react-native start
```

### 4️⃣ Run app (Android)

```
npx react-native run-android
```

---

## 🔑 Permissions Required (Android)

Make sure these are added in `AndroidManifest.xml`:

* INTERNET
* CAMERA
* ACCESS_FINE_LOCATION
* ACCESS_COARSE_LOCATION
* READ_MEDIA_IMAGES / READ_EXTERNAL_STORAGE
* WRITE_EXTERNAL_STORAGE

---

## 📸 How It Works

1. User logs in / continues as guest
2. Goes to **Report Screen**
3. Adds title + captures photo + gets location
4. Issue is saved locally
5. Appears on **Map Screen** as marker
6. Click marker → see details + image

---

## 🚀 Future Improvements

* 🔥 Firebase Authentication (real login)
* 🌐 Cloud database (shared issues)
* 📍 Live tracking
* 🖼 Profile photo upload
* 🔔 Notifications
* 🌙 Dark mode

---

## 👨‍💻 Author

Pranav

---

## ⭐ Support

If you like this project:

* ⭐ Star the repo
* 🍴 Fork it
* 📢 Share it

---

## 📄 License

This project is open-source and free to use.
