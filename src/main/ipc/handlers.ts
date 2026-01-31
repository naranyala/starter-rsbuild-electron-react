import { app, ipcMain } from 'electron';
import {
  deleteFile,
  ensureDir,
  fileExists,
  getFileStats,
  listFiles,
  readFile,
  writeFile,
} from '../utils/fs-utils';
import { WindowManager } from '../windows/window-manager';

/**
 * Register all IPC handlers for communication between main and renderer processes
 */

export function registerIpcHandlers(): void {
  // File system operations
  ipcMain.handle('fs:write-file', async (event, { filePath, data }) => {
    try {
      await ensureDir(require('path').dirname(filePath));
      await writeFile(filePath, data);
      return { success: true, data: null };
    } catch (error) {
      console.error('Error writing file:', error);
      return { success: false, error: (error as Error).message };
    }
  });

  ipcMain.handle('fs:read-file', async (event, { filePath }) => {
    try {
      const data = await readFile(filePath);
      return { success: true, data };
    } catch (error) {
      console.error('Error reading file:', error);
      return { success: false, error: (error as Error).message };
    }
  });

  ipcMain.handle('fs:file-exists', async (event, { filePath }) => {
    try {
      const exists = await fileExists(filePath);
      return { success: true, data: exists };
    } catch (error) {
      console.error('Error checking file existence:', error);
      return { success: false, error: (error as Error).message };
    }
  });

  ipcMain.handle('fs:delete-file', async (event, { filePath }) => {
    try {
      await deleteFile(filePath);
      return { success: true, data: null };
    } catch (error) {
      console.error('Error deleting file:', error);
      return { success: false, error: (error as Error).message };
    }
  });

  ipcMain.handle('fs:list-files', async (event, { dirPath }) => {
    try {
      const files = await listFiles(dirPath);
      return { success: true, data: files };
    } catch (error) {
      console.error('Error listing files:', error);
      return { success: false, error: (error as Error).message };
    }
  });

  ipcMain.handle('fs:get-file-stats', async (event, { filePath }) => {
    try {
      const stats = await getFileStats(filePath);
      return { success: true, data: stats };
    } catch (error) {
      console.error('Error getting file stats:', error);
      return { success: false, error: (error as Error).message };
    }
  });

  // Window operations
  ipcMain.handle('window:create', async (event, { id, config }) => {
    try {
      const isDev = process.argv.some((arg) => arg === '--start-dev');
      WindowManager.createWindow(id, config, isDev);
      return { success: true, data: null };
    } catch (error) {
      console.error('Error creating window:', error);
      return { success: false, error: (error as Error).message };
    }
  });

  ipcMain.handle('window:close', async (event, { id }) => {
    try {
      const result = WindowManager.closeWindow(id);
      return { success: true, data: result };
    } catch (error) {
      console.error('Error closing window:', error);
      return { success: false, error: (error as Error).message };
    }
  });

  ipcMain.handle('window:focus', async (event, { id }) => {
    try {
      const result = WindowManager.focusWindow(id);
      return { success: true, data: result };
    } catch (error) {
      console.error('Error focusing window:', error);
      return { success: false, error: (error as Error).message };
    }
  });

  ipcMain.handle('window:minimize', async (event, { id }) => {
    try {
      const result = WindowManager.minimizeWindow(id);
      return { success: true, data: result };
    } catch (error) {
      console.error('Error minimizing window:', error);
      return { success: false, error: (error as Error).message };
    }
  });

  ipcMain.handle('window:maximize', async (event, { id }) => {
    try {
      const result = WindowManager.maximizeWindow(id);
      return { success: true, data: result };
    } catch (error) {
      console.error('Error maximizing window:', error);
      return { success: false, error: (error as Error).message };
    }
  });

  ipcMain.handle('window:toggle-fullscreen', async (event, { id }) => {
    try {
      const result = WindowManager.toggleFullscreen(id);
      return { success: true, data: result };
    } catch (error) {
      console.error('Error toggling fullscreen:', error);
      return { success: false, error: (error as Error).message };
    }
  });

  // App operations
  ipcMain.handle('app:quit', async (event) => {
    try {
      app.quit();
      return { success: true, data: null };
    } catch (error) {
      console.error('Error quitting app:', error);
      return { success: false, error: (error as Error).message };
    }
  });

  ipcMain.handle('app:relaunch', async (event) => {
    try {
      app.relaunch();
      app.exit(0);
      return { success: true, data: null };
    } catch (error) {
      console.error('Error relaunching app:', error);
      return { success: false, error: (error as Error).message };
    }
  });

  ipcMain.handle('app:hide', async (event) => {
    try {
      app.hide();
      return { success: true, data: null };
    } catch (error) {
      console.error('Error hiding app:', error);
      return { success: false, error: (error as Error).message };
    }
  });

  ipcMain.handle('app:show', async (event) => {
    try {
      app.show();
      return { success: true, data: null };
    } catch (error) {
      console.error('Error showing app:', error);
      return { success: false, error: (error as Error).message };
    }
  });

  ipcMain.handle('app:get-path', async (event, { name }) => {
    try {
      const path = app.getPath(name);
      return { success: true, data: path };
    } catch (error) {
      console.error('Error getting app path:', error);
      return { success: false, error: (error as Error).message };
    }
  });
}
