import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import { app } from 'electron';
import { appConfig } from './config/app-config';
import { registerEventBusHandlers } from './ipc/event-bus-handlers';
import {
  logStartupInfo,
  setupGlobalErrorHandlers,
  setupIpcErrorHandlers,
  setupSignalHandlers,
  setupWindowErrorHandlers,
} from './lib/error-handlers';
import { logger } from './lib/logger';
import { AppService, FileService, WindowService } from './services';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isDev = process.argv.some((arg) => arg === '--start-dev');

setupGlobalErrorHandlers();
setupIpcErrorHandlers();
setupSignalHandlers();
logStartupInfo();

// Initialize services directly (no DI container needed)
const windowService = new WindowService();
const fileService = new FileService();
const appService = new AppService(windowService, appConfig);

async function initializeApp(): Promise<void> {
  appService.initialize();
  appService.registerAppHandlers();
  fileService.registerHandlers();
  windowService.registerWindowHandlers();
  registerEventBusHandlers();

  const preloadPath = path.join(__dirname, '../preload/preload.js');
  const iconPath = path.join(__dirname, '../renderer/assets/images/icon.png');

  const mainWindow = windowService.createMainWindow({
    width: appConfig.mainWindow.width,
    height: appConfig.mainWindow.height,
    minWidth: appConfig.mainWindow.minWidth,
    minHeight: appConfig.mainWindow.minHeight,
    title: appConfig.mainWindow.title,
    preloadPath,
    iconPath,
  });

  setupWindowErrorHandlers(mainWindow);

  if (!isDev) {
    const startUrl = path.join(__dirname, '../dist/index.html');
    await mainWindow.loadFile(startUrl);
  } else {
    const devUrl = process.env.ELECTRON_START_URL || 'http://localhost:35703';
    logger.info('Loading dev URL:', devUrl);
    await mainWindow.loadURL(devUrl);
    logger.info('Successfully loaded URL');
  }

  appService.handleWindowAllClosed(() => {
    app.quit();
  });

  appService.handleActivate(() => {
    if (!windowService.getMainWindow()) {
      initializeApp();
    }
  });
}

logger.info('Application starting...', { isDev });

app.disableHardwareAcceleration();

app.on('ready', async () => {
  await initializeApp();
});

app.on('before-quit', () => {
  logger.info('Application shutting down...');
});
