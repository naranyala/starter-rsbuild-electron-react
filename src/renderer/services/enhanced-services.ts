/**
 * Enhanced Services for 10x Development
 * Comprehensive service layer for backend/frontend operations
 */

import { EventEmitter } from 'events';

/**
 * Base Service Class
 */
export abstract class BaseService {
  protected emitter: EventEmitter = new EventEmitter();
  protected initialized: boolean = false;

  async initialize(): Promise<void> {
    if (this.initialized) return;
    
    await this.setup();
    this.initialized = true;
  }

  protected abstract setup(): Promise<void>;

  destroy(): void {
    this.emitter.removeAllListeners();
    this.cleanup();
    this.initialized = false;
  }

  protected cleanup(): void {
    // Override in subclasses for cleanup logic
  }

  on(event: string, listener: (...args: any[]) => void): void {
    this.emitter.on(event, listener);
  }

  off(event: string, listener: (...args: any[]) => void): void {
    this.emitter.off(event, listener);
  }

  emit(event: string, ...args: any[]): void {
    this.emitter.emit(event, ...args);
  }
}

/**
 * Enhanced HTTP Service
 */
export class HttpService extends BaseService {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;
  private timeout: number;

  constructor(config: {
    baseUrl: string;
    headers?: Record<string, string>;
    timeout?: number;
  }) {
    super();
    this.baseUrl = config.baseUrl;
    this.defaultHeaders = config.headers || { 'Content-Type': 'application/json' };
    this.timeout = config.timeout || 10000;
  }

  protected async setup(): Promise<void> {
    // Initialization logic if needed
  }

  async request<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const config: RequestInit = {
      headers: { ...this.defaultHeaders, ...options.headers },
      ...options
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...config,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return response.json();
      } else {
        return response.text() as any;
      }
    } catch (error) {
      clearTimeout(timeoutId);
      if ((error as Error).name === 'AbortError') {
        throw new Error('Request timeout');
      }
      throw error;
    }
  }

  get<T = any>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  post<T = any, D = any>(endpoint: string, data?: D, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined
    });
  }

  put<T = any, D = any>(endpoint: string, data?: D, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined
    });
  }

  patch<T = any, D = any>(endpoint: string, data?: D, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined
    });
  }

  delete<T = any>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

/**
 * Enhanced Cache Service
 */
export class CacheService extends BaseService {
  private cache: Map<string, { data: any; expiry: number; createdAt: number }>;
  private maxSize: number;
  private defaultTTL: number;

  constructor(options: { maxSize?: number; defaultTTL?: number } = {}) {
    super();
    this.cache = new Map();
    this.maxSize = options.maxSize || 1000;
    this.defaultTTL = options.defaultTTL || 300000; // 5 minutes
  }

  protected async setup(): Promise<void> {
    // Initialization logic if needed
  }

  set(key: string, value: any, ttl: number = this.defaultTTL): void {
    // Clean up expired entries if needed
    this.cleanupExpired();

    // Evict oldest entries if cache is full
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.getOldestKey();
      if (oldestKey) {
        this.cache.delete(oldestKey);
      }
    }

    const expiry = Date.now() + ttl;
    this.cache.set(key, {
      data: value,
      expiry,
      createdAt: Date.now()
    });
  }

  get<T = any>(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) {
      return null;
    }

    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }

    return item.data as T;
  }

  has(key: string): boolean {
    const item = this.cache.get(key);
    if (!item) {
      return false;
    }

    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    this.cleanupExpired();
    return this.cache.size;
  }

  keys(): string[] {
    this.cleanupExpired();
    return Array.from(this.cache.keys());
  }

  private cleanupExpired(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiry) {
        this.cache.delete(key);
      }
    }
  }

  private getOldestKey(): string | null {
    let oldestKey: string | null = null;
    let oldestTime = Infinity;

    for (const [key, item] of this.cache.entries()) {
      if (item.createdAt < oldestTime) {
        oldestTime = item.createdAt;
        oldestKey = key;
      }
    }

    return oldestKey;
  }
}

/**
 * Enhanced Storage Service
 */
export class StorageService extends BaseService {
  private localStorage: Storage | null;
  private sessionStorage: Storage | null;
  private cacheService: CacheService;

  constructor() {
    super();
    this.localStorage = typeof window !== 'undefined' ? window.localStorage : null;
    this.sessionStorage = typeof window !== 'undefined' ? window.sessionStorage : null;
    this.cacheService = new CacheService({ maxSize: 100, defaultTTL: 60000 }); // 1 min for cache
  }

  protected async setup(): Promise<void> {
    await this.cacheService.initialize();
  }

  // Local storage methods
  setLocalItem<T>(key: string, value: T): void {
    try {
      if (this.localStorage) {
        this.localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (error) {
      console.error(`Failed to set localStorage item "${key}":`, error);
      // Fallback to in-memory cache
      this.cacheService.set(key, value);
    }
  }

  getLocalItem<T>(key: string, defaultValue?: T): T | null {
    try {
      if (this.localStorage) {
        const item = this.localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue || null;
      }
    } catch (error) {
      console.error(`Failed to get localStorage item "${key}":`, error);
      // Check in-memory cache as fallback
      return this.cacheService.get<T>(key) || defaultValue || null;
    }
    return defaultValue || null;
  }

  removeLocalItem(key: string): void {
    try {
      if (this.localStorage) {
        this.localStorage.removeItem(key);
      }
    } catch (error) {
      console.error(`Failed to remove localStorage item "${key}":`, error);
      // Also remove from cache
      this.cacheService.delete(key);
    }
  }

  // Session storage methods
  setSessionItem<T>(key: string, value: T): void {
    try {
      if (this.sessionStorage) {
        this.sessionStorage.setItem(key, JSON.stringify(value));
      }
    } catch (error) {
      console.error(`Failed to set sessionStorage item "${key}":`, error);
    }
  }

  getSessionItem<T>(key: string, defaultValue?: T): T | null {
    try {
      if (this.sessionStorage) {
        const item = this.sessionStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue || null;
      }
    } catch (error) {
      console.error(`Failed to get sessionStorage item "${key}":`, error);
    }
    return defaultValue || null;
  }

  removeSessionItem(key: string): void {
    try {
      if (this.sessionStorage) {
        this.sessionStorage.removeItem(key);
      }
    } catch (error) {
      console.error(`Failed to remove sessionStorage item "${key}":`, error);
    }
  }

  // Utility methods
  clearAll(): void {
    try {
      if (this.localStorage) {
        this.localStorage.clear();
      }
      if (this.sessionStorage) {
        this.sessionStorage.clear();
      }
      this.cacheService.clear();
    } catch (error) {
      console.error('Failed to clear storage:', error);
    }
  }

  getUsage(): { localStorage: number; sessionStorage: number; cache: number } {
    let localStorageSize = 0;
    let sessionStorageSize = 0;

    if (this.localStorage) {
      for (let i = 0; i < this.localStorage.length; i++) {
        const key = this.localStorage.key(i);
        if (key) {
          const value = this.localStorage.getItem(key);
          localStorageSize += key.length + (value?.length || 0);
        }
      }
    }

    if (this.sessionStorage) {
      for (let i = 0; i < this.sessionStorage.length; i++) {
        const key = this.sessionStorage.key(i);
        if (key) {
          const value = this.sessionStorage.getItem(key);
          sessionStorageSize += key.length + (value?.length || 0);
        }
      }
    }

    return {
      localStorage: localStorageSize,
      sessionStorage: sessionStorageSize,
      cache: this.cacheService.size()
    };
  }
}

/**
 * Enhanced Logging Service
 */
export class LoggingService extends BaseService {
  private logLevel: 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal';
  private loggers: Map<string, LoggerInstance>;
  private transports: Transport[];

  constructor(options: {
    level?: 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal';
    transports?: Transport[];
  } = {}) {
    super();
    this.logLevel = options.level || 'info';
    this.transports = options.transports || [new ConsoleTransport()];
    this.loggers = new Map();
  }

  protected async setup(): Promise<void> {
    // Initialization logic if needed
  }

  getLogger(scope: string): LoggerInstance {
    if (!this.loggers.has(scope)) {
      this.loggers.set(scope, new LoggerInstance(scope, this));
    }
    return this.loggers.get(scope)!;
  }

  log(level: 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal', 
      message: string, 
      meta?: any): void {
    if (this.getLevelPriority(level) < this.getLevelPriority(this.logLevel)) {
      return;
    }

    const logEntry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      meta,
      pid: typeof process !== 'undefined' ? process.pid : undefined
    };

    for (const transport of this.transports) {
      transport.log(logEntry);
    }
  }

  private getLevelPriority(level: string): number {
    const priorities = {
      trace: 0,
      debug: 1,
      info: 2,
      warn: 3,
      error: 4,
      fatal: 5
    };
    return priorities[level as keyof typeof priorities] ?? 2;
  }

  setLevel(level: 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal'): void {
    this.logLevel = level;
  }
}

interface LogEntry {
  timestamp: string;
  level: string;
  message: string;
  meta?: any;
  pid?: number;
}

abstract class Transport {
  abstract log(entry: LogEntry): void;
}

class ConsoleTransport extends Transport {
  log(entry: LogEntry): void {
    const { level, message, meta, timestamp } = entry;
    const formattedMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
    
    switch (level) {
      case 'trace':
      case 'debug':
        console.debug(formattedMessage, meta);
        break;
      case 'info':
        console.info(formattedMessage, meta);
        break;
      case 'warn':
        console.warn(formattedMessage, meta);
        break;
      case 'error':
      case 'fatal':
        console.error(formattedMessage, meta);
        break;
    }
  }
}

class LoggerInstance {
  constructor(private scope: string, private logger: LoggingService) {}

  trace(message: string, meta?: any): void {
    this.logger.log('trace', `[${this.scope}] ${message}`, meta);
  }

  debug(message: string, meta?: any): void {
    this.logger.log('debug', `[${this.scope}] ${message}`, meta);
  }

  info(message: string, meta?: any): void {
    this.logger.log('info', `[${this.scope}] ${message}`, meta);
  }

  warn(message: string, meta?: any): void {
    this.logger.log('warn', `[${this.scope}] ${message}`, meta);
  }

  error(message: string, meta?: any): void {
    this.logger.log('error', `[${this.scope}] ${message}`, meta);
  }

  fatal(message: string, meta?: any): void {
    this.logger.log('fatal', `[${this.scope}] ${message}`, meta);
  }
}

/**
 * Enhanced Validation Service
 */
export class ValidationService extends BaseService {
  protected async setup(): Promise<void> {
    // Initialization logic if needed
  }

  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  validateUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  validatePhone(phone: string): boolean {
    const phoneRegex = /^\+?[\d\s\-\(\)]{7,15}$/;
    return phoneRegex.test(phone);
  }

  validatePassword(password: string, options: {
    minLength?: number;
    requireUppercase?: boolean;
    requireLowercase?: boolean;
    requireNumbers?: boolean;
    requireSymbols?: boolean;
  } = {}): { isValid: boolean; errors: string[] } {
    const {
      minLength = 8,
      requireUppercase = true,
      requireLowercase = true,
      requireNumbers = true,
      requireSymbols = false
    } = options;

    const errors: string[] = [];

    if (password.length < minLength) {
      errors.push(`Password must be at least ${minLength} characters`);
    }

    if (requireUppercase && !/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }

    if (requireLowercase && !/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }

    if (requireNumbers && !/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }

    if (requireSymbols && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one symbol');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  sanitizeHtml(html: string): string {
    // Basic HTML sanitization - in production, use a proper library like DOMPurify
    return html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  }

  validateSchema<T>(data: any, schema: Schema<T>): ValidationResult {
    const errors: string[] = [];
    
    for (const [key, rule] of Object.entries(schema)) {
      const value = data[key];
      
      if (rule.required && (value === undefined || value === null)) {
        errors.push(`Field ${key} is required`);
        continue;
      }
      
      if (value !== undefined && value !== null) {
        if (rule.type && typeof value !== rule.type) {
          errors.push(`Field ${key} must be of type ${rule.type}`);
        }
        
        if (rule.validator && !rule.validator(value)) {
          errors.push(`Field ${key} is invalid`);
        }
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

interface SchemaRule {
  required?: boolean;
  type?: 'string' | 'number' | 'boolean' | 'object' | 'array';
  validator?: (value: any) => boolean;
}

interface Schema<T> {
  [K in keyof T]: SchemaRule;
}

interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Enhanced Configuration Service
 */
export class ConfigService extends BaseService {
  private config: Map<string, any>;
  private defaults: Record<string, any>;

  constructor(defaults: Record<string, any> = {}) {
    super();
    this.config = new Map();
    this.defaults = defaults;
  }

  protected async setup(): Promise<void> {
    // Load config from various sources
    await this.loadEnvironmentVariables();
    await this.loadDefaults();
  }

  private async loadEnvironmentVariables(): Promise<void> {
    if (typeof process !== 'undefined' && process.env) {
      for (const [key, value] of Object.entries(process.env)) {
        if (value !== undefined) {
          this.config.set(key, value);
        }
      }
    }
  }

  private async loadDefaults(): Promise<void> {
    for (const [key, value] of Object.entries(this.defaults)) {
      if (!this.config.has(key)) {
        this.config.set(key, value);
      }
    }
  }

  get<T = any>(key: string, defaultValue?: T): T | undefined {
    if (this.config.has(key)) {
      return this.config.get(key) as T;
    }
    return defaultValue;
  }

  set(key: string, value: any): void {
    this.config.set(key, value);
  }

  has(key: string): boolean {
    return this.config.has(key);
  }

  getAll(): Record<string, any> {
    return Object.fromEntries(this.config);
  }

  async loadFromFile(filePath: string): Promise<void> {
    // This would be implemented differently in Node.js vs browser environments
    // For now, just a placeholder
    console.warn('ConfigService.loadFromFile is not implemented for browser environment');
  }
}

/**
 * Enhanced Error Handling Service
 */
export class ErrorHandlingService extends BaseService {
  private errorHandlers: Map<string, (error: Error) => void>;
  private globalErrorHandler: ((error: Error) => void) | null = null;

  constructor() {
    super();
    this.errorHandlers = new Map();
  }

  protected async setup(): Promise<void> {
    // Setup global error handlers
    this.setupGlobalHandlers();
  }

  private setupGlobalHandlers(): void {
    if (typeof window !== 'undefined') {
      window.addEventListener('error', (event) => {
        this.handleGlobalError(event.error);
      });

      window.addEventListener('unhandledrejection', (event) => {
        this.handleGlobalError(event.reason);
      });
    }
  }

  setErrorHandler(context: string, handler: (error: Error) => void): void {
    this.errorHandlers.set(context, handler);
  }

  removeErrorHandler(context: string): void {
    this.errorHandlers.delete(context);
  }

  handleGlobalError(error: any): void {
    if (this.globalErrorHandler) {
      this.globalErrorHandler(error instanceof Error ? error : new Error(String(error)));
    } else {
      console.error('Unhandled error:', error);
    }
  }

  handleContextualError(context: string, error: any): void {
    const handler = this.errorHandlers.get(context);
    if (handler) {
      handler(error instanceof Error ? error : new Error(String(error)));
    } else {
      console.error(`Error in ${context}:`, error);
    }
  }

  setGlobalHandler(handler: (error: Error) => void): void {
    this.globalErrorHandler = handler;
  }

  createError(code: string, message: string, details?: any): EnhancedError {
    return new EnhancedError(code, message, details);
  }
}

class EnhancedError extends Error {
  public code: string;
  public details?: any;
  public timestamp: Date;

  constructor(code: string, message: string, details?: any) {
    super(message);
    this.code = code;
    this.details = details;
    this.timestamp = new Date();
    this.name = 'EnhancedError';
  }
}