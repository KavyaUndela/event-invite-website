// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);