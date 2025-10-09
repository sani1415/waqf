/**
 * Firebase Configuration
 * 
 * SETUP INSTRUCTIONS:
 * 1. Go to https://firebase.google.com
 * 2. Create a new project (or use existing)
 * 3. Go to Project Settings > General
 * 4. Scroll down to "Your apps" section
 * 5. Click "Add app" > Web (</>) icon
 * 6. Register app and copy the config object
 * 7. Replace the config below with your Firebase config
 * 8. Enable Realtime Database in Firebase Console:
 *    - Go to Build > Realtime Database
 *    - Click "Create Database"
 *    - Choose location
 *    - Start in "Test mode" for now (we'll secure it later)
 */

// PLACEHOLDER CONFIG - REPLACE WITH YOUR FIREBASE CONFIG
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Example of a real config (DO NOT USE - this is just for reference):
/*
const firebaseConfig = {
    apiKey: "AIzaSyB1234567890abcdefghijklmnop",
    authDomain: "waqf-app.firebaseapp.com",
    databaseURL: "https://waqf-app-default-rtdb.firebaseio.com",
    projectId: "waqf-app",
    storageBucket: "waqf-app.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:abcdef1234567890"
};
*/

