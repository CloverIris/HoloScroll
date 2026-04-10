const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const distElectronDir = path.join(__dirname, '..', 'dist-electron');

// Compile TypeScript
console.log('Compiling Electron main process...');
execSync('npx tsc -p electron/tsconfig.json', { stdio: 'inherit', cwd: path.join(__dirname, '..') });

// Rename .js to .cjs
const files = ['main.js', 'preload.js'];
for (const file of files) {
  const src = path.join(distElectronDir, file);
  const dest = path.join(distElectronDir, file.replace('.js', '.cjs'));
  
  if (fs.existsSync(src)) {
    if (fs.existsSync(dest)) {
      fs.unlinkSync(dest);
    }
    fs.renameSync(src, dest);
    console.log(`Renamed ${file} -> ${file.replace('.js', '.cjs')}`);
  }
}

console.log('Build complete!');
