import { ErrorHandler } from './utils/error-handler';
import { copyFile, ensureDir, fileExists, joinProjectPath } from './utils/fs-utils';
import { Logger } from './utils/logger';

/**
 * Script to build/copy icon files to dist directory
 */

async function buildIcons(): Promise<void> {
  try {
    Logger.info('Starting icon build process...');

    const assetsDir = joinProjectPath('src', 'assets');
    const distDir = joinProjectPath('dist');

    // Ensure dist directory exists
    ensureDir(distDir);

    // Copy icon files
    const iconFiles = ['icon.ico', 'favicon.ico'];

    // Copy icon.ico as icon.png for electron-builder compatibility
    const sourceIconPath = joinProjectPath('src', 'assets', 'icon.ico');
    const pngIconPath = joinProjectPath('dist', 'icon.png');

    if (fileExists(sourceIconPath)) {
      copyFile(sourceIconPath, pngIconPath);
    } else {
      Logger.warn(`Source icon file does not exist: ${sourceIconPath}`);
    }

    for (const file of iconFiles) {
      const sourcePath = joinProjectPath('src', 'assets', file);
      const destPath = joinProjectPath('dist', file);

      if (fileExists(sourcePath)) {
        copyFile(sourcePath, destPath);
      } else {
        Logger.warn(`Source file does not exist: ${sourcePath}`);
      }
    }

    Logger.info('Icon build process completed successfully');
  } catch (error) {
    ErrorHandler.handleError(error, 'build-icons');
    process.exitCode = 1;
  }
}

// Run the build if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  buildIcons();
}

export { buildIcons };
