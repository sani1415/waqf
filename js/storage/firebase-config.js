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

// LIVE CONFIG - filled from your Firebase console
const firebaseConfig = {
    apiKey: "AIzaSyBzPoIbqyEUS0fmyZT6EOpCrxkSpKCGg1k",
    authDomain: "waqf-task.firebaseapp.com",
    databaseURL: "https://waqf-task-default-rtdb.firebaseio.com",
    projectId: "waqf-task",
    storageBucket: "waqf-task.firebasestorage.app",
    messagingSenderId: "317347776811",
    appId: "1:317347776811:web:cac00727d867f6b2299d6e"
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

