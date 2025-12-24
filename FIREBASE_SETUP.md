# Firebase Setup Instructions

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select existing project
3. Follow the setup wizard

## Step 2: Get Firebase Configuration

1. In Firebase Console, click the gear icon ⚙️ → Project settings
2. Scroll down to "Your apps" section
3. Click the web icon `</>` to register your web app
4. Copy the `firebaseConfig` object

## Step 3: Update firebase-config.js

Replace the values in `public/js/firebase-config.js` with your actual Firebase config:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abc123def456"
};
```

## Step 4: Enable Firestore Database

1. In Firebase Console, go to **Firestore Database**
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select your Cloud Firestore location
5. Click "Enable"

## Step 5: Set Firestore Security Rules (Optional for Production)

Go to Firestore → Rules and update:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write for guest events
    match /guestEvents/{document=**} {
      allow read, write: if true;
    }
    // Add more specific rules for production
  }
}
```

## Step 6: Test Your Application

1. Start your server: `node server.js`
2. Open `http://localhost:3000`
3. Click "Login" button (top right)
4. Fill in guest form and submit
5. Check Firebase Console → Firestore Database to see your data

## Collections Created

- **guestEvents**: Stores all guest event submissions
  - Fields: guestName, eventType, eventName, eventDate, eventTime, eventLocation, createdAt

## Troubleshooting

- **Firebase not initialized**: Check browser console for errors
- **CORS errors**: Make sure your domain is authorized in Firebase Console
- **Data not saving**: Verify Firestore rules allow write access
- **Check console**: Open browser DevTools (F12) to see Firebase connection status

## Features

✅ Login button visible in top-right navbar
✅ Attractive gradient landing page with animations
✅ Modal-based login system
✅ Data saves to Firebase Firestore
✅ Fallback to local storage if Firebase fails
✅ Professional design with smooth transitions
