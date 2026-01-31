/**
 * Shared utilities that can be used in both main and renderer processes
 * These are platform-agnostic utilities that don't depend on Electron or DOM APIs
 */

/**
 * Type utilities and type guards
 */
export namespace TypeUtils {
  /**
   * Check if a value is a plain object (not array, not null, not date)
   */
  export function isPlainObject(value: unknown): value is Record<string, unknown> {
    return (
      value !== null &&
      typeof value === 'object' &&
      !Array.isArray(value) &&
      !(value instanceof Date)
    );
  }

  /**
   * Check if a value is a non-null object
   */
  export function isObject(value: unknown): value is object {
    return value !== null && typeof value === 'object';
  }

  /**
   * Check if a value is a string
   */
  export function isString(value: unknown): value is string {
    return typeof value === 'string';
  }

  /**
   * Check if a value is a number
   */
  export function isNumber(value: unknown): value is number {
    return typeof value === 'number' && !isNaN(value);
  }

  /**
   * Check if a value is a boolean
   */
  export function isBoolean(value: unknown): value is boolean {
    return typeof value === 'boolean';
  }

  /**
   * Check if a value is a function
   */
  export function isFunction(value: unknown): value is Function {
    return typeof value === 'function';
  }

  /**
   * Check if a value is defined (not null and not undefined)
   */
  export function isDefined<T>(value: T | null | undefined): value is T {
    return value !== null && value !== undefined;
  }

  /**
   * Type-safe object keys
   */
  export function keys<T extends Record<string, unknown>>(obj: T): Array<keyof T> {
    return Object.keys(obj) as Array<keyof T>;
  }

  /**
   * Type-safe object entries
   */
  export function entries<T extends Record<string, unknown>>(obj: T): Array<[string, T[string]]> {
    return Object.entries(obj) as Array<[string, T[string]]>;
  }

  /**
   * Type-safe object values
   */
  export function values<T extends Record<string, unknown>>(obj: T): Array<T[string]> {
    return Object.values(obj) as Array<T[string]>;
  }

  /**
   * Deep partial type
   */
  export type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
  };

  /**
   * Omit by type
   */
  export type OmitByType<T, V> = Omit<T, { [K in keyof T]: T[K] extends V ? K : never }[keyof T]>;
}

/**
 * String manipulation utilities
 */
export namespace StringUtils {
  /**
   * Capitalize the first letter of a string
   */
  export function capitalize(str: string): string {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  /**
   * Convert string to camelCase
   */
  export function camelCase(str: string): string {
    return str
      .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
        return index === 0 ? word.toLowerCase() : word.toUpperCase();
      })
      .replace(/\s+/g, '');
  }

  /**
   * Convert string to snake_case
   */
  export function snakeCase(str: string): string {
    return str
      .replace(/\W+/g, ' ')
      .split(/ |\B(?=[A-Z])/)
      .map((word) => word.toLowerCase())
      .join('_');
  }

  /**
   * Convert string to Title Case
   */
  export function titleCase(str: string): string {
    return str
      .toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  /**
   * Convert string to kebab-case
   */
  export function kebabCase(str: string): string {
    return str
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .replace(/[\s_]+/g, '-')
      .toLowerCase();
  }

  /**
   * Pluralize a word based on count
   */
  export function pluralize(count: number, singular: string, plural?: string): string {
    return count === 1 ? singular : plural || singular + 's';
  }

  /**
   * Truncate string to specified length with ellipsis
   */
  export function truncate(str: string, length: number, suffix = '...'): string {
    if (str.length <= length) return str;
    return str.substring(0, length - suffix.length) + suffix;
  }

  /**
   * Remove extra whitespace from string
   */
  export function trim(str: string, chars = ' \\t\\n\\r'): string {
    const regex = new RegExp(`^[${chars}]+|[${chars}]+$`, 'g');
    return str.replace(regex, '');
  }

  /**
   * Generate random string
   */
  export function random(length = 10): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * Escape HTML entities
   */
  export function escapeHtml(text: string): string {
    const map: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;',
    };
    return text.replace(/[&<>"']/g, (m) => map[m]);
  }

  /**
   * Strip HTML tags from string
   */
  export function stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, '');
  }

  /**
   * Slugify a string for URLs
   */
  export function slugify(str: string): string {
    return str
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
}

/**
 * Array manipulation utilities
 */
export namespace ArrayUtils {
  /**
   * Remove duplicates from array
   */
  export function unique<T>(arr: T[]): T[] {
    return [...new Set(arr)];
  }

  /**
   * Remove duplicates based on a key function
   */
  export function uniqueBy<T, K>(arr: T[], keyFn: (item: T) => K): T[] {
    const seen = new Set<K>();
    return arr.filter((item) => {
      const key = keyFn(item);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  /**
   * Group array items by a key
   */
  export function groupBy<T, K>(arr: T[], keyFn: (item: T) => K): Record<string, T[]> {
    return arr.reduce(
      (groups, item) => {
        const key = String(keyFn(item));
        if (!groups[key]) groups[key] = [];
        groups[key].push(item);
        return groups;
      },
      {} as Record<string, T[]>
    );
  }

  /**
   * Chunk array into smaller arrays
   */
  export function chunk<T>(arr: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < arr.length; i += size) {
      chunks.push(arr.slice(i, i + size));
    }
    return chunks;
  }

  /**
   * Flatten nested array
   */
  export function flatten<T>(arr: (T | T[])[]): T[] {
    return arr.reduce<T[]>((flat, item) => {
      return flat.concat(Array.isArray(item) ? flatten(item) : item);
    }, []);
  }

  /**
   * Get random item from array
   */
  export function sample<T>(arr: T[]): T | undefined {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  /**
   * Get random items from array
   */
  export function sampleSize<T>(arr: T[], n: number): T[] {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(n, arr.length));
  }

  /**
   * Shuffle array
   */
  export function shuffle<T>(arr: T[]): T[] {
    const shuffled = [...arr];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  /**
   * Find intersection of two arrays
   */
  export function intersection<T>(arr1: T[], arr2: T[]): T[] {
    return arr1.filter((item) => arr2.includes(item));
  }

  /**
   * Find difference between two arrays
   */
  export function difference<T>(arr1: T[], arr2: T[]): T[] {
    return arr1.filter((item) => !arr2.includes(item));
  }

  /**
   * Check if array includes all values from another array
   */
  export function includesAll<T>(arr: T[], values: T[]): boolean {
    return values.every((value) => arr.includes(value));
  }

  /**
   * Sort array by key
   */
  export function sortBy<T>(arr: T[], key: keyof T, order: 'asc' | 'desc' = 'asc'): T[] {
    return [...arr].sort((a, b) => {
      const aVal = a[key];
      const bVal = b[key];

      if (aVal < bVal) return order === 'asc' ? -1 : 1;
      if (aVal > bVal) return order === 'asc' ? 1 : -1;
      return 0;
    });
  }
}

/**
 * Function utilities
 */
export namespace FunctionUtils {
  /**
   * Debounce function to limit the rate at which a function can fire
   */
  export function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number,
    immediate = false
  ): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout | null = null;
    return function executedFunction(...args: Parameters<T>): void {
      const later = () => {
        timeout = null;
        if (!immediate) func(...args);
      };
      const callNow = immediate && !timeout;
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func(...args);
    };
  }

  /**
   * Throttle function to ensure it's only called once per interval
   */
  export function throttle<T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): (...args: Parameters<T>) => void {
    let inThrottle = false;
    return function executedFunction(...args: Parameters<T>): void {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => {
          inThrottle = false;
        }, limit);
      }
    };
  }

  /**
   * Create a function that can only be called once
   */
  export function once<T extends (...args: any[]) => any>(func: T): T {
    let called = false;
    let result: any;
    return function executedFunction(...args: Parameters<T>): any {
      if (!called) {
        called = true;
        result = func(...args);
      }
      return result;
    } as T;
  }

  /**
   * Compose multiple functions
   */
  export function compose<T>(...funcs: Array<(arg: T) => T>): (arg: T) => T {
    return funcs.reduce((a, b) => (arg) => a(b(arg)));
  }

  /**
   * Pipe multiple functions
   */
  export function pipe<T>(...funcs: Array<(arg: T) => T>): (arg: T) => T {
    return funcs.reduce((a, b) => (arg) => b(a(arg)));
  }

  /**
   * Memoize function results
   */
  export function memoize<T extends (...args: any[]) => any>(
    func: T,
    keyFn?: (...args: Parameters<T>) => string
  ): T {
    const cache = new Map<string, ReturnType<T>>();

    return function executedFunction(...args: Parameters<T>): ReturnType<T> {
      const key = keyFn ? keyFn(...args) : JSON.stringify(args);
      if (cache.has(key)) {
        return cache.get(key)!;
      }
      const result = func(...args);
      cache.set(key, result);
      return result;
    } as T;
  }
}

/**
 * Number utilities
 */
export namespace NumberUtils {
  /**
   * Format bytes to human readable format
   */
  export function formatBytes(bytes: number, decimals = 2): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / k ** i).toFixed(dm)) + ' ' + sizes[i];
  }

  /**
   * Clamp a number between min and max
   */
  export function clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
  }

  /**
   * Map a number from one range to another
   */
  export function map(
    value: number,
    fromMin: number,
    fromMax: number,
    toMin: number,
    toMax: number
  ): number {
    return ((value - fromMin) * (toMax - toMin)) / (fromMax - fromMin) + toMin;
  }

  /**
   * Check if a number is in range
   */
  export function inRange(value: number, min: number, max: number): boolean {
    return value >= min && value <= max;
  }

  /**
   * Generate random number in range
   */
  export function random(min = 0, max = 1): number {
    return Math.random() * (max - min) + min;
  }

  /**
   * Round to specific precision
   */
  export function round(value: number, precision = 0): number {
    const factor = 10 ** precision;
    return Math.round(value * factor) / factor;
  }

  /**
   * Convert to Roman numerals
   */
  export function toRoman(num: number): string {
    const romans = [
      { value: 1000, numeral: 'M' },
      { value: 900, numeral: 'CM' },
      { value: 500, numeral: 'D' },
      { value: 400, numeral: 'CD' },
      { value: 100, numeral: 'C' },
      { value: 90, numeral: 'XC' },
      { value: 50, numeral: 'L' },
      { value: 40, numeral: 'XL' },
      { value: 10, numeral: 'X' },
      { value: 9, numeral: 'IX' },
      { value: 5, numeral: 'V' },
      { value: 4, numeral: 'IV' },
      { value: 1, numeral: 'I' },
    ];

    let result = '';
    let remaining = num;

    for (const { value, numeral } of romans) {
      while (remaining >= value) {
        result += numeral;
        remaining -= value;
      }
    }

    return result;
  }
}

/**
 * Date utilities
 */
export namespace DateUtils {
  /**
   * Format date to readable string
   */
  export function format(
    date: Date | string | number,
    options: Intl.DateTimeFormatOptions = {}
  ): string {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      ...options,
    });
  }

  /**
   * Get relative time string
   */
  export function timeAgo(date: Date | string | number): string {
    const dateObj = new Date(date);
    const now = new Date();
    const diffMs = now.getTime() - dateObj.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSecs < 60) return 'just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  }

  /**
   * Add days to date
   */
  export function addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  /**
   * Subtract days from date
   */
  export function subtractDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() - days);
    return result;
  }

  /**
   * Get start of day
   */
  export function startOfDay(date: Date): Date {
    const result = new Date(date);
    result.setHours(0, 0, 0, 0);
    return result;
  }

  /**
   * Get end of day
   */
  export function endOfDay(date: Date): Date {
    const result = new Date(date);
    result.setHours(23, 59, 59, 999);
    return result;
  }

  /**
   * Check if dates are same day
   */
  export function isSameDay(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }
}

/**
 * Validation utilities
 */
export namespace ValidationUtils {
  /**
   * Validate email format
   */
  export function isEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate URL format
   */
  export function isUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Validate phone number format
   */
  export function isPhone(phone: string): boolean {
    const phoneRegex = /^\+?[\d\s-()]{10,}$/;
    return phoneRegex.test(phone);
  }

  /**
   * Validate strong password
   */
  export function isStrongPassword(password: string): boolean {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const isLongEnough = password.length >= 8;

    return (
      [hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar, isLongEnough].filter(Boolean)
        .length >= 3
    );
  }

  /**
   * Validate credit card number
   */
  export function isCreditCard(cardNumber: string): boolean {
    const cleaned = cardNumber.replace(/\D/g, '');
    const luhnCheck = (num: string): boolean => {
      let sum = 0;
      let isEven = false;

      for (let i = num.length - 1; i >= 0; i--) {
        let digit = parseInt(num[i], 10);
        if (isEven) digit *= 2;
        if (digit > 9) digit -= 9;
        sum += digit;
        isEven = !isEven;
      }

      return sum % 10 === 0;
    };

    return cleaned.length >= 13 && cleaned.length <= 19 && luhnCheck(cleaned);
  }

  /**
   * Validate hexadecimal color
   */
  export function isHexColor(color: string): boolean {
    const hexRegex = /^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;
    return hexRegex.test(color);
  }

  /**
   * Validate IPv4 address
   */
  export function isIPv4(ip: string): boolean {
    const ipv4Regex =
      /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    return ipv4Regex.test(ip);
  }

  /**
   * Validate MAC address
   */
  export function isMacAddress(mac: string): boolean {
    const macRegex = /^([0-9a-fA-F]{2}[:-]){5}([0-9a-fA-F]{2})$/;
    return macRegex.test(mac);
  }
}

/**
 * Color utilities
 */
export namespace ColorUtils {
  /**
   * Generate random color
   */
  export function random(): string {
    return `#${Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, '0')}`;
  }

  /**
   * Convert hex to RGB
   */
  export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  }

  /**
   * Convert RGB to hex
   */
  export function rgbToHex(r: number, g: number, b: number): string {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  }

  /**
   * Get color luminance
   */
  export function getLuminance(hex: string): number {
    const rgb = hexToRgb(hex);
    if (!rgb) return 0;

    const { r, g, b } = rgb;
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance;
  }

  /**
   * Get contrasting text color
   */
  export function getContrastColor(hex: string): string {
    const luminance = getLuminance(hex);
    return luminance > 0.5 ? '#000000' : '#ffffff';
  }

  /**
   * Generate color palette
   */
  export function generatePalette(baseColor: string, count = 5): string[] {
    const palette = [baseColor];
    const rgb = hexToRgb(baseColor);

    if (!rgb) return palette;

    const { r, g, b } = rgb;
    const step = 1 / (count + 1);

    for (let i = 1; i < count; i++) {
      const factor = step * i;
      const newR = Math.round(r + (255 - r) * factor);
      const newG = Math.round(g + (255 - g) * factor);
      const newB = Math.round(b + (255 - b) * factor);
      palette.push(rgbToHex(newR, newG, newB));
    }

    return palette;
  }
}

/**
 * Generate unique ID
 */
export function generateId(length = 8): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Wait for specified amount of time
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Check if value is empty
 */
export function isEmpty(value: unknown): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string' || Array.isArray(value)) return value.length === 0;
  if (TypeUtils.isObject(value)) return Object.keys(value).length === 0;
  return false;
}
