/// <reference types="bun" />

import { describe, expect, it, test } from 'bun:test';
import crypto from 'crypto';

describe('Path Security', () => {
  test('validatePath detects path traversal', () => {
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
    expect(validatePath('..\\..\\Windows').isValid).toBe(false);
    expect(validatePath('foo/../../bar').isValid).toBe(false);
    expect(validatePath('safe/path/file.txt').isValid).toBe(true);
    expect(validatePath('./local/file').isValid).toBe(true);
  });

  test('validatePath rejects suspicious characters', () => {
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

    expect(validatePath('file.txt<script>').isValid).toBe(false);
    expect(validatePath('file.txt|whoami').isValid).toBe(false);
    expect(validatePath('file.txt$(whoami)').isValid).toBe(false);
  });
});

describe('Cryptographic Operations', () => {
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

  test('generateRandomBytes produces correct length', () => {
    const bytes16 = crypto.randomBytes(16);
    const bytes32 = crypto.randomBytes(32);

    expect(bytes16.length).toBe(16);
    expect(bytes32.length).toBe(32);
  });

  test('hash produces consistent results', () => {
    const data = 'hello world';
    const hash1 = crypto.createHash('sha256').update(data).digest('hex');
    const hash2 = crypto.createHash('sha256').update(data).digest('hex');

    expect(hash1).toBe(hash2);
    expect(hash1.length).toBe(64);
  });

  test('different algorithms produce different hashes', () => {
    const data = 'test data';

    const sha256 = crypto.createHash('sha256').update(data).digest('hex');
    const sha512 = crypto.createHash('sha512').update(data).digest('hex');
    const md5 = crypto.createHash('md5').update(data).digest('hex');

    expect(sha256).not.toBe(sha512);
    expect(sha512.length).toBe(128);
    expect(md5.length).toBe(32);
  });

  test('HMAC produces consistent results', () => {
    const data = 'message';
    const key = 'secret-key';

    const hmac1 = crypto.createHmac('sha256', key).update(data).digest('hex');
    const hmac2 = crypto.createHmac('sha256', key).update(data).digest('hex');

    expect(hmac1).toBe(hmac2);
    expect(hmac1.length).toBe(64);
  });

  test('different keys produce different HMACs', () => {
    const data = 'message';

    const hmac1 = crypto.createHmac('sha256', 'key1').update(data).digest('hex');
    const hmac2 = crypto.createHmac('sha256', 'key2').update(data).digest('hex');

    expect(hmac1).not.toBe(hmac2);
  });

  test('encryption and decryption work correctly', () => {
    const algorithm = 'aes-256-cbc';
    const key = crypto.randomBytes(32);
    const iv = crypto.randomBytes(16);
    const original = 'Secret message!';

    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(original, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    expect(decrypted).toBe(original);
  });

  test('same plaintext produces different ciphertext with random IV', () => {
    const algorithm = 'aes-256-cbc';
    const key = crypto.randomBytes(32);
    const data = 'same data';

    const iv1 = crypto.randomBytes(16);
    const cipher1 = crypto.createCipheriv(algorithm, key, iv1);
    let encrypted1 = cipher1.update(data, 'utf8', 'hex');
    encrypted1 += cipher1.final('hex');

    const iv2 = crypto.randomBytes(16);
    const cipher2 = crypto.createCipheriv(algorithm, key, iv2);
    let encrypted2 = cipher2.update(data, 'utf8', 'hex');
    encrypted2 += cipher2.final('hex');

    expect(encrypted1).not.toBe(encrypted2);
  });

  test('wrong key fails decryption', () => {
    const algorithm = 'aes-256-cbc';
    const key1 = crypto.randomBytes(32);
    const key2 = crypto.randomBytes(32);
    const iv = crypto.randomBytes(16);
    const data = 'secret';

    const cipher = crypto.createCipheriv(algorithm, key1, iv);
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const decipher = crypto.createDecipheriv(algorithm, key2, iv);
    expect(() => {
      let decrypted = decipher.update(encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
    }).toThrow();
  });
});

describe('Hash Function Properties', () => {
  test('fixed output length regardless of input', () => {
    const testCases = ['', 'x', 'hello', 'a'.repeat(100), 'a'.repeat(10000)];

    for (const input of testCases) {
      const hash = crypto.createHash('sha256').update(input).digest('hex');
      expect(hash.length).toBe(64);
    }
  });

  test('avalanche effect - small changes produce large differences', () => {
    const base = 'The quick brown fox jumps over the lazy dog';
    const modified = 'The quick brown fox jumps over the lazy cat';

    const hash1 = crypto.createHash('sha256').update(base).digest('hex');
    const hash2 = crypto.createHash('sha256').update(modified).digest('hex');

    let differences = 0;
    for (let i = 0; i < hash1.length; i++) {
      if (hash1[i] !== hash2[i]) differences++;
    }

    expect(differences).toBeGreaterThan(16);
  });
});

describe('Random Number Generation', () => {
  test('randomBytes produces unique values', () => {
    const samples = new Set<string>();
    for (let i = 0; i < 100; i++) {
      samples.add(crypto.randomBytes(16).toString('hex'));
    }
    expect(samples.size).toBe(100);
  });

  test('randomFill produces cryptographically strong values', () => {
    const buffer = Buffer.alloc(32);
    crypto.randomFill(buffer);

    const allZeros = buffer.every((b) => b === 0);
    expect(allZeros).toBe(false);

    const samples = new Set<string>();
    for (let i = 0; i < 50; i++) {
      const buf = Buffer.alloc(32);
      crypto.randomFill(buf);
      samples.add(buf.toString('hex'));
    }
    expect(samples.size).toBe(50);
  });
});

describe('Key Derivation', () => {
  test('PBKDF2 produces consistent derived keys', () => {
    const password = 'my-secret-password';
    const salt = crypto.randomBytes(16);
    const iterations = 100000;
    const keyLength = 32;

    const key1 = crypto.pbkdf2Sync(password, salt, iterations, keyLength, 'sha256');
    const key2 = crypto.pbkdf2Sync(password, salt, iterations, keyLength, 'sha256');

    expect(key1.toString('hex')).toBe(key2.toString('hex'));
    expect(key1.length).toBe(keyLength);
  });

  test('different salts produce different derived keys', () => {
    const password = 'same-password';
    const salt1 = crypto.randomBytes(16);
    const salt2 = crypto.randomBytes(16);
    const iterations = 100000;
    const keyLength = 32;

    const key1 = crypto.pbkdf2Sync(password, salt1, iterations, keyLength, 'sha256');
    const key2 = crypto.pbkdf2Sync(password, salt2, iterations, keyLength, 'sha256');

    expect(key1.toString('hex')).not.toBe(key2.toString('hex'));
  });

  test('scrypt produces derived keys', () => {
    const password = 'password';
    const salt = crypto.randomBytes(16);
    const cost = 16384;
    const blockSize = 8;
    const keyLength = 32;

    const key = crypto.scryptSync(password, salt, keyLength, { cost, blockSize });

    expect(key.length).toBe(keyLength);
  });
});

describe('Digital Signatures', () => {
  test('generateKeyPair produces valid keys', () => {
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: { type: 'spki', format: 'pem' },
      privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
    });

    expect(publicKey).toBeDefined();
    expect(privateKey).toBeDefined();
    expect(publicKey.startsWith('-----BEGIN PUBLIC KEY-----')).toBe(true);
    expect(privateKey.startsWith('-----BEGIN PRIVATE KEY-----')).toBe(true);
  });

  test('sign and verify work correctly', () => {
    const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: { type: 'spki', format: 'pem' },
      privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
    });

    const data = 'Message to sign';

    const sign = crypto.createSign('SHA256');
    sign.update(data);
    sign.end();
    const signature = sign.sign(privateKey, 'hex');

    const verify = crypto.createVerify('SHA256');
    verify.update(data);
    verify.end();
    expect(verify.verify(publicKey, signature, 'hex')).toBe(true);
  });

  test('verification fails with tampered data', () => {
    const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: { type: 'spki', format: 'pem' },
      privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
    });

    const originalData = 'Original message';
    const tamperedData = 'Tampered message';

    const sign = crypto.createSign('SHA256');
    sign.update(originalData);
    sign.end();
    const signature = sign.sign(privateKey, 'hex');

    const verify = crypto.createVerify('SHA256');
    verify.update(tamperedData);
    verify.end();
    expect(verify.verify(publicKey, signature, 'hex')).toBe(false);
  });
});

describe('Constant-Time Comparison', () => {
  test('timingSafeEqual works correctly', () => {
    const a = Buffer.from('abc123');
    const b = Buffer.from('abc123');
    const c = Buffer.from('xyz789');

    expect(crypto.timingSafeEqual(a, b)).toBe(true);
    expect(crypto.timingSafeEqual(a, c)).toBe(false);
  });

  test('timingSafeEqual throws on different lengths', () => {
    const a = Buffer.from('abc');
    const b = Buffer.from('abc123');

    expect(() => {
      crypto.timingSafeEqual(a, b);
    }).toThrow();
  });
});
