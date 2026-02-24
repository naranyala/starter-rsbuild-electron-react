import * as path from 'node:path';
import { app, BrowserWindow, IpcMainInvokeEvent, ipcMain, shell } from 'electron';
import { getContainer, TYPES } from '../lib/container';
import { logger } from '../lib/logger';

export class WindowService {
  private windows = new Map<string, BrowserWindow>();
  private mainWindow: BrowserWindow | null = null;

  createMainWindow(options: {
    width: number;
    height: number;
    minWidth: number;
    minHeight: number;
    title: string;
    preloadPath: string;
    iconPath: string;
  }): BrowserWindow {
    this.mainWindow = new BrowserWindow({
      width: options.width,
      height: options.height,
      minWidth: options.minWidth,
      minHeight: options.minHeight,
      title: options.title,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        webSecurity: true,
        preload: options.preloadPath,
        sandbox: false,
        allowRunningInsecureContent: false,
      },
      icon: options.iconPath,
    });

    this.setupWindowHandlers(this.mainWindow);
    return this.mainWindow;
  }

  getMainWindow(): BrowserWindow | null {
    return this.mainWindow;
  }

  private setupWindowHandlers(window: BrowserWindow): void {
    window.on('closed', () => {
      if (window === this.mainWindow) {
        this.mainWindow = null;
      }
      this.windows.forEach((w, id) => {
        if (w === window) this.windows.delete(id);
      });
    });

    window.webContents.setWindowOpenHandler((details) => {
      void shell.openExternal(details.url);
      return { action: 'deny' };
    });
  }

  registerWindowHandlers(): void {
    ipcMain.handle('window:create', async (event, { id, config }) => {
      const parent = BrowserWindow.fromWebContents(event.sender);
      const win = new BrowserWindow({
        ...config,
        parent: parent || undefined,
        webPreferences: {
          nodeIntegration: false,
          contextIsolation: true,
          preload: path.join(__dirname, '../preload/preload.js'),
        },
      });
      this.windows.set(id, win);
      return { success: true };
    });

    ipcMain.handle('window:close', async (_event, { id }) => {
      const win = this.windows.get(id);
      if (win) {
        win.close();
        this.windows.delete(id);
      }
      return { success: true };
    });

    ipcMain.handle('window:focus', async (_event, { id }) => {
      const win = this.windows.get(id);
      if (win) win.focus();
      return { success: true };
    });

    ipcMain.handle('window:minimize', async (_event, { id }) => {
      const win = this.windows.get(id);
      if (win) win.minimize();
      return { success: true };
    });

    ipcMain.handle('window:maximize', async (_event, { id }) => {
      const win = this.windows.get(id);
      if (win) {
        if (win.isMaximized()) {
          win.unmaximize();
        } else {
          win.maximize();
        }
      }
      return { success: true };
    });

    ipcMain.handle('window:toggle-fullscreen', async (_event, { id }) => {
      const win = this.windows.get(id);
      if (win) win.setFullScreen(!win.isFullScreen());
      return { success: true };
    });
  }
}
