import { BrowserWindow, type IpcMainInvokeEvent, ipcMain } from 'electron';

/**
 * Utility functions for IPC communication between main and renderer processes
 */

interface IpcResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Register an IPC handler with error handling
 */
export function registerIpcHandler<T = any, R = any>(
  channel: string,
  handler: (event: IpcMainInvokeEvent, args: T) => Promise<R> | R
): void {
  ipcMain.handle(channel, async (event, args) => {
    try {
      const result = await handler(event, args);
      return {
        success: true,
        data: result,
      } as IpcResponse<R>;
    } catch (error) {
      console.error(`IPC Handler Error for channel '${channel}':`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      } as IpcResponse;
    }
  });
}

/**
 * Send a message to a specific window
 */
export function sendMessageToWindow<T = any>(
  window: BrowserWindow,
  channel: string,
  payload?: T
): void {
  if (window && !window.isDestroyed()) {
    window.webContents.send(channel, payload);
  }
}

/**
 * Send a message to all windows
 */
export function broadcastMessage<T = any>(channel: string, payload?: T): void {
  BrowserWindow.getAllWindows().forEach((window) => {
    if (!window.isDestroyed()) {
      window.webContents.send(channel, payload);
    }
  });
}

/**
 * Send a message to a specific window by ID
 */
export function sendMessageToWindowById<T = any>(
  windowId: number,
  channel: string,
  payload?: T
): void {
  const window = BrowserWindow.fromId(windowId);
  if (window && !window.isDestroyed()) {
    window.webContents.send(channel, payload);
  }
}

/**
 * Clean up IPC handlers when the app closes
 */
export function cleanupIpcHandlers(): void {
  // Currently, Electron doesn't provide a direct way to remove all handlers
  // But we can log for debugging purposes
  console.log('Cleaning up IPC handlers...');
}
