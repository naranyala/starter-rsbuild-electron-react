import { BrowserWindow, ipcMain } from 'electron';
import { eventBus } from '../lib/EventBus';
import { logger } from '../lib/logger';

interface IpcEventPayload {
  event: string;
  data?: unknown;
}

export function registerEventBusHandlers(): void {
  ipcMain.handle('event:subscribe', async (_event, { event: eventName }: { event: string }) => {
    return { success: true };
  });

  ipcMain.handle('event:unsubscribe', async (_event, { event: eventName }: { event: string }) => {
    return { success: true };
  });

  ipcMain.handle('event:emit', async (_event, payload: IpcEventPayload) => {
    const { event: eventName, data } = payload;
    eventBus.emit(eventName, data);
    return { success: true };
  });

  ipcMain.handle(
    'event:emit-to-renderer',
    async (
      _event,
      { windowId, event: eventName, data }: { windowId?: number; event: string; data?: unknown }
    ) => {
      if (windowId) {
        const win = BrowserWindow.fromId(windowId);
        if (win && !win.isDestroyed()) {
          win.webContents.send('event:received', { event: eventName, data });
        }
      } else {
        BrowserWindow.getAllWindows().forEach((win) => {
          if (!win.isDestroyed()) {
            win.webContents.send('event:received', { event: eventName, data });
          }
        });
      }
      return { success: true };
    }
  );

  logger.info('[EventBus] IPC handlers registered');
}
