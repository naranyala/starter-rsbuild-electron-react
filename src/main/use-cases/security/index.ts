/**
 * Security use-cases for backend
 */

import { SecurityUtils } from '../../lib/main-utils';

export interface EncryptionResult {
  encrypted: string;
  iv: string;
  algorithm: string;
}

/**
 * Generate secure random data
 */
export const generateRandomDataUseCase = {
  id: 'security.generate-random',

  async execute(length: number, format: 'hex' | 'bytes' = 'hex'): Promise<string | Buffer> {
    if (format === 'hex') {
      return SecurityUtils.generateRandomHex(length);
    } else {
      return SecurityUtils.generateRandomBytes(length);
    }
  },
};

/**
 * Generate UUID
 */
export const generateUUIDUseCase = {
  id: 'security.generate-uuid',

  async execute(): Promise<string> {
    return SecurityUtils.generateUUID();
  },
};

/**
 * Hash data
 */
export const hashDataUseCase = {
  id: 'security.hash-data',

  async execute(data: string, algorithm: 'sha256' | 'sha512' | 'md5' = 'sha256'): Promise<string> {
    return SecurityUtils.hash(data, algorithm);
  },
};

/**
 * Create HMAC
 */
export const createHmacUseCase = {
  id: 'security.create-hmac',

  async execute(
    data: string,
    key: string,
    algorithm: 'sha256' | 'sha512' = 'sha256'
  ): Promise<string> {
    return SecurityUtils.createHmac(data, key, algorithm);
  },
};

/**
 * Encrypt data
 */
export const encryptDataUseCase = {
  id: 'security.encrypt-data',

  async execute(
    data: string,
    key: string,
    algorithm: string = 'aes-256-cbc'
  ): Promise<EncryptionResult> {
    const result = SecurityUtils.encrypt(data, key, algorithm);
    return {
      encrypted: result.encrypted,
      iv: result.iv,
      algorithm,
    };
  },
};

/**
 * Decrypt data
 */
export const decryptDataUseCase = {
  id: 'security.decrypt-data',

  async execute(
    encryptedData: string,
    key: string,
    iv: string,
    algorithm: string = 'aes-256-cbc'
  ): Promise<string> {
    return SecurityUtils.decrypt(encryptedData, key, iv, algorithm);
  },
};

/**
 * Validate file path security
 */
export const validatePathUseCase = {
  id: 'security.validate-path',

  async execute(filePath: string): Promise<{
    isValid: boolean;
    issues: string[];
  }> {
    return SecurityUtils.validatePath(filePath);
  },
};
