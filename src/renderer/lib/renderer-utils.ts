/**
 * Renderer process utilities for Electron applications
 * These utilities work in browser/renderer process environment
 */

/**
 * DOM and browser utilities
 */
export namespace DOMUtils {
  /**
   * Wait for DOM to be ready
   */
  export function ready(callback: () => void): void {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  }

  /**
   * Create element with attributes
   */
  export function createElement(tagName: string, attributes?: Record<string, string>): HTMLElement {
    const element = document.createElement(tagName);
    
    if (attributes) {
      Object.entries(attributes).forEach(([key, value]) => {
        element.setAttribute(key, value);
      });
    }
    
    return element;
  }

  /**
   * Add event listener with automatic cleanup
   */
  export function addEventListener(
    element: HTMLElement,
    type: string,
    listener: (event: Event) => void,
    options?: boolean
  ): () => void {
    element.addEventListener(type, listener, options);
    
    return () => {
      element.removeEventListener(type, listener);
    };
  }

  /**
   * Find element by selector
   */
  export function querySelector(selector: string): HTMLElement | null {
    return document.querySelector(selector);
  }

  /**
   * Find all elements by selector
   */
  export function querySelectorAll(selector: string): HTMLElement[] {
    const elements = document.querySelectorAll(selector);
    return Array.from(elements) as HTMLElement[];
  }

  /**
   * Check if element is visible in viewport
   */
  export function isInViewport(element: HTMLElement): boolean {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= window.innerHeight &&
      rect.right <= window.innerWidth
    );
  }

  /**
   * Focus element
   */
  export function focus(element: HTMLElement): void {
    element.focus();
  }

  /**
   * Copy text to clipboard
   */
  export async function copyToClipboard(text: string): Promise<void> {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
    } else if (document.execCommand) {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    } else {
      throw new Error('Clipboard API not available');
    }
  }

  /**
   * Open URL in new window
   */
  export function openWindow(url: string, features?: string): Window | null {
    return window.open(url, '_blank', features);
  }

  /**
   * Get window dimensions
   */
  export function getWindowSize(): { width: number; height: number } {
    return {
      width: window.innerWidth,
      height: window.innerHeight
    };
  }

  /**
   * Check if device is mobile
   */
  export function isMobile(): boolean {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  /**
   * Check if device is desktop
   */
  export function isDesktop(): boolean {
    return !isMobile();
  }
}

/**
 * LocalStorage utilities for renderer
 */
export namespace StorageUtils {
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
}

/**
 * Event utilities for renderer
 */
export namespace EventUtils {
  /**
   * Create custom event
   */
  export function createEvent(type: string): Event {
    return new Event(type);
  }

  /**
   * Dispatch custom event
   */
  export function dispatchEvent(target: EventTarget, type: string): void {
    const event = createEvent(type);
    target.dispatchEvent(event);
  }

  /**
   * Add event listener with automatic cleanup
   */
  export function addEventListener(
    target: EventTarget,
    type: string,
    listener: (event: Event) => void,
    options?: boolean
  ): () => void {
    target.addEventListener(type, listener, options);
    
    return () => {
      target.removeEventListener(type, listener);
    };
  }

  /**
   * Debounce event handler
   */
  export function debounceEvent(
    handler: (event: Event) => void,
    delay: number
  ): (event: Event) => void {
    let timeoutId: number | null = null;
    
    return (Event: Event) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      
      timeoutId = window.setTimeout(() => {
        handler(Event);
        timeoutId = null;
      }, delay);
    };
  }
}

/**
 * Animation utilities for renderer
 */
export namespace AnimationUtils {
  /**
   * Fade in element
   */
  export function fadeIn(element: HTMLElement, duration = 300): Promise<void> {
    element.style.opacity = '0';
    element.style.display = 'block';
    element.style.transition = `opacity ${duration}ms ease-in-out`;
    
    return new Promise((resolve) => {
      setTimeout(() => {
        element.style.opacity = '1';
        setTimeout(resolve, duration + 50);
      }, 50);
    });
  }

  /**
   * Fade out element
   */
  export function fadeOut(element: HTMLElement, duration = 300): Promise<void> {
    element.style.transition = `opacity ${duration}ms ease-in-out`;
    
    return new Promise((resolve) => {
      element.style.opacity = '0';
      setTimeout(resolve, duration + 50);
    });
  }
}

/**
 * Browser and environment detection utilities
 */
export namespace BrowserUtils {
  /**
   * Get browser information
   */
  export function getBrowserInfo(): {
    name: string;
    version: string;
    isChrome: boolean;
    isFirefox: boolean;
    isSafari: boolean;
    isEdge: boolean;
  } {
    const ua = navigator.userAgent;
    
    return {
      name: getBrowserName(ua),
      version: getBrowserVersion(ua),
      isChrome: /Chrome/.test(ua),
      isFirefox: /Firefox/.test(ua),
      isSafari: /Safari/.test(ua) && !/Chrome/.test(ua),
      isEdge: /Edge/.test(ua)
    };
  }

  /**
   * Get browser name
   */
  function getBrowserName(ua: string): string {
    if (ua.includes('Chrome')) return 'Chrome';
    if (ua.includes('Firefox')) return 'Firefox';
    if (ua.includes('Safari')) return 'Safari';
    if (ua.includes('Edge')) return 'Edge';
    if (ua.includes('Opera')) return 'Opera';
    
    return 'Unknown';
  }

  /**
   * Get browser version
   */
  function getBrowserVersion(ua: string): string {
    const match = ua.match(/(Chrome|Firefox|Safari|Edge|Opera)\\/(\\d+)/);
    return match ? match[2] : '0';
  }

  /**
   * Check if online
   */
  export function isOnline(): boolean {
    return navigator.onLine !== false;
  }

  /**
   * Get preferred language
   */
  export function getLanguage(): string {
    return navigator.language || (navigator as any).userLanguage || 'en';
  }

  /**
   * Check if touch device
   */
  export function isTouchDevice(): boolean {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }
}

/**
 * Theme utilities for renderer
 */
export namespace ThemeUtils {
  /**
   * Generate theme based on title hash
   */
  export function generateTheme(title: string): { bg: string; color: string } {
    const themes = [
      { bg: '#4a6cf7', color: 'white' },
      { bg: '#4ade80', color: 'black' },
      { bg: '#a78bfa', color: 'white' },
      { bg: '#f87171', color: 'white' },
      { bg: '#fbbf24', color: 'black' },
      { bg: '#6366f1', color: 'white' },
      { bg: '#ec4899', color: 'white' },
      { bg: '#14b8a6', color: 'white' },
      { bg: '#f97316', color: 'white' },
      { bg: '#6b7280', color: 'white' },
    ];

    let hash = 0;
    const lowerTitle = title.toLowerCase();
    for (let i = 0; i < lowerTitle.length; i++) {
      hash = lowerTitle.charCodeAt(i) + ((hash << 5) - hash);
    }

    const index = Math.abs(hash) % themes.length;
    return themes[index];
  }

  /**
   * Apply theme to element
   */
  export function applyTheme(element: HTMLElement, theme: { bg: string; color: string }): void {
    element.style.backgroundColor = theme.bg;
    element.style.color = theme.color;
  }
}