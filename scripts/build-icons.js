const fs = require('fs');
const path = require('path');

// Copy icon files to dist directory
function copyIcons() {
  const assetsDir = path.join(__dirname, '..', 'src', 'assets');
  const distDir = path.join(__dirname, '..', 'dist');

  // Ensure dist directory exists
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }

  // Copy icon files
  const iconFiles = ['icon.ico', 'favicon.ico']; // Also copy favicon

  // Copy icon.ico as icon.png for electron-builder compatibility
  const sourceIconPath = path.join(assetsDir, 'icon.ico');
  const pngIconPath = path.join(distDir, 'icon.png');

  if (fs.existsSync(sourceIconPath)) {
    // Copy icon.ico to icon.png (same format works for both)
    fs.copyFileSync(sourceIconPath, pngIconPath);
    console.log(`Copied ${sourceIconPath} to ${pngIconPath} (for electron-builder)`);
  }

  iconFiles.forEach((file) => {
    const sourcePath = path.join(assetsDir, file);
    const destPath = path.join(distDir, file);

    if (fs.existsSync(sourcePath)) {
      fs.copyFileSync(sourcePath, destPath);
      console.log(`Copied ${sourcePath} to ${destPath}`);
    } else {
      console.warn(`Warning: ${sourcePath} does not exist`);
    }
  });
}

copyIcons();
