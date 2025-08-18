const fs = require('fs');
const path = require('path');

// Define destination paths
const buildDir = path.join(__dirname, '../build');
const mainSrc = path.join(__dirname, '../electron-main.js');
const mainDest = path.join(buildDir, 'electron-main.js');

// Ensure build directory exists
if (!fs.existsSync(buildDir)) {
  fs.mkdirSync(buildDir, { recursive: true });
}

// Copy electron-main.js
if (fs.existsSync(mainSrc)) {
  fs.copyFileSync(mainSrc, mainDest);
  console.log('✅ Copied electron-main.js to build/');
} else {
  console.error('❌ electron-main.js not found at root.');
  process.exit(1);
}

// Copy preload.js if it exists
const preloadSrc = path.join(__dirname, '../src/electron/preload.js');
const preloadDest = path.join(buildDir, 'preload.js');

if (fs.existsSync(preloadSrc)) {
  fs.copyFileSync(preloadSrc, preloadDest);
  console.log('✅ Copied preload.js to build/');
} else {
  console.log('ℹ️ preload.js not found (optional)');
}

console.log('✅ Electron files copied successfully!');
