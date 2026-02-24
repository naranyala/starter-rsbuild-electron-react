import * as fs from 'node:fs';
import { ErrorHandler } from './utils/error-handler';
import { joinProjectPath } from './utils/fs-utils';
import { Logger } from './utils/logger';

/**
 * Script to check if Electron is properly installed
 */

async function checkElectronInstallation(): Promise<void> {
  try {
    Logger.info('Checking Electron installation...');

    const electronPathFile = joinProjectPath('node_modules', 'electron', 'path.txt');

    if (fs.existsSync(electronPathFile)) {
      Logger.info('✓ Electron path.txt exists');
      const electronPath = fs.readFileSync(electronPathFile, 'utf8');
      console.log(electronPath.trim());
    } else {
      Logger.error('✗ Electron path.txt missing - binary download failed');

      console.log('');
      console.log('To fix this issue:');
      console.log('1. Try using a VPN or different network connection');
      console.log('2. Or set ELECTRON_MIRROR environment variable:');
      console.log("   export ELECTRON_MIRROR='https://npmmirror.com/mirrors/electron/'");
      console.log('   bun install');
      console.log('');
      console.log('3. Or download manually from:');
      console.log('   https://github.com/electron/electron/releases/tag/v40.0.0');
      console.log('');
      console.log('4. Or use npm instead of bun:');
      console.log('   rm -rf node_modules/electron');
      console.log('   npm install electron@40.0.0');
    }
  } catch (error) {
    ErrorHandler.handleError(error, 'check-electron');
    process.exitCode = 1;
  }
}

// Run the check if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  checkElectronInstallation();
}

export { checkElectronInstallation };
