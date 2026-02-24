import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { IpcMainInvokeEvent, ipcMain } from 'electron';
import { logger } from '../lib/logger';

export interface FileStats {
  size: number;
  created: Date;
  modified: Date;
  isFile: boolean;
  isDirectory: boolean;
}

export class FileService {
  async writeFile(filePath: string, data: string): Promise<{ success: boolean; error?: string }> {
    try {
      await fs.writeFile(filePath, data, 'utf-8');
      logger.debug(`File written: ${filePath}`);
      return { success: true };
    } catch (error) {
      logger.error(`Failed to write file: ${filePath}`, { error });
      return { success: false, error: String(error) };
    }
  }

  async readFile(filePath: string): Promise<{ success: boolean; data?: string; error?: string }> {
    try {
      const data = await fs.readFile(filePath, 'utf-8');
      return { success: true, data };
    } catch (error) {
      logger.error(`Failed to read file: ${filePath}`, { error });
      return { success: false, error: String(error) };
    }
  }

  async deleteFile(filePath: string): Promise<{ success: boolean; error?: string }> {
    try {
      await fs.unlink(filePath);
      logger.debug(`File deleted: ${filePath}`);
      return { success: true };
    } catch (error) {
      logger.error(`Failed to delete file: ${filePath}`, { error });
      return { success: false, error: String(error) };
    }
  }

  async listFiles(
    dirPath: string
  ): Promise<{ success: boolean; files?: string[]; error?: string }> {
    try {
      const files = await fs.readdir(dirPath);
      return { success: true, files };
    } catch (error) {
      logger.error(`Failed to list files: ${dirPath}`, { error });
      return { success: false, error: String(error) };
    }
  }

  async getFileStats(
    filePath: string
  ): Promise<{ success: boolean; stats?: FileStats; error?: string }> {
    try {
      const stats = await fs.stat(filePath);
      return {
        success: true,
        stats: {
          size: stats.size,
          created: stats.birthtime,
          modified: stats.mtime,
          isFile: stats.isFile(),
          isDirectory: stats.isDirectory(),
        },
      };
    } catch (error) {
      logger.error(`Failed to get file stats: ${filePath}`, { error });
      return { success: false, error: String(error) };
    }
  }

  async fileExists(filePath: string): Promise<boolean> {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  registerHandlers(): void {
    ipcMain.handle('fs:write-file', async (_event, { filePath, data }) => {
      return this.writeFile(filePath, data);
    });

    ipcMain.handle('fs:read-file', async (_event, { filePath }) => {
      return this.readFile(filePath);
    });

    ipcMain.handle('fs:delete-file', async (_event, { filePath }) => {
      return this.deleteFile(filePath);
    });

    ipcMain.handle('fs:list-files', async (_event, { dirPath }) => {
      return this.listFiles(dirPath);
    });

    ipcMain.handle('fs:get-file-stats', async (_event, { filePath }) => {
      return this.getFileStats(filePath);
    });

    ipcMain.handle('fs:file-exists', async (_event, { filePath }) => {
      return this.fileExists(filePath);
    });

    logger.info('FileService handlers registered');
  }
}
