import { app, ipcMain } from 'electron';
import { logger } from '../lib/logger';
import type { WindowService } from './WindowService';

export interface AppConfig {
  mainWindow: {
    width: number;
    height: number;
    minWidth: number;
    minHeight: number;
    title: string;
  };
}

export class AppService {
  private windowService: WindowService;
  private config: AppConfig;

  constructor(windowService: WindowService, config: AppConfig) {
    this.windowService = windowService;
    this.config = config;
  }

  initialize(): void {
    logger.info('Application initializing...', { platform: process.platform });
  }

  registerAppHandlers(): void {
    ipcMain.handle('app:quit', async () => {
      app.quit();
      return { success: true };
    });

    ipcMain.handle('app:relaunch', async () => {
      app.relaunch();
      app.exit(0);
      return { success: true };
    });

    ipcMain.handle('app:hide', async () => {
      app.hide();
      return { success: true };
    });

    ipcMain.handle('app:show', async () => {
      app.show();
      return { success: true };
    });

    ipcMain.handle('app:get-path', async (_event, { name }) => {
      const validNames = [
        'home',
        'appData',
        'userData',
        'temp',
        'exe',
        'desktop',
        'documents',
        'downloads',
        'music',
        'pictures',
        'videos',
      ];
      if (!validNames.includes(name)) {
        return { success: false, error: 'Invalid path name' };
      }
      return { success: true, path: app.getPath(name as any) };
    });

    logger.info('App handlers registered');
  }

  handleReady(onReady: () => void): void {
    app.on('ready', () => {
      logger.info('App ready');
      onReady();
    });
  }

  handleWindowAllClosed(callback: () => void): void {
    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        callback();
      }
    });
  }

  handleActivate(callback: () => void): void {
    app.on('activate', callback);
  }

  handleBeforeQuit(callback: () => void): void {
    app.on('before-quit', callback);
  }
}
