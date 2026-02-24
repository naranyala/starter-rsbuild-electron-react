import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import { app } from 'electron';
import { appConfig } from './config/app-config';
import { Container, getContainer, setContainer } from './lib/container';
import { logger } from './lib/logger';
import { TYPES } from './lib/tokens';
import { AppService, FileService, WindowService } from './services';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isDev = process.argv.some((arg) => arg === '--start-dev');

function setupContainer(): Container {
  const container = new Container();
  setContainer(container);

  const windowService = new WindowService();
  const fileService = new FileService();
  const appService = new AppService(windowService, appConfig);

  container.registerInstance<WindowService>(TYPES.WINDOW_SERVICE, windowService);
  container.registerInstance<FileService>(TYPES.FILE_SERVICE, fileService);
  container.registerInstance<AppService>(TYPES.APP_SERVICE, appService);
  container.registerInstance(TYPES.LOGGER, logger);

  return container;
}

async function initializeApp(): Promise<void> {
  const container = getContainer();
  const windowService = container.resolve<WindowService>(TYPES.WINDOW_SERVICE);
  const fileService = container.resolve<FileService>(TYPES.FILE_SERVICE);
  const appService = container.resolve<AppService>(TYPES.APP_SERVICE);

  appService.initialize();
  appService.registerAppHandlers();
  fileService.registerHandlers();
  windowService.registerWindowHandlers();

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

  if (!isDev) {
    const startUrl = path.join(__dirname, '../dist/index.html');
    await mainWindow.loadFile(startUrl);
  } else {
    const devUrl = process.env.ELECTRON_START_URL || 'http://localhost:35703';
    logger.info('Loading dev URL:', devUrl);
    try {
      await mainWindow.loadURL(devUrl);
      logger.info('Successfully loaded URL');
    } catch (error) {
      logger.error('Failed to load URL:', error);
      throw error;
    }
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
  setupContainer();
  await initializeApp();
});

app.on('before-quit', () => {
  logger.info('Application shutting down...');
});
