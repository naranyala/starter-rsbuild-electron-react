/**
 * Enhanced Main Process Utilities for 10x Development
 * Consolidated, enriched utilities for Electron main process
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import { app, dialog, shell } from 'electron';
import { spawn, exec } from 'child_process';
import crypto from 'crypto';
import os from 'os';

/**
 * Enhanced File System Utilities
 */
export namespace FSUtils {
  /**
   * Get common system paths
   */
  export const paths = {
    userData: (): string => app.getPath('userData'),
    appData: (): string => app.getPath('appData'),
    home: (): string => app.getPath('home'),
    documents: (): string => app.getPath('documents'),
    downloads: (): string => app.getPath('downloads'),
    desktop: (): string => app.getPath('desktop'),
    temp: (): string => app.getPath('temp'),
    exe: (): string => app.getPath('exe'),
  };

  /**
   * Async file operations with enhanced error handling
   */
  export async function ensureDir(dirPath: string): Promise<void> {
    try {
      await fs.promises.mkdir(dirPath, { recursive: true });
    } catch (error: any) {
      if (error.code !== 'EEXIST') {
        throw error;
      }
    }
  }

  export async function writeFile(filePath: string, data: string | Buffer): Promise<void> {
    await FSUtils.ensureDir(path.dirname(filePath));
    await fs.promises.writeFile(filePath, data);
  }

  export async function readFile(filePath: string, encoding: BufferEncoding = 'utf8'): Promise<string | Buffer> {
    return fs.promises.readFile(filePath, encoding);
  }

  export async function exists(filePath: string): Promise<boolean> {
    try {
      await fs.promises.access(filePath, fs.constants.F_OK);
      return true;
    } catch {
      return false;
    }
  }

  export async function removeFile(filePath: string): Promise<void> {
    await fs.promises.unlink(filePath);
  }

  export async function removeDir(dirPath: string): Promise<void> {
    await fs.promises.rm(dirPath, { recursive: true, force: true });
  }

  export async function copyFile(src: string, dest: string): Promise<void> {
    await FSUtils.ensureDir(path.dirname(dest));
    await fs.promises.copyFile(src, dest);
  }

  export async function moveFile(src: string, dest: string): Promise<void> {
    await FSUtils.ensureDir(path.dirname(dest));
    await fs.promises.rename(src, dest);
  }

  export async function listDir(dirPath: string, options: {
    recursive?: boolean;
    includeDirs?: boolean;
    filter?: RegExp;
  } = {}): Promise<string[]> {
    const { recursive = false, includeDirs = true, filter } = options;

    if (recursive) {
      const entries: string[] = [];
      const walk = async (currentDir: string): Promise<void> => {
        const items = await fs.promises.readdir(currentDir, { withFileTypes: true });

        for (const item of items) {
          const fullPath = path.join(currentDir, item.name);

          if (item.isDirectory()) {
            if (includeDirs) {
              if (!filter || filter.test(fullPath)) {
                entries.push(fullPath);
              }
            }
            await walk(fullPath);
          } else {
            if (!filter || filter.test(fullPath)) {
              entries.push(fullPath);
            }
          }
        }
      };

      await walk(dirPath);
      return entries;
    } else {
      const items = await fs.promises.readdir(dirPath);
      return items
        .filter(item => includeDirs || !item.endsWith(path.sep))
        .filter(item => !filter || filter.test(path.join(dirPath, item)))
        .map(item => path.join(dirPath, item));
    }
  }

  /**
   * File operations with progress tracking
   */
  export async function copyFileWithProgress(
    src: string, 
    dest: string, 
    onProgress?: (progress: number) => void
  ): Promise<void> {
    await FSUtils.ensureDir(path.dirname(dest));
    
    const stats = await fs.promises.stat(src);
    const totalSize = stats.size;
    let transferred = 0;
    
    return new Promise((resolve, reject) => {
      const readStream = fs.createReadStream(src);
      const writeStream = fs.createWriteStream(dest);
      
      readStream.on('data', (chunk) => {
        transferred += chunk.length;
        if (onProgress) {
          onProgress(transferred / totalSize);
        }
      });
      
      readStream.on('error', reject);
      writeStream.on('error', reject);
      writeStream.on('close', resolve);
      
      readStream.pipe(writeStream);
    });
  }

  /**
   * Calculate file hash
   */
  export async function calculateHash(filePath: string, algorithm: string = 'sha256'): Promise<string> {
    return new Promise((resolve, reject) => {
      const hash = crypto.createHash(algorithm);
      const stream = fs.createReadStream(filePath);
      
      stream.on('data', (data) => hash.update(data));
      stream.on('end', () => resolve(hash.digest('hex')));
      stream.on('error', reject);
    });
  }
}

/**
 * Enhanced System and Process Utilities
 */
export namespace SystemUtils {
  /**
   * System information
   */
  export const info = {
    platform: (): NodeJS.Platform => process.platform,
    arch: (): string => process.arch,
    nodeVersion: (): string => process.version,
    electronVersion: (): string => process.versions.electron || 'N/A',
    chromeVersion: (): string => process.versions.chrome || 'N/A',
    pid: (): number => process.pid,
    uptime: (): number => process.uptime(),
    memoryUsage: (): NodeJS.MemoryUsage => process.memoryUsage(),
    cpuUsage: (): { user: number; system: number } => process.cpuUsage(),
    cwd: (): string => process.cwd(),
    argv: (): string[] => process.argv,
    env: (): NodeJS.ProcessEnv => process.env,
  };

  /**
   * OS information
   */
  export const osInfo = {
    platform: (): string => os.platform(),
    arch: (): string => os.arch(),
    release: (): string => os.release(),
    hostname: (): string => os.hostname(),
    userInfo: () => os.userInfo(),
    totalmem: (): number => os.totalmem(),
    freemem: (): number => os.freemem(),
    cpus: () => os.cpus(),
    networkInterfaces: () => os.networkInterfaces(),
  };

  /**
   * Execute shell command with promise
   */
  export async function execCommand(
    command: string, 
    options: { cwd?: string; env?: Record<string, string>; timeout?: number } = {}
  ): Promise<{ stdout: string; stderr: string; code: number | null }> {
    return new Promise((resolve, reject) => {
      const child = exec(command, options, (error: Error | null, stdout: string, stderr: string) => {
        if (error) {
          reject(error);
        } else {
          resolve({ stdout, stderr, code: 0 });
        }
      });

      if (options.timeout) {
        setTimeout(() => {
          child.kill();
          reject(new Error(`Command timed out after ${options.timeout}ms`));
        }, options.timeout);
      }
    });
  }

  /**
   * Spawn process with real-time output
   */
  export function spawnProcess(
    command: string,
    args: string[],
    options: { cwd?: string; env?: Record<string, string> } = {}
  ): { 
    process: import('child_process').ChildProcess, 
    promise: Promise<{ stdout: string; stderr: string; code: number | null }> 
  } {
    const child = spawn(command, args, { ...options, shell: true });
    let stdout = '';
    let stderr = '';

    child.stdout?.on('data', (data) => {
      stdout += data.toString();
    });

    child.stderr?.on('data', (data) => {
      stderr += data.toString();
    });

    const promise = new Promise<{ stdout: string; stderr: string; code: number | null }>((resolve) => {
      child.on('close', (code) => {
        resolve({ stdout, stderr, code });
      });
    });

    return { process: child, promise };
  }

  /**
   * Open external URL or file
   */
  export async function openExternal(url: string): Promise<void> {
    return shell.openExternal(url);
  }

  /**
   * Show system dialogs
   */
  export async function showMessageBox(
    browserWindow: Electron.BrowserWindow,
    options: Electron.MessageBoxOptions
  ): Promise<Electron.MessageBoxReturnValue> {
    return dialog.showMessageBox(browserWindow, options);
  }

  export async function showOpenDialog(
    browserWindow: Electron.BrowserWindow,
    options: Electron.OpenDialogOptions
  ): Promise<Electron.OpenDialogReturnValue> {
    return dialog.showOpenDialog(browserWindow, options);
  }

  export async function showSaveDialog(
    browserWindow: Electron.BrowserWindow,
    options: Electron.SaveDialogOptions
  ): Promise<Electron.SaveDialogReturnValue> {
    return dialog.showSaveDialog(browserWindow, options);
  }
}

/**
 * Enhanced Application Utilities
 */
export namespace AppUtils {
  /**
   * App information
   */
  export const info = {
    version: (): string => app.getVersion(),
    name: (): string => app.getName(),
    locale: (): string => app.getLocale(),
    path: (): string => app.getAppPath(),
    isPackaged: (): boolean => app.isPackaged,
    isReady: (): boolean => app.isReady(),
    isDefaultProtocolClient: (protocol: string): boolean => app.isDefaultProtocolClient(protocol),
  };

  /**
   * App operations
   */
  export function quit(): void {
    app.quit();
  }

  export function relaunch(options?: Electron.RelaunchOptions): void {
    app.relaunch(options);
  }

  export function hide(): void {
    app.hide();
  }

  export function show(): void {
    app.show();
  }

  export function focus(): void {
    app.focus();
  }

  export function exit(exitCode?: number): void {
    app.exit(exitCode);
  }

  export function setLoginItemSettings(settings: Electron.Settings): void {
    app.setLoginItemSettings(settings);
  }

  export function setAboutPanelOptions(options: Electron.AboutPanelOptionsOptions): void {
    app.setAboutPanelOptions(options);
  }
}

/**
 * Enhanced Security Utilities
 */
export namespace SecurityUtils {
  /**
   * Generate cryptographically secure random values
   */
  export function randomBytes(size: number): Buffer {
    return crypto.randomBytes(size);
  }

  export function randomHex(size: number): string {
    return crypto.randomBytes(size).toString('hex');
  }

  export function randomString(size: number, chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'): string {
    const bytes = crypto.randomBytes(size);
    let result = '';
    for (let i = 0; i < size; i++) {
      result += chars[bytes[i] % chars.length];
    }
    return result;
  }

  export function uuid(): string {
    return crypto.randomUUID();
  }

  /**
   * Hash and encryption utilities
   */
  export function hash(data: string, algorithm: string = 'sha256'): string {
    return crypto.createHash(algorithm).update(data).digest('hex');
  }

  export async function hashFile(filePath: string, algorithm: string = 'sha256'): Promise<string> {
    return new Promise((resolve, reject) => {
      const hash = crypto.createHash(algorithm);
      const stream = fs.createReadStream(filePath);
      
      stream.on('data', (data) => hash.update(data));
      stream.on('end', () => resolve(hash.digest('hex')));
      stream.on('error', reject);
    });
  }

  export function hmac(data: string, key: string, algorithm: string = 'sha256'): string {
    return crypto.createHmac(algorithm, key).update(data).digest('hex');
  }

  export function encrypt(text: string, password: string): { encrypted: string; iv: string } {
    const iv = crypto.randomBytes(16);
    const key = crypto.scryptSync(password, 'salt', 32); // Use scrypt to derive a key
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return { encrypted, iv: iv.toString('hex') };
  }

  export function decrypt(encrypted: string, password: string, ivHex: string): string {
    const iv = Buffer.from(ivHex, 'hex');
    const key = crypto.scryptSync(password, 'salt', 32); // Use same salt as encryption
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }

  /**
   * Path validation and sanitization
   */
  export function validatePath(filePath: string): { isValid: boolean; issues: string[] } {
    const issues: string[] = [];

    // Check for path traversal
    if (filePath.includes('../') || filePath.includes('..\\')) {
      issues.push('Path traversal detected');
    }

    // Check for suspicious characters
    const suspiciousChars = /[<>:"|?*]/;
    if (suspiciousChars.test(filePath)) {
      issues.push('Suspicious characters in path');
    }

    // Check for absolute paths in unexpected contexts
    if (path.isAbsolute(filePath) && !filePath.startsWith(app.getPath('userData'))) {
      issues.push('Unexpected absolute path');
    }

    return { isValid: issues.length === 0, issues };
  }

  /**
   * Input validation utilities
   */
  export function validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  export function validateUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  export function sanitizeHtml(html: string): string {
    // Basic HTML sanitization - in production, use a proper library like DOMPurify
    return html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  }
}

/**
 * Enhanced Logging Utilities
 */
export namespace LogUtils {
  export type LogLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal';

  const levelMap: Record<LogLevel, number> = {
    trace: 0,
    debug: 1,
    info: 2,
    warn: 3,
    error: 4,
    fatal: 5
  };

  let currentLevel: LogLevel = 'info';
  const loggers: Map<string, Logger> = new Map();

  export function setLevel(level: LogLevel): void {
    currentLevel = level;
  }

  export function getLogger(scope: string): Logger {
    if (!loggers.has(scope)) {
      loggers.set(scope, new Logger(scope));
    }
    return loggers.get(scope)!;
  }

  export function log(level: LogLevel, message: string, ...args: any[]): void {
    if (levelMap[level] < levelMap[currentLevel]) {
      return;
    }

    const timestamp = new Date().toISOString();
    const formattedMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
    
    switch (level) {
      case 'trace':
      case 'debug':
        console.debug(formattedMessage, ...args);
        break;
      case 'info':
        console.info(formattedMessage, ...args);
        break;
      case 'warn':
        console.warn(formattedMessage, ...args);
        break;
      case 'error':
      case 'fatal':
        console.error(formattedMessage, ...args);
        break;
    }
  }
}

class Logger {
  constructor(private scope: string) {}

  trace(message: string, ...args: any[]): void {
    LogUtils.log('trace', `[${this.scope}] ${message}`, ...args);
  }

  debug(message: string, ...args: any[]): void {
    LogUtils.log('debug', `[${this.scope}] ${message}`, ...args);
  }

  info(message: string, ...args: any[]): void {
    LogUtils.log('info', `[${this.scope}] ${message}`, ...args);
  }

  warn(message: string, ...args: any[]): void {
    LogUtils.log('warn', `[${this.scope}] ${message}`, ...args);
  }

  error(message: string, ...args: any[]): void {
    LogUtils.log('error', `[${this.scope}] ${message}`, ...args);
  }

  fatal(message: string, ...args: any[]): void {
    LogUtils.log('fatal', `[${this.scope}] ${message}`, ...args);
  }
}

/**
 * Enhanced Performance Utilities
 */
export namespace PerfUtils {
  /**
   * Performance measurement
   */
  export function measure<T>(fn: () => T, label?: string): { result: T; duration: number } {
    const start = process.hrtime.bigint();
    const result = fn();
    const end = process.hrtime.bigint();
    const duration = Number(end - start) / 1_000_000; // Convert to milliseconds

    if (label) {
      LogUtils.getLogger('Perf').info(`${label} took ${duration.toFixed(2)}ms`);
    }

    return { result, duration };
  }

  export async function measureAsync<T>(fn: () => Promise<T>, label?: string): Promise<{ result: T; duration: number }> {
    const start = process.hrtime.bigint();
    const result = await fn();
    const end = process.hrtime.bigint();
    const duration = Number(end - start) / 1_000_000; // Convert to milliseconds

    if (label) {
      LogUtils.getLogger('Perf').info(`${label} took ${duration.toFixed(2)}ms`);
    }

    return { result, duration };
  }

  /**
   * Memory monitoring
   */
  export function getMemoryUsage(): NodeJS.MemoryUsage {
    return process.memoryUsage();
  }

  export function getMemoryUsageFormatted(): Record<string, string> {
    const usage = process.memoryUsage();
    const format = (bytes: number): string => {
      const kb = bytes / 1024;
      const mb = kb / 1024;
      return `${mb.toFixed(2)} MB`;
    };

    return {
      rss: format(usage.rss),
      heapTotal: format(usage.heapTotal),
      heapUsed: format(usage.heapUsed),
      external: format(usage.external),
      arrayBuffers: format(usage.arrayBuffers)
    };
  }

  /**
   * Performance monitoring service
   */
  export function createMonitor(intervalMs: number = 1000) {
    let intervalId: NodeJS.Timeout | null = null;
    let isMonitoring = false;
    
    return {
      start: (callback?: (stats: { memory: NodeJS.MemoryUsage; uptime: number }) => void) => {
        if (isMonitoring) return;
        
        isMonitoring = true;
        intervalId = setInterval(() => {
          const stats = {
            memory: process.memoryUsage(),
            uptime: process.uptime()
          };
          
          if (callback) {
            callback(stats);
          } else {
            LogUtils.getLogger('Perf').debug('Memory usage:', PerfUtils.getMemoryUsageFormatted());
          }
        }, intervalMs);
      },
      
      stop: () => {
        if (intervalId) {
          clearInterval(intervalId);
          intervalId = null;
          isMonitoring = false;
        }
      },
      
      isRunning: () => isMonitoring
    };
  }
}