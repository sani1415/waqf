#!/usr/bin/env node
/**
 * Migrates Firestore data from akhbaarulmadinah to waqful-madinah
 * Run: npm install firebase && node scripts/migrate-firestore.js
 */
let firebase;
try {
  firebase = require('firebase/compat/app');
  require('firebase/compat/firestore');
} catch (e) {
  console.log('Run: npm install firebase');
  process.exit(1);
}

const OLD_CONFIG = {
  apiKey: "AIzaSyCDa1_V3HUafIXWbc5afD60xopujPFHu7c",
  authDomain: "akhbaarulmadinah.firebaseapp.com",
  projectId: "akhbaarulmadinah",
  storageBucket: "akhbaarulmadinah.firebasestorage.app",
  messagingSenderId: "980144439407",
  appId: "1:980144439407:web:8219d6fe22cf380be98d9a"
};

const NEW_CONFIG = {
  apiKey: "AIzaSyDdyV02qnRbrE_5aAfNcQ3auT2GRL1nZ60",
  authDomain: "waqful-madinah.firebaseapp.com",
  projectId: "waqful-madinah",
  storageBucket: "waqful-madinah.firebasestorage.app",
  messagingSenderId: "523390821312",
  appId: "1:523390821312:web:c5b382cd80cd11ba9b5e25"
};

const COLLECTIONS = ['students', 'tasks', 'messages', 'quizzes', 'quizResults'];

async function migrate() {
  const oldApp = firebase.initializeApp(OLD_CONFIG, 'old');
  const newApp = firebase.initializeApp(NEW_CONFIG, 'new');
  const oldDb = oldApp.firestore();
  const newDb = newApp.firestore();

  let total = 0;
  for (const colName of COLLECTIONS) {
    try {
      const snap = await oldDb.collection(colName).get();
      if (snap.empty) {
        console.log(colName + ': 0 documents');
        continue;
      }
      const batch = newDb.batch();
      snap.forEach(d => {
        batch.set(newDb.collection(colName).doc(d.id), d.data());
      });
      await batch.commit();
      total += snap.size;
      console.log(colName + ': ' + snap.size + ' documents migrated');
    } catch (e) {
      console.error(colName + ' ERROR:', e.message);
    }
  }
  console.log('Done! Total', total, 'documents migrated.');
}

migrate().catch(e => { console.error(e); process.exit(1); });
