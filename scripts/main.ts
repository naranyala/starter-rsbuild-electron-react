#!/usr/bin/env node

import { buildIcons } from './build-icons';
import { checkElectronInstallation } from './check-electron';
import { startDevServer } from './start-dev-rsbuild';
import { ErrorHandler } from './utils/error-handler';
import { Logger, LogLevel } from './utils/logger';

/**
 * Main script entry point that handles different commands
 */

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const command = args[0];

  // Set log level based on environment
  if (process.env.NODE_ENV === 'development' || args.includes('--verbose')) {
    Logger.setLevel(LogLevel.DEBUG);
  }

  try {
    switch (command) {
      case 'build-icons':
        await buildIcons();
        break;

      case 'start-dev-rsbuild':
        await startDevServer();
        break;

      case 'check-electron':
        await checkElectronInstallation();
        break;

      case '--help':
      case '-h':
        showHelp();
        break;

      default:
        Logger.error(`Unknown command: ${command}`);
        showHelp();
        process.exit(1);
    }
  } catch (error) {
    ErrorHandler.handleError(error, `script-${command || 'unknown'}`);
    process.exit(1);
  }
}

function showHelp(): void {
  console.log(`
Usage: node scripts/main.js <command>

Commands:
  build-icons         Build/copy icon files to dist directory
  start-dev-rsbuild   Start development server with rsbuild and electron
  check-electron      Check if Electron is properly installed
  --help, -h          Show this help message

Options:
  --verbose           Enable verbose logging
  `);
}

// Run the main function if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { main };
