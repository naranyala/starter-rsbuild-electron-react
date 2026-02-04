/// <reference types="bun" />

import { describe, expect, test } from 'bun:test';

describe('Input Validation Security Tests', () => {
  test('should sanitize HTML to prevent XSS', () => {
    const sanitizeHTML = (input: string) => {
      // Simple HTML sanitization function
      return input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                 .replace(/javascript:/gi, '')
                 .replace(/on\w+="[^"]*"/gi, '');
    };

    const maliciousInput = '<script>alert("XSS")</script><img src="x" onerror="alert(\'XSS\')">';
    const sanitized = sanitizeHTML(maliciousInput);
    
    expect(sanitized).not.toContain('<script>');
    expect(sanitized).not.toContain('javascript:');
    expect(sanitized).not.toContain('onerror=');
    expect(sanitized).toBe('<img src="x" >');
  });

  test('should validate email format to prevent injection', () => {
    const validateEmail = (email: string) => {
      // More restrictive email regex that requires at least one dot in the domain part
      const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])+)+$/;
      return emailRegex.test(email);
    };

    expect(validateEmail('valid@example.com')).toBe(true);
    expect(validateEmail('user@domain.co.uk')).toBe(true);
    expect(validateEmail('user+tag@example.org')).toBe(true);

    // Invalid emails
    expect(validateEmail('invalid-email')).toBe(false);
    expect(validateEmail('user@')).toBe(false);
    expect(validateEmail('@domain.com')).toBe(false);
    expect(validateEmail('user@domain')).toBe(false); // Missing TLD
    expect(validateEmail('user@domain..com')).toBe(false);
    expect(validateEmail('user;@domain.com')).toBe(false);
  });

  test('should validate URL format to prevent open redirects', () => {
    const validateUrl = (url: string) => {
      try {
        const parsed = new URL(url);
        // Only allow http and https protocols
        return parsed.protocol === 'http:' || parsed.protocol === 'https:';
      } catch {
        return false;
      }
    };

    expect(validateUrl('https://example.com')).toBe(true);
    expect(validateUrl('http://example.com')).toBe(true);
    
    // Invalid URLs
    expect(validateUrl('javascript:alert(1)')).toBe(false);
    expect(validateUrl('data:text/html,<script>alert(1)</script>')).toBe(false);
    expect(validateUrl('ftp://example.com')).toBe(false);
    expect(validateUrl('file:///etc/passwd')).toBe(false);
    expect(validateUrl('')).toBe(false);
  });

  test('should validate numeric inputs to prevent injection', () => {
    const validateNumber = (input: string) => {
      // Allow positive numbers, negative numbers, and decimals
      const numRegex = /^-?\d+(\.\d+)?$/;
      return numRegex.test(input) && !isNaN(Number(input));
    };

    expect(validateNumber('123')).toBe(true);
    expect(validateNumber('-456')).toBe(true);
    expect(validateNumber('123.45')).toBe(true);
    expect(validateNumber('-123.45')).toBe(true);
    
    // Invalid numbers
    expect(validateNumber('123abc')).toBe(false);
    expect(validateNumber('abc123')).toBe(false);
    expect(validateNumber('123;DROP TABLE users;')).toBe(false);
    expect(validateNumber('123 OR 1=1')).toBe(false);
    expect(validateNumber('NaN')).toBe(false);
    expect(validateNumber('Infinity')).toBe(false);
  });

  test('should validate file extensions to prevent malicious uploads', () => {
    const validateFileExtension = (filename: string, allowedExtensions: string[]) => {
      const ext = filename.split('.').pop()?.toLowerCase() || '';
      return allowedExtensions.includes(ext);
    };

    const allowedExts = ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'txt'];
    
    expect(validateFileExtension('document.pdf', allowedExts)).toBe(true);
    expect(validateFileExtension('image.jpg', allowedExts)).toBe(true);
    expect(validateFileExtension('photo.jpeg', allowedExts)).toBe(true);
    expect(validateFileExtension('file.txt', allowedExts)).toBe(true);
    
    // Disallowed extensions
    expect(validateFileExtension('script.exe', allowedExts)).toBe(false);
    expect(validateFileExtension('malware.bat', allowedExts)).toBe(false);
    expect(validateFileExtension('virus.js', allowedExts)).toBe(false);
    expect(validateFileExtension('trojan.php', allowedExts)).toBe(false);
  });

  test('should detect SQL injection patterns', () => {
    const detectSQLInjection = (input: string) => {
      const sqlPatterns = [
        /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION)\b)/i,
        /('|--|\/\*|\*\/|;|--)/,
        /(OR\s+1\s*=\s*1|AND\s+1\s*=\s*1)/i
      ];
      
      return sqlPatterns.some(pattern => pattern.test(input));
    };

    expect(detectSQLInjection("SELECT * FROM users WHERE id = 1")).toBe(true);
    expect(detectSQLInjection("admin' OR '1'='1")).toBe(true);
    expect(detectSQLInjection("user'; DROP TABLE users; --")).toBe(true);
    expect(detectSQLInjection("password' UNION SELECT * FROM admin --")).toBe(true);
    
    // Safe inputs
    expect(detectSQLInjection("username123")).toBe(false);
    expect(detectSQLInjection("normal text")).toBe(false);
    expect(detectSQLInjection("user-name")).toBe(false);
  });

  test('should validate JSON to prevent prototype pollution', () => {
    const safeParseJSON = (str: string) => {
      try {
        // Check for prototype pollution patterns
        if (str.includes('__proto__') || str.includes('constructor')) {
          throw new Error('Potential prototype pollution detected');
        }
        
        return JSON.parse(str);
      } catch (e) {
        throw new Error('Invalid JSON or potential security issue');
      }
    };

    expect(() => safeParseJSON('{"name": "John", "age": 30}')).not.toThrow();
    expect(() => safeParseJSON('{"__proto__": {"isAdmin": true}}')).toThrow();
    expect(() => safeParseJSON('{"constructor": {"prototype": {"isAdmin": true}}}')).toThrow();
  });

  test('should validate headers to prevent header injection', () => {
    const validateHeader = (headerValue: string) => {
      // Headers shouldn't contain newlines or carriage returns
      return !/[\r\n]/.test(headerValue);
    };

    expect(validateHeader('valid-header-value')).toBe(true);
    expect(validateHeader('value-with-dashes')).toBe(true);
    expect(validateHeader('value_with_underscores')).toBe(true);

    // Invalid headers
    expect(validateHeader('value\r\nInjection')).toBe(false);
    expect(validateHeader('value\nInjection')).toBe(false);
    expect(validateHeader('value\rInjection')).toBe(false);
  });
});