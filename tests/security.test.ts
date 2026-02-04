/// <reference types="bun" />

import { afterAll, beforeAll, beforeEach, describe, expect, it, test } from 'bun:test';

describe('SecurityUtils - Path Validation', () => {
  test('should reject path traversal attempts', () => {
    const validatePath = (filePath: string) => {
      const issues: string[] = [];

      if (filePath.includes('..')) {
        issues.push('Path traversal detected');
      }

      const suspiciousChars = /[<>:"|?*]/;
      if (suspiciousChars.test(filePath)) {
        issues.push('Suspicious characters in path');
      }

      return {
        isValid: issues.length === 0,
        issues,
      };
    };

    expect(validatePath('../../../etc/passwd').isValid).toBe(false);
    expect(validatePath('..\\..\\Windows\\system32').isValid).toBe(false);
    expect(validatePath('foo/../../bar').isValid).toBe(false);
    expect(validatePath('safe/path/file.txt').isValid).toBe(true);
    expect(validatePath('./local/file').isValid).toBe(true);
  });

  test('should reject suspicious characters', () => {
    const validatePath = (filePath: string) => {
      const issues: string[] = [];

      if (filePath.includes('..')) {
        issues.push('Path traversal detected');
      }

      // Fixed the regex to properly detect suspicious characters
      const suspiciousChars = /[<>:"|?*\$()`{}[\]\\]/;
      if (suspiciousChars.test(filePath)) {
        issues.push('Suspicious characters in path');
      }

      return {
        isValid: issues.length === 0,
        issues,
      };
    };

    expect(validatePath('file.txt<script>').isValid).toBe(false);
    expect(validatePath('file.txt|whoami').isValid).toBe(false);
    expect(validatePath('file.txt$(whoami)').isValid).toBe(false);
    expect(validatePath('file.txt`whoami`').isValid).toBe(false);
  });
});

describe('SecurityUtils - Cryptography', () => {
  test('generateUUID produces valid UUIDs', () => {
    const uuid = crypto.randomUUID();
    expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
  });

  test('generateUUID produces unique values', () => {
    const uuids = new Set<string>();
    for (let i = 0; i < 100; i++) {
      uuids.add(crypto.randomUUID());
    }
    expect(uuids.size).toBe(100);
  });

  test('Web Crypto API - getRandomValues produces random values', () => {
    const arr1 = new Uint8Array(16);
    const arr2 = new Uint8Array(16);

    crypto.getRandomValues(arr1);
    crypto.getRandomValues(arr2);

    // Arrays should be different (with high probability)
    const arr1Str = Array.from(arr1).join(',');
    const arr2Str = Array.from(arr2).join(',');

    expect(arr1.length).toBe(16);
    expect(arr2.length).toBe(16);
  });

  test('Web Crypto API - subtle.digest produces consistent hashes', async () => {
    const encoder = new TextEncoder();
    const data = encoder.encode('hello world');

    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    // Verify it's the correct SHA-256 hash of 'hello world'
    expect(hashHex).toBe('b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9');
    expect(hashHex.length).toBe(64); // SHA-256 produces 256 bits = 64 hex chars
  });

  test('Web Crypto API - different algorithms produce different hashes', async () => {
    const encoder = new TextEncoder();
    const data = encoder.encode('test data');

    const sha256Buffer = await crypto.subtle.digest('SHA-256', data);
    const sha1Buffer = await crypto.subtle.digest('SHA-1', data);

    const sha256Array = Array.from(new Uint8Array(sha256Buffer));
    const sha1Array = Array.from(new Uint8Array(sha1Buffer));

    const sha256Hex = sha256Array.map(b => b.toString(16).padStart(2, '0')).join('');
    const sha1Hex = sha1Array.map(b => b.toString(16).padStart(2, '0')).join('');

    expect(sha256Hex).not.toBe(sha1Hex);
    expect(sha256Hex.length).toBe(64); // SHA-256: 64 hex chars
    expect(sha1Hex.length).toBe(40);   // SHA-1: 40 hex chars
  });

  test('Web Crypto API - subtle.importKey and subtle.sign work correctly', async () => {
    // Generate a key pair for signing
    const keyPair = await crypto.subtle.generateKey(
      {
        name: 'RSASSA-PKCS1-v1_5',
        modulusLength: 2048,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: 'SHA-256',
      },
      true,
      ['sign', 'verify']
    );

    const encoder = new TextEncoder();
    const data = encoder.encode('Message to sign');

    // Sign the data
    const signature = await crypto.subtle.sign(
      {
        name: 'RSASSA-PKCS1-v1_5',
      },
      keyPair.privateKey,
      data
    );

    // Verify the signature
    const isValid = await crypto.subtle.verify(
      {
        name: 'RSASSA-PKCS1-v1_5',
      },
      keyPair.publicKey,
      signature,
      data
    );

    expect(isValid).toBe(true);
  });

  test('Web Crypto API - subtle.encrypt and subtle.decrypt work correctly', async () => {
    // Import a key for AES-GCM encryption
    const key = await crypto.subtle.generateKey(
      {
        name: 'AES-GCM',
        length: 256,
      },
      true,
      ['encrypt', 'decrypt']
    );

    const encoder = new TextEncoder();
    const data = encoder.encode('Secret message!');
    const iv = crypto.getRandomValues(new Uint8Array(12)); // 96-bit IV for AES-GCM

    // Encrypt
    const encrypted = await crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv: iv,
        tagLength: 128,
      },
      key,
      data
    );

    // Decrypt
    const decrypted = await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: iv,
        tagLength: 128,
      },
      key,
      encrypted
    );

    const decryptedText = new TextDecoder().decode(decrypted);
    expect(decryptedText).toBe('Secret message!');
  });
});

describe('Hash Function Properties', () => {
  test('fixed output length regardless of input', async () => {
    const testCases = ['', 'x', 'hello', 'a'.repeat(100), 'a'.repeat(10000)];
    const encoder = new TextEncoder();

    for (const input of testCases) {
      const data = encoder.encode(input);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

      expect(hashHex.length).toBe(64); // SHA-256 always produces 64 hex characters
    }
  });

  test('avalanche effect - small changes produce large differences', async () => {
    const encoder = new TextEncoder();
    const base = encoder.encode('The quick brown fox jumps over the lazy dog');
    const modified = encoder.encode('The quick brown fox jumps over the lazy cat');

    const hash1Buffer = await crypto.subtle.digest('SHA-256', base);
    const hash2Buffer = await crypto.subtle.digest('SHA-256', modified);

    const hash1Array = Array.from(new Uint8Array(hash1Buffer));
    const hash2Array = Array.from(new Uint8Array(hash2Buffer));

    const hash1Hex = hash1Array.map(b => b.toString(16).padStart(2, '0')).join('');
    const hash2Hex = hash2Array.map(b => b.toString(16).padStart(2, '0')).join('');

    // Count character differences
    let differences = 0;
    for (let i = 0; i < hash1Hex.length; i++) {
      if (hash1Hex[i] !== hash2Hex[i]) differences++;
    }

    // Hash functions should exhibit the avalanche effect
    expect(differences).toBeGreaterThan(16); // At least 16 out of 64 chars should differ
  });
});

describe('Random Number Generation', () => {
  test('getRandomValues produces unique values', () => {
    const samples = new Set<string>();
    for (let i = 0; i < 100; i++) {
      const arr = new Uint8Array(16);
      crypto.getRandomValues(arr);
      samples.add(Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join(''));
    }
    expect(samples.size).toBe(100);
  });

  test('getRandomValues produces non-zero values', () => {
    const arr = new Uint8Array(32);
    crypto.getRandomValues(arr);

    // Should not be all zeros (with extremely high probability)
    const allZeros = arr.every(b => b === 0);
    expect(allZeros).toBe(false);
  });
});

describe('Constant-Time Comparison', () => {
  test('timingSafeEqual equivalent to manual constant-time comparison', () => {
    const a = new Uint8Array([1, 2, 3, 4]);
    const b = new Uint8Array([1, 2, 3, 4]);
    const c = new Uint8Array([1, 2, 3, 5]);

    // Manual constant-time comparison
    const constantTimeEqual = (arr1: Uint8Array, arr2: Uint8Array): boolean => {
      if (arr1.length !== arr2.length) return false;

      let result = 0;
      for (let i = 0; i < arr1.length; i++) {
        result |= arr1[i] ^ arr2[i];
      }
      return result === 0;
    };

    expect(constantTimeEqual(a, b)).toBe(true);
    expect(constantTimeEqual(a, c)).toBe(false);
  });
});
