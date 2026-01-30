/**
 * Data management utilities for the renderer process
 */

/**
 * LocalStorage wrapper with error handling and type safety
 */
export class LocalStorageManager {
  /**
   * Set an item in localStorage
   */
  static setItem<T>(key: string, value: T): void {
    try {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(key, serializedValue);
    } catch (error) {
      console.error(`Failed to set localStorage item "${key}":`, error);
      throw error;
    }
  }

  /**
   * Get an item from localStorage
   */
  static getItem<T>(key: string, defaultValue?: T): T | null {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue || null;
    } catch (error) {
      console.error(`Failed to get localStorage item "${key}":`, error);
      return defaultValue || null;
    }
  }

  /**
   * Remove an item from localStorage
   */
  static removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Failed to remove localStorage item "${key}":`, error);
      throw error;
    }
  }

  /**
   * Clear all items from localStorage
   */
  static clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Failed to clear localStorage:', error);
      throw error;
    }
  }

  /**
   * Check if an item exists in localStorage
   */
  static hasItem(key: string): boolean {
    try {
      return localStorage.getItem(key) !== null;
    } catch {
      return false;
    }
  }

  /**
   * Get all keys in localStorage
   */
  static getKeys(): string[] {
    try {
      return Object.keys(localStorage);
    } catch {
      return [];
    }
  }
}

/**
 * SessionStorage wrapper with error handling and type safety
 */
export class SessionStorageManager {
  /**
   * Set an item in sessionStorage
   */
  static setItem<T>(key: string, value: T): void {
    try {
      const serializedValue = JSON.stringify(value);
      sessionStorage.setItem(key, serializedValue);
    } catch (error) {
      console.error(`Failed to set sessionStorage item "${key}":`, error);
      throw error;
    }
  }

  /**
   * Get an item from sessionStorage
   */
  static getItem<T>(key: string, defaultValue?: T): T | null {
    try {
      const item = sessionStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue || null;
    } catch (error) {
      console.error(`Failed to get sessionStorage item "${key}":`, error);
      return defaultValue || null;
    }
  }

  /**
   * Remove an item from sessionStorage
   */
  static removeItem(key: string): void {
    try {
      sessionStorage.removeItem(key);
    } catch (error) {
      console.error(`Failed to remove sessionStorage item "${key}":`, error);
      throw error;
    }
  }

  /**
   * Clear all items from sessionStorage
   */
  static clear(): void {
    try {
      sessionStorage.clear();
    } catch (error) {
      console.error('Failed to clear sessionStorage:', error);
      throw error;
    }
  }
}

/**
 * Generic data cache with TTL (Time To Live)
 */
export class DataCache<T = any> {
  private cache: Map<string, { data: T; timestamp: number; ttl: number }> = new Map();

  /**
   * Set data in cache with TTL (in milliseconds)
   */
  set(key: string, data: T, ttl: number = 300000): void {
    // Default 5 minutes
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  /**
   * Get data from cache if not expired
   */
  get(key: string): T | null {
    const cached = this.cache.get(key);
    if (!cached) {
      return null;
    }

    if (Date.now() - cached.timestamp > cached.ttl) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  /**
   * Check if data exists in cache and is not expired
   */
  has(key: string): boolean {
    return this.get(key) !== null;
  }

  /**
   * Remove data from cache
   */
  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Clean expired entries
   */
  cleanExpired(): void {
    const now = Date.now();
    for (const [key, value] of this.cache.entries()) {
      if (now - value.timestamp > value.ttl) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Get cache size
   */
  size(): number {
    this.cleanExpired(); // Clean before returning size
    return this.cache.size;
  }
}

/**
 * Data validation utilities
 */
export class DataValidator {
  /**
   * Validate if data matches a schema
   */
  static validateSchema(data: any, schema: Record<string, any>): boolean {
    for (const key in schema) {
      if (!(key in data)) {
        return false;
      }

      const expectedType = schema[key];
      const actualValue = data[key];
      const actualType = typeof actualValue;

      if (actualType !== expectedType) {
        return false;
      }
    }
    return true;
  }

  /**
   * Validate required fields
   */
  static validateRequired(data: any, requiredFields: string[]): boolean {
    for (const field of requiredFields) {
      if (!(field in data) || data[field] === undefined || data[field] === null) {
        return false;
      }
    }
    return true;
  }

  /**
   * Sanitize data based on allowed fields
   */
  static sanitizeData(data: any, allowedFields: string[]): any {
    const sanitized: any = {};
    for (const field of allowedFields) {
      if (field in data) {
        sanitized[field] = data[field];
      }
    }
    return sanitized;
  }
}

/**
 * Data transformation utilities
 */
export class DataTransformer {
  /**
   * Transform data using a mapping function
   */
  static transformArray<T, U>(arr: T[], transformer: (item: T, index: number) => U): U[] {
    return arr.map(transformer);
  }

  /**
   * Group array items by a key
   */
  static groupBy<T>(arr: T[], key: keyof T | ((item: T) => string)): Record<string, T[]> {
    const grouped: Record<string, T[]> = {};

    for (const item of arr) {
      const groupKey = typeof key === 'function' ? key(item) : String(item[key]);

      if (!grouped[groupKey]) {
        grouped[groupKey] = [];
      }

      grouped[groupKey].push(item);
    }

    return grouped;
  }

  /**
   * Flatten a nested array
   */
  static flatten<T>(arr: T[][]): T[] {
    return ([] as T[]).concat(...arr);
  }

  /**
   * Sort array by a property
   */
  static sortBy<T>(arr: T[], key: keyof T, ascending: boolean = true): T[] {
    return [...arr].sort((a, b) => {
      const aVal = a[key];
      const bVal = b[key];

      if (aVal < bVal) {
        return ascending ? -1 : 1;
      }
      if (aVal > bVal) {
        return ascending ? 1 : -1;
      }
      return 0;
    });
  }

  /**
   * Remove duplicates from array based on a key
   */
  static deduplicate<T>(arr: T[], key: keyof T): T[] {
    const seen = new Set<any>();
    return arr.filter((item) => {
      const value = item[key];
      if (seen.has(value)) {
        return false;
      }
      seen.add(value);
      return true;
    });
  }
}
