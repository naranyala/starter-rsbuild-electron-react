import * as fs from 'node:fs/promises';
import { ipcMain } from 'electron';
import { err, fromTryAsync, isOk, ok, type Result } from '../../shared/lib/result';
import { logger } from '../lib/logger';

export interface FileStats {
  size: number;
  created: Date;
  modified: Date;
  isFile: boolean;
  isDirectory: boolean;
}

export type FileResult<T> = Result<T, FileError>;

export class FileError extends Error {
  constructor(
    message: string,
    public code: string,
    public path?: string
  ) {
    super(message);
    this.name = 'FileError';
  }
}

function toFileError(e: unknown, message: string, path?: string): FileError {
  const error = e instanceof Error ? e : new Error(String(e));
  return new FileError(`${message}: ${error.message}`, error.name || 'UNKNOWN', path);
}

export class FileService {
  async writeFile(filePath: string, data: string): Promise<FileResult<void>> {
    const result = await fromTryAsync(async () => {
      await fs.writeFile(filePath, data, 'utf-8');
      logger.debug(`File written: ${filePath}`);
    });

    if (isOk(result)) {
      return ok(undefined);
    }
    logger.error(`Failed to write file: ${filePath}`, { error: result.error });
    return err(toFileError(result.error, 'Write failed', filePath));
  }

  async readFile(filePath: string): Promise<FileResult<string>> {
    const result = await fromTryAsync(async () => {
      return await fs.readFile(filePath, 'utf-8');
    });

    if (isOk(result)) {
      return ok(result.value);
    }
    logger.error(`Failed to read file: ${filePath}`, { error: result.error });
    return err(toFileError(result.error, 'Read failed', filePath));
  }

  async deleteFile(filePath: string): Promise<FileResult<void>> {
    const result = await fromTryAsync(async () => {
      await fs.unlink(filePath);
      logger.debug(`File deleted: ${filePath}`);
    });

    if (isOk(result)) {
      return ok(undefined);
    }
    logger.error(`Failed to delete file: ${filePath}`, { error: result.error });
    return err(toFileError(result.error, 'Delete failed', filePath));
  }

  async listFiles(dirPath: string): Promise<FileResult<string[]>> {
    const result = await fromTryAsync(async () => {
      return await fs.readdir(dirPath);
    });

    if (isOk(result)) {
      return ok(result.value);
    }
    logger.error(`Failed to list files: ${dirPath}`, { error: result.error });
    return err(toFileError(result.error, 'List failed', dirPath));
  }

  async getFileStats(filePath: string): Promise<FileResult<FileStats>> {
    const result = await fromTryAsync(async () => {
      const stats = await fs.stat(filePath);
      return {
        size: stats.size,
        created: stats.birthtime,
        modified: stats.mtime,
        isFile: stats.isFile(),
        isDirectory: stats.isDirectory(),
      };
    });

    if (isOk(result)) {
      return ok(result.value);
    }
    logger.error(`Failed to get file stats: ${filePath}`, { error: result.error });
    return err(toFileError(result.error, 'Stats failed', filePath));
  }

  async fileExists(filePath: string): Promise<Result<boolean, FileError>> {
    const result = await fromTryAsync(async () => {
      await fs.access(filePath);
      return true;
    });

    if (isOk(result)) {
      return ok(result.value);
    }
    return ok(false);
  }

  registerHandlers(): void {
    ipcMain.handle('fs:write-file', async (_event, { filePath, data }) => {
      const result = await this.writeFile(filePath, data);
      return result.ok
        ? { success: true, data: result.value }
        : { success: false, error: result.error.message, code: result.error.code };
    });

    ipcMain.handle('fs:read-file', async (_event, { filePath }) => {
      const result = await this.readFile(filePath);
      return result.ok
        ? { success: true, data: result.value }
        : { success: false, error: result.error.message, code: result.error.code };
    });

    ipcMain.handle('fs:delete-file', async (_event, { filePath }) => {
      const result = await this.deleteFile(filePath);
      return result.ok
        ? { success: true }
        : { success: false, error: result.error.message, code: result.error.code };
    });

    ipcMain.handle('fs:list-files', async (_event, { dirPath }) => {
      const result = await this.listFiles(dirPath);
      return result.ok
        ? { success: true, data: result.value }
        : { success: false, error: result.error.message, code: result.error.code };
    });

    ipcMain.handle('fs:get-file-stats', async (_event, { filePath }) => {
      const result = await this.getFileStats(filePath);
      return result.ok
        ? { success: true, data: result.value }
        : { success: false, error: result.error.message, code: result.error.code };
    });

    ipcMain.handle('fs:file-exists', async (_event, { filePath }) => {
      const result = await this.fileExists(filePath);
      return result.ok
        ? { success: true, data: result.value }
        : { success: false, error: result.error.message, code: result.error.code };
    });

    logger.info('FileService handlers registered');
  }
}
