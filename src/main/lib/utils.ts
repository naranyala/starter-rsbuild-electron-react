/**
 * Main process utilities for Electron applications
 * Simplified utility module for system operations
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import { app } from 'electron';

const execAsync = promisify(exec);

/**
 * System utilities
 */
export const SystemUtils = {
  getPlatform: () => process.platform,

  getNodeVersion: () => process.version,

  getElectronVersion: () => process.versions.electron || 'N/A',

  getUptime: () => process.uptime(),

  getPlatformName(): string {
    const platforms: Record<string, string> = {
      win32: 'Windows',
      darwin: 'macOS',
      linux: 'Linux',
    };
    return platforms[process.platform] || process.platform;
  },

  getCpuInfo() {
    const os = require('node:os') as typeof import('node:os');
    return {
      arch: process.arch,
      cpus: os.cpus().length,
      model: os.cpus()[0]?.model || 'Unknown',
    };
  },

  async execCommand(
    command: string,
    options?: { timeout?: number }
  ): Promise<{ stdout: string; stderr: string; exitCode: number | null }> {
    try {
      const { exec } = await import('node:child_process');
      const { promisify } = await import('node:util');
      const execAsync = promisify(exec);
      const { stdout, stderr } = await execAsync(command, { timeout: options?.timeout || 30000 });
      return { stdout, stderr, exitCode: 0 };
    } catch (error: any) {
      return { stdout: '', stderr: error.message, exitCode: error.code || 1 };
    }
  },
};

/**
 * Security utilities
 */
export const SecurityUtils = {
  generateRandomHex(length: number): string {
    return require('node:crypto').randomBytes(length).toString('hex');
  },

  generateRandomBytes(length: number): Buffer {
    return require('node:crypto').randomBytes(length);
  },

  generateUUID(): string {
    return require('node:crypto').randomUUID();
  },

  hash(data: string, algorithm: 'sha256' | 'sha512' | 'md5' = 'sha256'): string {
    return require('node:crypto').createHash(algorithm).update(data).digest('hex');
  },

  createHmac(data: string, key: string, algorithm: 'sha256' | 'sha512' = 'sha256'): string {
    return require('node:crypto').createHmac(algorithm, key).update(data).digest('hex');
  },

  encrypt(data: string, key: string, algorithm = 'aes-256-cbc'): { encrypted: string; iv: string } {
    const crypto = require('node:crypto');
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, Buffer.from(key.padEnd(32, '0').slice(0, 32)), iv);
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return { encrypted, iv: iv.toString('hex') };
  },

  decrypt(encryptedData: string, key: string, iv: string, algorithm = 'aes-256-cbc'): string {
    const crypto = require('node:crypto');
    const decipher = crypto.createDecipheriv(
      algorithm,
      Buffer.from(key.padEnd(32, '0').slice(0, 32)),
      Buffer.from(iv, 'hex')
    );
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  },

  validatePath(filePath: string): { isValid: boolean; issues: string[] } {
    const issues: string[] = [];

    if (!filePath || typeof filePath !== 'string') {
      issues.push('Path must be a non-empty string');
      return { isValid: false, issues };
    }

    if (filePath.includes('..')) {
      issues.push('Path traversal detected');
    }

    if (filePath.startsWith('/') && filePath.length > 1 && !filePath.startsWith('/home/') && !filePath.startsWith('/Users/')) {
      issues.push('Absolute path to system directory not allowed');
    }

    return { isValid: issues.length === 0, issues };
  },
};

/**
 * File system utilities
 */
export const FileSystemUtils = {
  getUserDataPath: () => app.getPath('userData'),
  getAppDataPath: () => app.getPath('appData'),
  getHomePath: () => app.getPath('home'),
  getDocumentsPath: () => app.getPath('documents'),
  getDownloadsPath: () => app.getPath('downloads'),
  getDesktopPath: () => app.getPath('desktop'),
  getTempPath: () => app.getPath('temp'),
  getExecutablePath: () => app.getPath('exe'),

  async ensureDirectory(dirPath: string): Promise<void> {
    await fs.promises.mkdir(dirPath, { recursive: true });
  },

  async writeFile(filePath: string, data: string | Buffer, encoding?: BufferEncoding): Promise<void> {
    const dir = path.dirname(filePath);
    await this.ensureDirectory(dir);
    await fs.promises.writeFile(filePath, data, encoding);
  },

  async readFile(filePath: string, encoding: BufferEncoding = 'utf8'): Promise<string | Buffer> {
    return fs.promises.readFile(filePath, encoding);
  },

  async fileExists(filePath: string): Promise<boolean> {
    try {
      await fs.promises.access(filePath, fs.constants.F_OK);
      return true;
    } catch {
      return false;
    }
  },

  async dirExists(dirPath: string): Promise<boolean> {
    try {
      const stats = await fs.promises.stat(dirPath);
      return stats.isDirectory();
    } catch {
      return false;
    }
  },

  async removeFile(filePath: string): Promise<void> {
    await fs.promises.unlink(filePath);
  },

  async removeDirectory(dirPath: string): Promise<void> {
    await fs.promises.rm(dirPath, { recursive: true, force: true });
  },

  async listDirectory(dirPath: string, options: { recursive?: boolean; includeDirectories?: boolean; filter?: RegExp } = {}): Promise<string[]> {
    const entries: string[] = [];
    const { recursive = false, includeDirectories = false, filter } = options;

    async function scan(dir: string) {
      const items = await fs.promises.readdir(dir, { withFileTypes: true });
      for (const item of items) {
        const fullPath = path.join(dir, item.name);
        if (filter && !filter.test(item.name)) continue;

        if (item.isDirectory()) {
          if (includeDirectories) entries.push(fullPath);
          if (recursive) await scan(fullPath);
        } else {
          entries.push(fullPath);
        }
      }
    }

    await scan(dirPath);
    return entries;
  },

  async getFileStats(filePath: string): Promise<fs.Stats> {
    return fs.promises.stat(filePath);
  },

  async copyFile(sourcePath: string, destPath: string): Promise<void> {
    await fs.promises.copyFile(sourcePath, destPath);
  },

  getFileName(filePath: string): string {
    return path.basename(filePath);
  },

  getFileExtension(filePath: string): string {
    return path.extname(filePath).slice(1);
  },
};

/**
 * Performance utilities
 */
export const PerformanceUtils = {
  getMemoryUsage(): NodeJS.MemoryUsage {
    return process.memoryUsage();
  },

  async getCpuUsage(): Promise<{ user: number; system: number }> {
    const os = require('node:os') as typeof import('node:os');
    const cpus = os.cpus();
    const totalIdle = cpus.reduce((acc, cpu) => acc + cpu.times.idle, 0);
    const total = cpus.reduce((acc, cpu) => acc + Object.values(cpu.times).reduce((a, b) => a + b, 0), 0);
    const usage = 1 - totalIdle / total;
    return { user: usage * 100, system: 0 };
  },

  async measureTime<T>(fn: () => Promise<T> | T, label?: string): Promise<{ result: T; duration: number }> {
    const start = performance.now();
    const result = await fn();
    const duration = performance.now() - start;
    if (label) console.log(`[${label}] ${duration.toFixed(2)}ms`);
    return { result, duration };
  },

  startTimer(label?: string): () => number {
    const start = performance.now();
    return () => {
      const duration = performance.now() - start;
      if (label) console.log(`[${label || 'Timer'}] ${duration.toFixed(2)}ms`);
      return duration;
    };
  },

  createMonitor(intervalMs = 1000) {
    let running = false;
    let interval: NodeJS.Timeout | null = null;
    let lastStats: { memory: NodeJS.MemoryUsage; uptime: number } | null = null;

    const collect = () => {
      lastStats = {
        memory: process.memoryUsage(),
        uptime: process.uptime(),
      };
    };

    return {
      start: () => {
        if (!running) {
          running = true;
          collect();
          interval = setInterval(collect, intervalMs);
        }
      },
      stop: () => {
        if (interval) {
          clearInterval(interval);
          interval = null;
          running = false;
        }
      },
      getStats: () => lastStats || { memory: process.memoryUsage(), uptime: process.uptime() },
    };
  },
};

/**
 * Logging utilities
 */
export const LogUtils = {
  levels: ['debug', 'info', 'warn', 'error'] as const,

  log(level: 'debug' | 'info' | 'warn' | 'error', message: string, context?: Record<string, unknown>) {
    const timestamp = new Date().toISOString();
    const ctx = context ? ` ${JSON.stringify(context)}` : '';
    console.log(`[${timestamp}] [${level.toUpperCase()}] ${message}${ctx}`);
  },

  debug(message: string, context?: Record<string, unknown>) {
    const timestamp = new Date().toISOString();
    const ctx = context ? ` ${JSON.stringify(context)}` : '';
    console.log(`[${timestamp}] [DEBUG] ${message}${ctx}`);
  },

  info(message: string, context?: Record<string, unknown>) {
    const timestamp = new Date().toISOString();
    const ctx = context ? ` ${JSON.stringify(context)}` : '';
    console.log(`[${timestamp}] [INFO] ${message}${ctx}`);
  },

  warn(message: string, context?: Record<string, unknown>) {
    const timestamp = new Date().toISOString();
    const ctx = context ? ` ${JSON.stringify(context)}` : '';
    console.log(`[${timestamp}] [WARN] ${message}${ctx}`);
  },

  error(message: string, context?: Record<string, unknown>) {
    const timestamp = new Date().toISOString();
    const ctx = context ? ` ${JSON.stringify(context)}` : '';
    console.log(`[${timestamp}] [ERROR] ${message}${ctx}`);
  },
};
