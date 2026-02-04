/**
 * Main process utilities for Electron applications
 * These utilities work in Node.js/Electron main process environment
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import { app } from 'electron';

/**
 * File system utilities for main process
 */
export namespace FileSystemUtils {
  /**
   * Get user data directory path
   */
  export function getUserDataPath(): string {
    return app.getPath('userData');
  }

  /**
   * Get application data directory path
   */
  export function getAppDataPath(): string {
    return app.getPath('appData');
  }

  /**
   * Get home directory path
   */
  export function getHomePath(): string {
    return app.getPath('home');
  }

  /**
   * Get documents directory path
   */
  export function getDocumentsPath(): string {
    return app.getPath('documents');
  }

  /**
   * Get downloads directory path
   */
  export function getDownloadsPath(): string {
    return app.getPath('downloads');
  }

  /**
   * Get desktop directory path
   */
  export function getDesktopPath(): string {
    return app.getPath('desktop');
  }

  /**
   * Get temporary directory path
   */
  export function getTempPath(): string {
    return app.getPath('temp');
  }

  /**
   * Get executable path
   */
  export function getExecutablePath(): string {
    return app.getPath('exe');
  }

  /**
   * Ensure a directory exists, creating it if necessary
   */
  export async function ensureDirectory(dirPath: string): Promise<void> {
    try {
      await fs.promises.mkdir(dirPath, { recursive: true });
    } catch (error: any) {
      if (error.code !== 'EEXIST') {
        throw error;
      }
    }
  }

  /**
   * Write data to a file
   */
  export async function writeFile(filePath: string, data: string | Buffer): Promise<void> {
    const dir = path.dirname(filePath);
    await FileSystemUtils.ensureDirectory(dir);
    return fs.promises.writeFile(filePath, data);
  }

  /**
   * Read data from a file
   */
  export async function readFile(filePath: string, encoding: BufferEncoding = 'utf8'): Promise<string | Buffer> {
    return fs.promises.readFile(filePath, encoding);
  }

  /**
   * Check if a file exists
   */
  export async function fileExists(filePath: string): Promise<boolean> {
    try {
      await fs.promises.access(filePath, fs.constants.F_OK);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Check if a directory exists
   */
  export async function dirExists(dirPath: string): Promise<boolean> {
    try {
      const stats = await fs.promises.stat(dirPath);
      return stats.isDirectory();
    } catch {
      return false;
    }
  }

  /**
   * Delete a file
   */
  export async function removeFile(filePath: string): Promise<void> {
    return fs.promises.unlink(filePath);
  }

  /**
   * Delete a directory and its contents recursively
   */
  export async function removeDirectory(dirPath: string): Promise<void> {
    try {
      await fs.promises.rm(dirPath, { recursive: true, force: true });
    } catch (error: any) {
      if (error.code !== 'ENOENT') {
        throw error;
      }
    }
  }

  /**
   * List files in a directory
   */
  export async function listDirectory(dirPath: string, options: {
    recursive?: boolean;
    includeDirectories?: boolean;
    filter?: RegExp;
  } = {}): Promise<string[]> {
    const { recursive = false, includeDirectories = true, filter } = options;

    if (recursive) {
      const entries: string[] = [];
      const walk = async (currentDir: string): Promise<void> => {
        const items = await fs.promises.readdir(currentDir, { withFileTypes: true });

        for (const item of items) {
          const fullPath = path.join(currentDir, item.name);

          if (item.isDirectory()) {
            if (includeDirectories) {
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
        .filter(item => includeDirectories || !item.endsWith(path.sep))
        .filter(item => !filter || filter.test(path.join(dirPath, item)))
        .map(item => path.join(dirPath, item));
    }
  }

  /**
   * Get file stats
   */
  export async function getFileStats(filePath: string): Promise<fs.Stats> {
    return fs.promises.stat(filePath);
  }

  /**
   * Copy a file
   */
  export async function copyFile(src: string, dest: string): Promise<void> {
    await FileSystemUtils.ensureDirectory(path.dirname(dest));
    return fs.promises.copyFile(src, dest);
  }

  /**
   * Move a file
   */
  export async function moveFile(src: string, dest: string): Promise<void> {
    await FileSystemUtils.ensureDirectory(path.dirname(dest));
    return fs.promises.rename(src, dest);
  }

  /**
   * Create a readable stream
   */
  export function createReadStream(filePath: string, options?: fs.ReadStreamOptions): any {
    return fs.createReadStream(filePath, options);
  }

  /**
   * Create a writable stream
   */
  export function createWriteStream(filePath: string, options?: fs.WriteStreamOptions): any {
    return fs.createWriteStream(filePath, options);
  }

  /**
   * Watch a directory for changes
   */
  export function watchDirectory(dirPath: string, listener: (eventType: string, filename: string | null) => void): any {
    return fs.watch(dirPath, listener);
  }

  /**
   * Get file size
   */
  export async function getFileSize(filePath: string): Promise<number> {
    const stats = await getFileStats(filePath);
    return stats.size;
  }

  /**
   * Get file extension
   */
  export function getFileExtension(filePath: string): string {
    return path.extname(filePath).toLowerCase();
  }

  /**
   * Get file name without extension
   */
  export function getFileName(filePath: string): string {
    return path.basename(filePath, path.extname(filePath));
  }

  /**
   * Get directory path from file path
   */
  export function getDirPath(filePath: string): string {
    return path.dirname(filePath);
  }

  /**
   * Join path segments
   */
  export function joinPath(...segments: string[]): string {
    return path.join(...segments);
  }

  /**
   * Resolve path to absolute
   */
  export function resolvePath(...segments: string[]): string {
    return path.resolve(...segments);
  }

  /**
   * Check if path is absolute
   */
  export function isAbsolutePath(filePath: string): boolean {
    return path.isAbsolute(filePath);
  }

  /**
   * Normalize path
   */
  export function normalizePath(filePath: string): string {
    return path.normalize(filePath);
  }
}

/**
 * Process and system utilities
 */
export namespace SystemUtils {
  /**
   * Get platform information
   */
  export function getPlatform(): 'win32' | 'darwin' | 'linux' | 'freebsd' | 'openbsd' | 'sunos' | 'aix' {
    return process.platform as any;
  }

  /**
   * Check if running on Windows
   */
  export function isWindows(): boolean {
    return process.platform === 'win32';
  }

  /**
   * Check if running on macOS
   */
  export function isMacOS(): boolean {
    return process.platform === 'darwin';
  }

  /**
   * Check if running on Linux
   */
  export function isLinux(): boolean {
    return process.platform === 'linux';
  }

  /**
   * Get architecture information
   */
  export function getArchitecture(): string {
    return process.arch;
  }

  /**
   * Get Node.js version
   */
  export function getNodeVersion(): string {
    return process.version;
  }

  /**
   * Get Electron version
   */
  export function getElectronVersion(): string {
    return process.versions.electron;
  }

  /**
   * Get Chrome version
   */
  export function getChromeVersion(): string {
    return process.versions.chrome;
  }

  /**
   * Get system memory info
   */
  export function getMemoryInfo(): {
    total: number;
    free: number;
    used: number;
  } {
    const os = require('os');
    const total = os.totalmem();
    const free = os.freemem();
    return {
      total,
      free,
      used: total - free
    };
  }

  /**
   * Get CPU info
   */
  export function getCpuInfo(): {
    model: string;
    speed: number;
    cores: number;
  } {
    const os = require('os');
    const cpus = os.cpus();
    return {
      model: cpus[0]?.model || 'Unknown',
      speed: cpus[0]?.speed || 0,
      cores: cpus.length
    };
  }

  /**
   * Get uptime in seconds
   */
  export function getUptime(): number {
    return process.uptime();
  }

  /**
   * Get process ID
   */
  export function getProcessId(): number {
    return process.pid;
  }

  /**
   * Get environment variable
   */
  export function getEnvVar(name: string, defaultValue?: string): string | undefined {
    return process.env[name] || defaultValue;
  }

  /**
   * Set environment variable
   */
  export function setEnvVar(name: string, value: string): void {
    process.env[name] = value;
  }

  /**
   * Execute command
   */
  export function execCommand(command: string, options?: {
    cwd?: string;
    env?: Record<string, string>;
    timeout?: number;
  }): Promise<{
    stdout: string;
    stderr: string;
    exitCode: number | null;
  }> {
    const { spawn } = require('child_process');
    
    return new Promise((resolve, reject) => {
      const child = spawn(command, [], {
        shell: true,
        ...options
      });
      
      let stdout = '';
      let stderr = '';
      
      child.stdout?.on('data', (data: string) => {
        stdout += data;
      });
      
      child.stderr?.on('data', (data: string) => {
        stderr += data;
      });
      
      child.on('close', (code: number | null) => {
        resolve({ stdout, stderr, exitCode: code });
      });
      
      child.on('error', (error: Error) => {
        reject(error);
      });
      
      if (options?.timeout) {
        setTimeout(() => {
          child.kill();
          reject(new Error(`Command timed out after ${options.timeout}ms`));
        }, options.timeout);
      }
    });
  }
}

/**
 * Application utilities
 */
export namespace AppUtils {
  /**
   * Get application version
   */
  export function getAppVersion(): string {
    return app.getVersion();
  }

  /**
   * Get application name
   */
  export function getAppName(): string {
    return app.getName();
  }

  /**
   * Restart the application
   */
  export function relaunch(): void {
    app.relaunch();
  }

  /**
   * Quit the application
   */
  export function quit(): void {
    app.quit();
  }

  /**
   * Hide the application
   */
  export function hide(): void {
    app.hide();
  }

  /**
   * Show the application
   */
  export function show(): void {
    app.show();
  }

  /**
   * Focus the application
   */
  export function focus(): void {
    app.focus();
  }

  /**
   * Get application path
   */
  export function getApplicationPath(): string {
    return app.getAppPath();
  }

  /**
   * Check if application is packaged
   */
  export function isPackaged(): boolean {
    return app.isPackaged;
  }

  /**
   * Get command line arguments
   */
  export function getCommandLineArgs(): string[] {
    return process.argv.slice(2);
  }

  /**
   * Set application user model ID (Windows only)
   */
  export function setUserModelId(id: string): void {
    if (process.platform === 'win32') {
      app.setAppUserModelId(id);
    }
  }

  /**
   * Set about panel options
   */
  export function setAboutPanelOptions(options: {
    icon?: string;
    version?: string;
    copyright?: string;
    website?: string;
  }): void {
    app.setAboutPanelOptions(options);
  }

  /**
   * Jump to registered protocol
   */
  export function jumpToProtocol(protocol: string): void {
    app.setJumpList([{
      name: protocol
    }]);
  }
}

/**
 * Security utilities for main process
 */
export namespace SecurityUtils {
  /**
   * Generate secure random bytes
   */
  export function generateRandomBytes(length: number): Buffer {
    return require('crypto').randomBytes(length);
  }

  /**
   * Generate random hex string
   */
  export function generateRandomHex(length: number): string {
    return require('crypto').randomBytes(length).toString('hex');
  }

  /**
   * Generate UUID
   */
  export function generateUUID(): string {
    return require('crypto').randomUUID();
  }

  /**
   * Hash string with specified algorithm
   */
  export function hash(data: string, algorithm: 'sha256' | 'sha512' | 'md5' = 'sha256'): string {
    return require('crypto').createHash(algorithm).update(data).digest('hex');
  }

  /**
   * Create HMAC
   */
  export function createHmac(data: string, key: string, algorithm: 'sha256' | 'sha512' = 'sha256'): string {
    return require('crypto').createHmac(algorithm, key).update(data).digest('hex');
  }

  /**
   * Encrypt data with key
   */
  export function encrypt(data: string, key: string, algorithm: string = 'aes-256-cbc'): {
    encrypted: string;
    iv: string;
  } {
    const crypto = require('crypto');
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipher(algorithm, key);
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return { encrypted, iv: iv.toString('hex') };
  }

  /**
   * Decrypt data with key
   */
  export function decrypt(encryptedData: string, key: string, iv: string, algorithm: string = 'aes-256-cbc'): string {
    const crypto = require('crypto');
    const decipher = crypto.createDecipher(algorithm, key);
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }

  /**
   * Validate file path security
   */
  export function validatePath(filePath: string): {
    isValid: boolean;
    issues: string[];
  } {
    const issues: string[] = [];
    
    // Check for path traversal
    if (filePath.includes('..')) {
      issues.push('Path traversal detected');
    }
    
    // Check for suspicious characters
    const suspiciousChars = /[<>:"|?*]/;
    if (suspiciousChars.test(filePath)) {
      issues.push('Suspicious characters in path');
    }
    
    return {
      isValid: issues.length === 0,
      issues
    };
  }
}

/**
 * Logging utilities
 */
export namespace LogUtils {
  type LogLevel = 'error' | 'warn' | 'info' | 'debug';
  
  const logLevels: Record<LogLevel, number> = {
    error: 0,
    warn: 1,
    info: 2,
    debug: 3
  };
  
  let currentLogLevel: LogLevel = 'info';
  
  /**
   * Set log level
   */
  export function setLogLevel(level: LogLevel): void {
    currentLogLevel = level;
  }
  
  /**
   * Log error message
   */
  export function error(message: string, ...args: any[]): void {
    if (logLevels[currentLogLevel] >= logLevels.error) {
      console.error(`[ERROR] ${message}`, ...args);
    }
  }
  
  /**
   * Log warning message
   */
  export function warn(message: string, ...args: any[]): void {
    if (logLevels[currentLogLevel] >= logLevels.warn) {
      console.warn(`[WARN] ${message}`, ...args);
    }
  }
  
  /**
   * Log info message
   */
  export function info(message: string, ...args: any[]): void {
    if (logLevels[currentLogLevel] >= logLevels.info) {
      console.info(`[INFO] ${message}`, ...args);
    }
  }
  
  /**
   * Log debug message
   */
  export function debug(message: string, ...args: any[]): void {
    if (logLevels[currentLogLevel] >= logLevels.debug) {
      console.debug(`[DEBUG] ${message}`, ...args);
    }
  }
  
  /**
   * Create scoped logger
   */
  export function createLogger(scope: string): {
    error: (message: string, ...args: any[]) => void;
    warn: (message: string, ...args: any[]) => void;
    info: (message: string, ...args: any[]) => void;
    debug: (message: string, ...args: any[]) => void;
  } {
    return {
      error: (message: string, ...args: any[]) => error(`[${scope}] ${message}`, ...args),
      warn: (message: string, ...args: any[]) => warn(`[${scope}] ${message}`, ...args),
      info: (message: string, ...args: any[]) => info(`[${scope}] ${message}`, ...args),
      debug: (message: string, ...args: any[]) => debug(`[${scope}] ${message}`, ...args)
    };
  }
}

/**
 * Performance utilities
 */
export namespace PerformanceUtils {
  /**
   * Get memory usage
   */
  export function getMemoryUsage(): NodeJS.MemoryUsage {
    return process.memoryUsage();
  }

  /**
   * Get CPU usage
   */
  export async function getCpuUsage(): Promise<{
    user: number;
    system: number;
  }> {
    return new Promise((resolve) => {
      require('process').cpuUsage((usage: any) => {
        resolve(usage);
      });
    });
  }

  /**
   * Start performance timer
   */
  export function startTimer(label: string): () => number {
    const startTime = process.hrtime.bigint();
    return () => {
      const endTime = process.hrtime.bigint();
      const diff = Number(endTime - startTime) / 1000000; // Convert to milliseconds
      return diff;
    };
  }

  /**
   * Measure function execution time
   */
  export async function measureTime<T>(
    fn: () => Promise<T> | T,
    label?: string
  ): Promise<{ result: T; duration: number }> {
    const endTimer = startTimer(label || 'function');
    const result = await fn();
    const duration = endTimer();
    
    if (label) {
      LogUtils.info(`Function "${label}" took ${duration.toFixed(2)}ms`);
    }
    
    return { result, duration };
  }

  /**
   * Monitor performance over time
   */
  export function createMonitor(intervalMs = 1000): {
    start: () => void;
    stop: () => void;
    getStats: () => {
      cpu: number;
      memory: NodeJS.MemoryUsage;
      uptime: number;
    };
  } {
    let interval: NodeJS.Timeout | null = null;
    let stats = {
      cpu: 0,
      memory: process.memoryUsage(),
      uptime: process.uptime()
    };
    
    const collect = async () => {
      const cpuUsage = await getCpuUsage();
      stats = {
        cpu: cpuUsage.user + cpuUsage.system,
        memory: process.memoryUsage(),
        uptime: process.uptime()
      };
    };
    
    return {
      start: () => {
        if (!interval) {
          interval = setInterval(collect, intervalMs);
        }
      },
      stop: () => {
        if (interval) {
          clearInterval(interval);
          interval = null;
        }
      },
      getStats: () => ({ ...stats })
    };
  }
}