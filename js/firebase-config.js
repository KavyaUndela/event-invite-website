// Import Firebase modules using modular SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import { getAuth, connectAuthEmulator } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyC7Fv8KV143dVpK53aXI4EES1eMueK732c",
  authDomain: "invitesphere-f32fe.firebaseapp.com",
  projectId: "invitesphere-f32fe",
  storageBucket: "invitesphere-f32fe.firebasestorage.app",
  messagingSenderId: "1024164723892",
  appId: "1:1024164723892:web:92f373dfe83e65b57cebe1",
  measurementId: "G-N5P1JVC6W4"
};

// Initialize Firebase
let app = null;
let auth = null;
let db = null;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  console.log('🔥 Firebase initialized successfully');
} catch (error) {
  console.error('⚠️ Firebase initialization error:', error);
  console.log('Note: Enable Authentication in Firebase Console: https://console.firebase.google.com/project/invitesphere-f32fe/authentication');
}

// Export for use in other files
export { auth, db, app };
