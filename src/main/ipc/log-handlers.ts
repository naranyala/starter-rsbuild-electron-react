import { ipcMain } from 'electron';
import { logger } from '../lib/logger';

export interface LogEntry {
  level: 'debug' | 'info' | 'warn' | 'error';
  message: string;
  context?: Record<string, unknown>;
  timestamp?: string;
}

export function registerLogHandlers(): void {
  ipcMain.handle('log:write', async (_event, entry: LogEntry) => {
    const { level, message, context, timestamp } = entry;

    const logMessage = context ? `${message} ${JSON.stringify(context)}` : message;

    logger.log(level, `[Renderer] ${logMessage}`);

    if (timestamp) {
      logger.debug(`Renderer timestamp: ${timestamp}`);
    }

    return { success: true };
  });

  ipcMain.handle('log:getPath', async () => {
    return { path: logger.getLogPath() };
  });
}
