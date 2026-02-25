import { app, BrowserWindow, dialog, IpcMainEvent, ipcMain } from 'electron';
import { logger } from './logger';

let isShuttingDown = false;

export function setupGlobalErrorHandlers(): void {
  process.on('uncaughtException', (error: Error) => {
    logger.error('Uncaught Exception:', error.message);
    logger.error('Stack:', error.stack);

    if (!isShuttingDown) {
      dialog.showErrorBox('Unexpected Error', `An unexpected error occurred: ${error.message}`);
    }
  });

  process.on('unhandledRejection', (reason: unknown, promise: Promise<unknown>) => {
    const message = reason instanceof Error ? reason.message : String(reason);
    const stack = reason instanceof Error ? reason.stack : undefined;

    logger.error('Unhandled Promise Rejection:', message);
    if (stack) {
      logger.error('Stack:', stack);
    }
    logger.error('Promise:', promise);
  });

  process.on('warning', (warning: Error) => {
    logger.warn('Process Warning:', warning.name, warning.message);
  });

  ipcMain.on('uncaught-error', (event, error: { message: string; stack?: string }) => {
    logger.error('Renderer Uncaught Error:', error.message);
    if (error.stack) {
      logger.error('Renderer Stack:', error.stack);
    }
  });

  ipcMain.on('unhandled-rejection', (event, data: { reason: string; stack?: string }) => {
    logger.error('Renderer Unhandled Rejection:', data.reason);
    if (data.stack) {
      logger.error('Renderer Stack:', data.stack);
    }
  });

  logger.info('Global error handlers registered');
}

export function setupWindowErrorHandlers(mainWindow: BrowserWindow): void {
  mainWindow.webContents.on('render-process-gone', (event, details) => {
    logger.error('Renderer process gone:', details.reason);
    logger.error('Exit code:', details.exitCode);

    dialog.showErrorBox('Renderer Crashed', `The application crashed: ${details.reason}`);
  });

  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    logger.error('Failed to load:', errorCode, errorDescription);
  });

  mainWindow.webContents.on('console-message', (event, level, message, line, sourceId) => {
    const levels = ['debug', 'info', 'warn', 'error'];
    const levelName = levels[level] || 'unknown';

    if (level >= 3) {
      logger.error(`[Renderer ${levelName}]`, message, 'at line', line, 'in', sourceId);
    } else if (level >= 2) {
      logger.warn(`[Renderer ${levelName}]`, message, 'at line', line, 'in', sourceId);
    } else {
      logger.log(
        levelName as 'debug' | 'info' | 'warn' | 'error',
        `[Renderer ${levelName}]`,
        message
      );
    }
  });

  mainWindow.webContents.on('page-favicon-updated', (event, favicons) => {
    logger.debug('Favicon updated:', favicons);
  });
}

export function setupIpcErrorHandlers(): void {
  ipcMain.on('log-error', (event, data: { message: string; stack?: string; source?: string }) => {
    logger.error(`[Renderer:${data.source || 'unknown'}]`, data.message);
    if (data.stack) {
      logger.error('Stack:', data.stack);
    }
  });

  ipcMain.on('log-warn', (event, data: { message: string; source?: string }) => {
    logger.warn(`[Renderer:${data.source || 'unknown'}]`, data.message);
  });

  ipcMain.on('log-info', (event, data: { message: string; source?: string }) => {
    logger.info(`[Renderer:${data.source || 'unknown'}]`, data.message);
  });

  logger.info('IPC error handlers registered');
}

export function setupSignalHandlers(): void {
  const shutdown = (signal: string) => {
    if (isShuttingDown) return;
    isShuttingDown = true;

    logger.warn(`Received ${signal}, shutting down gracefully...`);

    const windows = BrowserWindow.getAllWindows();
    windows.forEach((win) => {
      if (!win.isDestroyed()) {
        win.destroy();
      }
    });

    app.quit();
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));

  logger.info('Signal handlers registered');
}

export function logStartupInfo(): void {
  logger.info('='.repeat(50));
  logger.info('Application Starting');
  logger.info('='.repeat(50));
  logger.info('Version:', app.getVersion());
  logger.info('Electron:', process.versions.electron);
  logger.info('Chrome:', process.versions.chrome);
  logger.info('Node:', process.versions.node);
  logger.info('Platform:', process.platform);
  logger.info('Arch:', process.arch);
  logger.info('='.repeat(50));
}
