import { app } from 'electron';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Utility functions for file system operations in the main process
 */

/**
 * Get the user data directory path
 */
export function getUserDataPath(): string {
  return app.getPath('userData');
}

/**
 * Get the application data directory path
 */
export function getAppDataPath(): string {
  return app.getPath('appData');
}

/**
 * Get the home directory path
 */
export function getHomePath(): string {
  return app.getPath('home');
}

/**
 * Ensure a directory exists, creating it if necessary
 */
export async function ensureDir(dirPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    fs.mkdir(dirPath, { recursive: true }, (err) => {
      if (err && err.code !== 'EEXIST') {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

/**
 * Write data to a file
 */
export async function writeFile(filePath: string, data: string | Buffer): Promise<void> {
  const dir = path.dirname(filePath);
  await ensureDir(dir);

  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, data, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

/**
 * Read data from a file
 */
export async function readFile(filePath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

/**
 * Check if a file exists
 */
export async function fileExists(filePath: string): Promise<boolean> {
  return new Promise((resolve) => {
    fs.access(filePath, fs.constants.F_OK, (err) => {
      resolve(!err);
    });
  });
}

/**
 * Delete a file
 */
export async function deleteFile(filePath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    fs.unlink(filePath, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

/**
 * List files in a directory
 */
export async function listFiles(dirPath: string): Promise<string[]> {
  return new Promise((resolve, reject) => {
    fs.readdir(dirPath, (err, files) => {
      if (err) {
        reject(err);
      } else {
        resolve(files);
      }
    });
  });
}

/**
 * Get file stats
 */
export async function getFileStats(filePath: string): Promise<fs.Stats> {
  return new Promise((resolve, reject) => {
    fs.stat(filePath, (err, stats) => {
      if (err) {
        reject(err);
      } else {
        resolve(stats);
      }
    });
  });
}
