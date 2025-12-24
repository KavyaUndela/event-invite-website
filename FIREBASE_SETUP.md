# Firebase Setup Instructions - REQUIRED ⚠️

Your InviteSphere site is ready to deploy! You just need to set up Firebase.

## Step 1: Open Firebase Console

👉 **[Open Firebase Console](https://console.firebase.google.com/project/invitesphere-f32fe)**

(Already have a project at `invitesphere-f32fe` - just complete the setup below)

## Step 2: Create Firestore Database

1. Click **"Firestore Database"** in left menu
2. If not created yet, click **"Create Database"**
3. Choose **"Start in production mode"** 
4. Select region closest to you (e.g., Asia-South1 for India)
5. Click **"Create Database"** and wait (takes 1-2 minutes)

## Step 3: Set Up Security Rules

Go to **Firestore Database** → **Rules** tab and paste:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /rsvps/{document=**} {
      allow read, write: if true;
    }
    match /events/{document=**} {
      allow read, write: if true;
    }
  }
}
```

Click **"Publish"**

## Step 4: Enable Authentication

1. Go to **"Authentication"** in left menu
2. Click **"Get Started"**  
3. **Enable Email/Password provider:**
   - Click "Email/Password"
   - Toggle "Enable"
   - Click "Save"

4. **Enable Google Sign-In:**
   - Click "Google"
   - Toggle "Enable"
   - Add your email as test user
   - Click "Save"

## Step 5: Verify Firebase Config

Your config is already in `/js/firebase-config.js`:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC7Fv8KV143dVpK53aXI4EES1eMueK732c",
  authDomain: "invitesphere-f32fe.firebaseapp.com",
  projectId: "invitesphere-f32fe",
  storageBucket: "invitesphere-f32fe.firebasestorage.app",
  messagingSenderId: "1024164723892",
  appId: "1:1024164723892:web:92f373dfe83e65b57cebe1"
};
```

This is already configured - no changes needed!

## ✅ Test Your Site

1. Visit: **https://kavyaundela.github.io/event-invite-website/**
2. Click **"Get Started"**
3. Try **"Guest Access"** or **"Admin"** login
4. Submit test RSVP
5. Check admin dashboard

## 🐛 If Something's Wrong

Visit the diagnostic page: **https://kavyaundela.github.io/event-invite-website/diagnostic.html**

This will show you:
- ✅ Firebase Connection Status
- ✅ Database Status  
- ✅ Authentication Status
- ✅ LocalStorage Status

Share any red errors with me!
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
