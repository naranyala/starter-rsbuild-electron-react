/**
 * Enhanced Renderer Process Utilities for 10x Development
 * Consolidated, enriched utilities for Electron renderer process
 */

/**
 * Enhanced DOM and Browser Utilities
 */
export namespace DOMUtils {
  /**
   * DOM ready utility
   */
  static ready(callback: () => void): void {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  }

  /**
   * Element creation with attributes and classes
   */
  static createElement<K extends keyof HTMLElementTagNameMap>(
    tagName: K,
    options?: {
      attributes?: Record<string, string>;
      classes?: string[];
      textContent?: string;
      children?: (HTMLElement | string)[];
    }
  ): HTMLElementTagNameMap[K] {
    const element = document.createElement(tagName);

    if (options?.attributes) {
      Object.entries(options.attributes).forEach(([key, value]) => {
        element.setAttribute(key, value);
      });
    }

    if (options?.classes) {
      element.classList.add(...options.classes);
    }

    if (options?.textContent) {
      element.textContent = options.textContent;
    }

    if (options?.children) {
      options.children.forEach(child => {
        if (typeof child === 'string') {
          element.appendChild(document.createTextNode(child));
        } else {
          element.appendChild(child);
        }
      });
    }

    return element;
  }

  /**
   * Query selectors with type safety
   */
  static querySelector<T extends Element>(selectors: string): T | null {
    return document.querySelector(selectors) as T | null;
  }

  static querySelectorAll<T extends Element>(selectors: string): T[] {
    return Array.from(document.querySelectorAll(selectors)) as T[];
  }

  /**
   * Element visibility and viewport utilities
   */
  static isInViewport(element: HTMLElement): boolean {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  static isElementVisible(element: HTMLElement): boolean {
    const style = window.getComputedStyle(element);
    return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
  }

  /**
   * Scroll utilities
   */
  static scrollToTop(behavior: ScrollBehavior = 'smooth'): void {
    window.scrollTo({ top: 0, behavior });
  }

  static scrollToBottom(behavior: ScrollBehavior = 'smooth'): void {
    window.scrollTo({ top: document.body.scrollHeight, behavior });
  }

  static scrollToElement(
    element: HTMLElement,
    behavior: ScrollBehavior = 'smooth',
    block: ScrollLogicalPosition = 'start'
  ): void {
    element.scrollIntoView({ behavior, block });
  }

  /**
   * Clipboard utilities
   */
  static async copyToClipboard(text: string): Promise<boolean> {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        const success = document.execCommand('copy');
        document.body.removeChild(textArea);
        return success;
      }
    } catch (err) {
      console.error('Failed to copy text: ', err);
      return false;
    }
  }

  static async readFromClipboard(): Promise<string | null> {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        return await navigator.clipboard.readText();
      } else {
        return null;
      }
    } catch (err) {
      console.error('Failed to read clipboard contents: ', err);
      return null;
    }
  }

  /**
   * Event handling with cleanup
   */
  static addEventListener(
    element: EventTarget,
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions
  ): () => void {
    element.addEventListener(type, listener, options);
    return () => element.removeEventListener(type, listener, options);
  }

  static onceEventListener(
    element: EventTarget,
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions
  ): void {
    element.addEventListener(type, listener, { ...options, once: true });
  }

  /**
   * Animation utilities
   */
  static async animateElement(
    element: HTMLElement,
    keyframes: Keyframe[],
    options?: KeyframeAnimationOptions
  ): Promise<Animation> {
    return element.animate(keyframes, options);
  }

  static async fadeIn(element: HTMLElement, duration: number = 300): Promise<void> {
    element.style.opacity = '0';
    element.style.display = 'block';
    
    return new Promise(resolve => {
      setTimeout(() => {
        element.style.transition = `opacity ${duration}ms ease-in-out`;
        element.style.opacity = '1';
        setTimeout(resolve, duration);
      }, 10);
    });
  }

  static async fadeOut(element: HTMLElement, duration: number = 300): Promise<void> {
    element.style.transition = `opacity ${duration}ms ease-in-out`;
    element.style.opacity = '0';
    
    return new Promise(resolve => {
      setTimeout(() => {
        element.style.display = 'none';
        resolve();
      }, duration);
    });
  }

  /**
   * Responsive utilities
   */
  static isMobile(): boolean {
    return window.matchMedia('(max-width: 768px)').matches;
  }

  static isTablet(): boolean {
    return window.matchMedia('(min-width: 769px) and (max-width: 1024px)').matches;
  }

  static isDesktop(): boolean {
    return window.matchMedia('(min-width: 1025px)').matches;
  }

  static getWindowSize(): { width: number; height: number } {
    return {
      width: window.innerWidth,
      height: window.innerHeight
    };
  }
}

/**
 * Enhanced Storage Utilities
 */
export namespace StorageUtils {
  /**
   * Local storage with type safety and error handling
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

  static getItem<T>(key: string, defaultValue?: T): T | null {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue || null;
    } catch (error) {
      console.error(`Failed to get localStorage item "${key}":`, error);
      return defaultValue || null;
    }
  }

  static removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Failed to remove localStorage item "${key}":`, error);
      throw error;
    }
  }

  static clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Failed to clear localStorage:', error);
      throw error;
    }
  }

  static hasItem(key: string): boolean {
    try {
      return localStorage.getItem(key) !== null;
    } catch {
      return false;
    }
  }

  /**
   * Session storage with type safety and error handling
   */
  static setSessionItem<T>(key: string, value: T): void {
    try {
      const serializedValue = JSON.stringify(value);
      sessionStorage.setItem(key, serializedValue);
    } catch (error) {
      console.error(`Failed to set sessionStorage item "${key}":`, error);
      throw error;
    }
  }

  static getSessionItem<T>(key: string, defaultValue?: T): T | null {
    try {
      const item = sessionStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue || null;
    } catch (error) {
      console.error(`Failed to get sessionStorage item "${key}":`, error);
      return defaultValue || null;
    }
  }

  static removeSessionItem(key: string): void {
    try {
      sessionStorage.removeItem(key);
    } catch (error) {
      console.error(`Failed to remove sessionStorage item "${key}":`, error);
      throw error;
    }
  }

  /**
   * IndexedDB wrapper for complex data
   */
  static async indexedDBStore(dbName: string, version: number = 1) {
    const openReq = indexedDB.open(dbName, version);

    openReq.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains('store')) {
        db.createObjectStore('store', { keyPath: 'id' });
      }
    };

    const db = await new Promise<IDBDatabase>((resolve, reject) => {
      openReq.onsuccess = () => resolve(openReq.result);
      openReq.onerror = () => reject(openReq.error);
    });

    return {
      set: async (key: string, value: any) => {
        const tx = db.transaction('store', 'readwrite');
        const store = tx.objectStore('store');
        return new Promise<void>((resolve, reject) => {
          const req = store.put({ id: key, value });
          req.onsuccess = () => resolve();
          req.onerror = () => reject(req.error);
        });
      },
      
      get: async (key: string) => {
        const tx = db.transaction('store', 'readonly');
        const store = tx.objectStore('store');
        return new Promise<any>((resolve, reject) => {
          const req = store.get(key);
          req.onsuccess = () => resolve(req.result?.value || null);
          req.onerror = () => reject(req.error);
        });
      },
      
      delete: async (key: string) => {
        const tx = db.transaction('store', 'readwrite');
        const store = tx.objectStore('store');
        return new Promise<void>((resolve, reject) => {
          const req = store.delete(key);
          req.onsuccess = () => resolve();
          req.onerror = () => reject(req.error);
        });
      }
    };
  }
}

/**
 * Enhanced Data Utilities
 */
export namespace DataUtils {
  /**
   * Deep cloning
   */
  static deepClone<T>(obj: T): T {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj.getTime()) as any;
    if (obj instanceof Array) return obj.map(item => DataUtils.deepClone(item)) as any;
    if (typeof obj === 'object') {
      const cloned: any = {};
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          cloned[key] = DataUtils.deepClone(obj[key]);
        }
      }
      return cloned;
    }
    return obj;
  }

  /**
   * Object manipulation
   */
  static mergeDeep<T>(target: T, source: Partial<T>): T {
    const output = { ...target };
    if (DataUtils.isObject(target) && DataUtils.isObject(source)) {
      Object.keys(source).forEach(key => {
        if (DataUtils.isObject(source[key])) {
          if (!(key in target)) {
            Object.assign(output, { [key]: source[key] });
          } else {
            output[key] = DataUtils.mergeDeep(target[key], source[key]);
          }
        } else {
          Object.assign(output, { [key]: source[key] });
        }
      });
    }
    return output;
  }

  private static isObject(item: any): boolean {
    return (item && typeof item === 'object' && !Array.isArray(item));
  }

  /**
   * Array utilities
   */
  static unique<T>(array: T[]): T[] {
    return Array.from(new Set(array));
  }

  static shuffle<T>(array: T[]): T[] {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }

  static chunk<T>(array: T[], size: number): T[][] {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }

  static groupBy<T>(array: T[], key: keyof T | ((item: T) => string)): Record<string, T[]> {
    return array.reduce((acc, item) => {
      const groupKey = typeof key === 'function' ? key(item) : String(item[key]);
      acc[groupKey] = acc[groupKey] || [];
      acc[groupKey].push(item);
      return acc;
    }, {} as Record<string, T[]>);
  }

  /**
   * Data validation
   */
  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static validateUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  static sanitizeHtml(html: string): string {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || doc.body.innerHTML || '';
  }

  /**
   * Type checking utilities
   */
  static isString(value: any): value is string {
    return typeof value === 'string';
  }

  static isNumber(value: any): value is number {
    return typeof value === 'number' && !isNaN(value);
  }

  static isArray(value: any): value is any[] {
    return Array.isArray(value);
  }

  static isObject(value: any): value is object {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
  }

  static isFunction(value: any): value is Function {
    return typeof value === 'function';
  }

  static isEmpty(value: any): boolean {
    if (value === null || value === undefined) return true;
    if (typeof value === 'string' || Array.isArray(value)) return value.length === 0;
    if (typeof value === 'object') return Object.keys(value).length === 0;
    return false;
  }
}

/**
 * Enhanced HTTP/Fetch Utilities
 */
export namespace HttpUtils {
  /**
   * HTTP methods with type safety
   */
  static async get<T = any>(url: string, options?: RequestInit): Promise<T> {
    return HttpUtils.request<T>('GET', url, undefined, options);
  }

  static async post<T = any, D = any>(url: string, data?: D, options?: RequestInit): Promise<T> {
    return HttpUtils.request<T>('POST', url, data, options);
  }

  static async put<T = any, D = any>(url: string, data?: D, options?: RequestInit): Promise<T> {
    return HttpUtils.request<T>('PUT', url, data, options);
  }

  static async patch<T = any, D = any>(url: string, data?: D, options?: RequestInit): Promise<T> {
    return HttpUtils.request<T>('PATCH', url, data, options);
  }

  static async delete<T = any>(url: string, options?: RequestInit): Promise<T> {
    return HttpUtils.request<T>('DELETE', url, undefined, options);
  }

  /**
   * Generic request method
   */
  static async request<T = any>(
    method: string,
    url: string,
    data?: any,
    options: RequestInit = {}
  ): Promise<T> {
    const config: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };

    if (data && ['POST', 'PUT', 'PATCH'].includes(method)) {
      config.body = typeof data === 'string' ? data : JSON.stringify(data);
    }

    const response = await fetch(url, config);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return response.json();
    } else {
      return response.text() as any;
    }
  }

  /**
   * Download utility
   */
  static async download(url: string, filename?: string): Promise<void> {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Download failed: ${response.statusText}`);
    }

    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename || url.split('/').pop() || 'download';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
  }

  /**
   * Upload utility
   */
  static async upload(
    url: string,
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable && onProgress) {
          onProgress(event.loaded / event.total);
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText);
            resolve(response);
          } catch {
            resolve(xhr.responseText);
          }
        } else {
          reject(new Error(`Upload failed: ${xhr.statusText}`));
        }
      });

      xhr.addEventListener('error', () => {
        reject(new Error('Upload failed'));
      });

      xhr.open('POST', url);
      xhr.send(formData);
    });
  }
}

/**
 * Enhanced State Management Utilities
 */
export namespace StateUtils {
  /**
   * Simple reactive state management
   */
  static createState<T>(initialState: T) {
    let state = initialState;
    const listeners: ((newState: T, prevState: T) => void)[] = [];

    return {
      get: (): T => state,
      set: (partialState: Partial<T> | ((prevState: T) => Partial<T>)): void => {
        const prevState = state;
        const newState = typeof partialState === 'function' 
          ? { ...state, ...partialState(state) } 
          : { ...state, ...partialState };
        
        state = newState;
        
        listeners.forEach(listener => {
          try {
            listener(state, prevState);
          } catch (error) {
            console.error('State listener error:', error);
          }
        });
      },
      subscribe: (listener: (newState: T, prevState: T) => void): (() => void) => {
        listeners.push(listener);
        return () => {
          const index = listeners.indexOf(listener);
          if (index > -1) {
            listeners.splice(index, 1);
          }
        };
      }
    };
  }

  /**
   * Local storage backed state
   */
  static createPersistedState<T>(key: string, initialState: T) {
    const savedState = StorageUtils.getItem<T>(key);
    const stateManager = StateUtils.createState(savedState || initialState);

    // Subscribe to changes and persist to localStorage
    stateManager.subscribe((newState) => {
      StorageUtils.setItem(key, newState);
    });

    return stateManager;
  }
}

/**
 * Enhanced Utility Functions
 */
export namespace Utils {
  /**
   * Debounce function
   */
  static debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout | null = null;
    return function executedFunction(...args: Parameters<T>): void {
      const later = () => {
        timeout = null;
        func(...args);
      };
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  /**
   * Throttle function
   */
  static throttle<T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): (...args: Parameters<T>) => void {
    let inThrottle: boolean;
    return function executedFunction(...args: Parameters<T>): void {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  /**
   * Sleep/pause utility
   */
  static sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Retry utility
   */
  static async retry<T>(
    fn: () => Promise<T>,
    retries: number = 3,
    delay: number = 1000
  ): Promise<T> {
    for (let i = 0; i < retries; i++) {
      try {
        return await fn();
      } catch (error) {
        if (i === retries - 1) throw error;
        await Utils.sleep(delay * Math.pow(2, i)); // Exponential backoff
      }
    }
    throw new Error('Retry failed');
  }

  /**
   * UUID generator
   */
  static uuid(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  /**
   * Format utilities
   */
  static formatBytes(bytes: number, decimals = 2): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  static formatDate(date: Date | string | number, options?: Intl.DateTimeFormatOptions): string {
    return new Date(date).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      ...options
    });
  }

  /**
   * String utilities
   */
  static capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  static camelCase(str: string): string {
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    }).replace(/\s+/g, '');
  }

  static snakeCase(str: string): string {
    return str.replace(/\W+/g, ' ').split(/ |\B(?=[A-Z])/).map(word => word.toLowerCase()).join('_');
  }

  static titleCase(str: string): string {
    return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  }
}