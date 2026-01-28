const fs = require('fs');
const path = require('path');

// Copy icon files to build directory
function copyIcons() {
  const assetsDir = path.join(__dirname, '..', 'assets');
  const buildDir = path.join(__dirname, '..', 'build');

  // Ensure build directory exists
  if (!fs.existsSync(buildDir)) {
    fs.mkdirSync(buildDir, { recursive: true });
  }

  // Copy icon files
  const iconFiles = ['icon.ico'];

  iconFiles.forEach((file) => {
    const sourcePath = path.join(assetsDir, file);
    const destPath = path.join(buildDir, file);

    if (fs.existsSync(sourcePath)) {
      fs.copyFileSync(sourcePath, destPath);
      console.log(`Copied ${sourcePath} to ${destPath}`);
    } else {
      console.warn(`Warning: ${sourcePath} does not exist`);
    }
  });
}

copyIcons();
