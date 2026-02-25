/// <reference types="bun" />

import { describe, expect, it } from 'bun:test';
import {
  ArrayUtils,
  generateId,
  isEmpty,
  StringUtils,
  TypeUtils,
  ValidationUtils,
} from '../../src/shared/lib/common';

describe('StringUtils', () => {
  describe('capitalize', () => {
    it('should capitalize first letter', () => {
      expect(StringUtils.capitalize('hello')).toBe('Hello');
    });

    it('should handle empty string', () => {
      expect(StringUtils.capitalize('')).toBe('');
    });
  });

  describe('camelCase', () => {
    it('should convert to camelCase', () => {
      expect(StringUtils.camelCase('hello world')).toBe('helloWorld');
    });
  });

  describe('snakeCase', () => {
    it('should convert to snake_case', () => {
      expect(StringUtils.snakeCase('HelloWorld')).toBe('hello_world');
    });
  });

  describe('kebabCase', () => {
    it('should convert to kebab-case', () => {
      expect(StringUtils.kebabCase('HelloWorld')).toBe('hello-world');
    });
  });

  describe('slugify', () => {
    it('should slugify string', () => {
      expect(StringUtils.slugify('Hello World!')).toBe('hello-world');
    });
  });

  describe('escapeHtml', () => {
    it('should escape HTML entities', () => {
      expect(StringUtils.escapeHtml('<script>alert("xss")</script>')).toBe(
        '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;'
      );
    });
  });

  describe('truncate', () => {
    it('should truncate long strings', () => {
      expect(StringUtils.truncate('hello world', 8)).toBe('hello...');
    });

    it('should not truncate short strings', () => {
      expect(StringUtils.truncate('hello', 10)).toBe('hello');
    });
  });
});

describe('ArrayUtils', () => {
  describe('unique', () => {
    it('should remove duplicates', () => {
      expect(ArrayUtils.unique([1, 2, 2, 3])).toEqual([1, 2, 3]);
    });
  });

  describe('uniqueBy', () => {
    it('should remove duplicates by key', () => {
      const items = [{ id: 1 }, { id: 2 }, { id: 1 }];
      expect(ArrayUtils.uniqueBy(items, (i) => i.id)).toHaveLength(2);
    });
  });

  describe('groupBy', () => {
    it('should group by key', () => {
      const items = [{ type: 'a' }, { type: 'b' }, { type: 'a' }];
      const grouped = ArrayUtils.groupBy(items, (i) => i.type);
      expect(grouped.a).toHaveLength(2);
      expect(grouped.b).toHaveLength(1);
    });
  });

  describe('chunk', () => {
    it('should chunk array', () => {
      expect(ArrayUtils.chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
    });
  });

  describe('flatten', () => {
    it('should flatten nested arrays', () => {
      expect(ArrayUtils.flatten([1, [2, 3], [4]])).toEqual([1, 2, 3, 4]);
    });
  });

  describe('shuffle', () => {
    it('should shuffle array', () => {
      const arr = [1, 2, 3, 4, 5];
      const shuffled = ArrayUtils.shuffle(arr);
      expect(shuffled.sort()).toEqual(arr);
    });
  });
});

describe('ValidationUtils', () => {
  describe('isEmail', () => {
    it('should validate correct emails', () => {
      expect(ValidationUtils.isEmail('test@example.com')).toBe(true);
    });

    it('should reject invalid emails', () => {
      expect(ValidationUtils.isEmail('invalid')).toBe(false);
    });
  });

  describe('isUrl', () => {
    it('should validate correct URLs', () => {
      expect(ValidationUtils.isUrl('https://example.com')).toBe(true);
    });

    it('should reject invalid URLs', () => {
      expect(ValidationUtils.isUrl('not-a-url')).toBe(false);
    });
  });

  describe('isIPv4', () => {
    it('should validate IPv4', () => {
      expect(ValidationUtils.isIPv4('192.168.1.1')).toBe(true);
    });

    it('should reject invalid IPv4', () => {
      expect(ValidationUtils.isIPv4('999.999.999.999')).toBe(false);
    });
  });

  describe('isHexColor', () => {
    it('should validate hex colors', () => {
      expect(ValidationUtils.isHexColor('#ff0000')).toBe(true);
      expect(ValidationUtils.isHexColor('fff')).toBe(true);
    });
  });

  describe('isStrongPassword', () => {
    it('should validate strong passwords', () => {
      expect(ValidationUtils.isStrongPassword('Password1!')).toBe(true);
    });

    it('should reject weak passwords', () => {
      expect(ValidationUtils.isStrongPassword('weak')).toBe(false);
    });
  });
});

describe('TypeUtils', () => {
  describe('isPlainObject', () => {
    it('should identify plain objects', () => {
      expect(TypeUtils.isPlainObject({})).toBe(true);
      expect(TypeUtils.isPlainObject([])).toBe(false);
      expect(TypeUtils.isPlainObject(null)).toBe(false);
    });
  });

  describe('isString', () => {
    it('should identify strings', () => {
      expect(TypeUtils.isString('hello')).toBe(true);
      expect(TypeUtils.isString(123)).toBe(false);
    });
  });

  describe('isNumber', () => {
    it('should identify numbers', () => {
      expect(TypeUtils.isNumber(123)).toBe(true);
      expect(TypeUtils.isNumber(NaN)).toBe(false);
    });
  });

  describe('isDefined', () => {
    it('should check if defined', () => {
      expect(TypeUtils.isDefined(0)).toBe(true);
      expect(TypeUtils.isDefined(null)).toBe(false);
      expect(TypeUtils.isDefined(undefined)).toBe(false);
    });
  });
});

describe('Utilities', () => {
  describe('isEmpty', () => {
    it('should identify empty values', () => {
      expect(isEmpty(null)).toBe(true);
      expect(isEmpty(undefined)).toBe(true);
      expect(isEmpty('')).toBe(true);
      expect(isEmpty([])).toBe(true);
      expect(isEmpty({})).toBe(true);
      expect(isEmpty('hello')).toBe(false);
      expect(isEmpty([1])).toBe(false);
    });
  });

  describe('generateId', () => {
    it('should generate IDs of correct length', () => {
      expect(generateId().length).toBe(8);
      expect(generateId(16).length).toBe(16);
    });

    it('should generate unique IDs', () => {
      const ids = new Set<string>();
      for (let i = 0; i < 100; i++) {
        ids.add(generateId());
      }
      expect(ids.size).toBe(100);
    });
  });
});
