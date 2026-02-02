#!/usr/bin/env node
/**
 * Copies only the web app files to public/ for Firebase Hosting deploy.
 * Excludes node_modules, functions, dataconnect, etc.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const PUBLIC = path.join(ROOT, 'public');

const TO_COPY = [
  'index.html',
  '404.html',
  'css',
  'js',
  'locales',
  'pages'
];

function copyRecursive(src, dest) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    for (const item of fs.readdirSync(src)) {
      copyRecursive(path.join(src, item), path.join(dest, item));
    }
  } else {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
  }
}

// Clean public folder (except .gitkeep if any)
if (fs.existsSync(PUBLIC)) {
  for (const item of fs.readdirSync(PUBLIC)) {
    fs.rmSync(path.join(PUBLIC, item), { recursive: true });
  }
} else {
  fs.mkdirSync(PUBLIC, { recursive: true });
}

// Copy files
for (const item of TO_COPY) {
  const src = path.join(ROOT, item);
  const dest = path.join(PUBLIC, item);
  if (fs.existsSync(src)) {
    copyRecursive(src, dest);
    console.log('  Copied:', item);
  }
}

console.log('Done! public/ folder ready for deploy.');
