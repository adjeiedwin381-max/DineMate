const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Build React app
console.log('Building React app...');
execSync('npm run build', { stdio: 'inherit' });

// Copy Electron files to build directory
console.log('Copying Electron files...');
const electronSrc = path.join(__dirname, '../electron-main.js');
const electronDest = path.join(__dirname, '../build/electron-main.js');

if (!fs.existsSync(electronDest)) {
  fs.mkdirSync(electronDest, { recursive: true });
}

fs.copyFileSync(
  path.join(electronSrc, 'main.js'),
  path.join(electronDest, 'main.js')
);

if (fs.existsSync(path.join(electronSrc, 'preload.js'))) {
  fs.copyFileSync(
    path.join(electronSrc, 'preload.js'),
    path.join(electronDest, 'preload.js')
  );
}

console.log('Build complete!');