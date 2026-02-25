/// <reference types="bun" />

import { describe, expect, it } from 'bun:test';
import {
  err,
  fromNullable,
  fromTry,
  fromTryAsync,
  getOrElse,
  getOrElseFn,
  isErr,
  isOk,
  map,
  mapErr,
  ok,
} from '../../src/shared/lib/result';

describe('Result<T, E> - ok/err creation', () => {
  it('should create ok result', () => {
    const result = ok(42);
    expect(result.ok).toBe(true);
    expect(result.value).toBe(42);
  });

  it('should create err result', () => {
    const result = err(new Error('fail'));
    expect(result.ok).toBe(false);
    expect(result.error.message).toBe('fail');
  });
});

describe('Result<T, E> - type guards', () => {
  it('should correctly identify ok', () => {
    const okResult = ok(1);
    const errResult = err(new Error('fail'));
    expect(isOk(okResult)).toBe(true);
    expect(isOk(errResult)).toBe(false);
  });

  it('should correctly identify err', () => {
    const okResult = ok(1);
    const errResult = err(new Error('fail'));
    expect(isErr(okResult)).toBe(false);
    expect(isErr(errResult)).toBe(true);
  });
});

describe('Result<T, E> - map', () => {
  it('should map over ok value', () => {
    const result = ok(5);
    const mapped = map(result, (v) => v * 2);
    expect(isOk(mapped)).toBe(true);
    if (isOk(mapped)) expect(mapped.value).toBe(10);
  });

  it('should pass through err unchanged', () => {
    const result = err<number, Error>(new Error('fail'));
    const mapped = map(result, (v) => v * 2);
    expect(isErr(mapped)).toBe(true);
  });
});

describe('Result<T, E> - getOrElse', () => {
  it('should return value for ok', () => {
    const result = ok(42);
    expect(getOrElse(result, 0)).toBe(42);
  });

  it('should return default for err', () => {
    const result = err<number, Error>(new Error('fail'));
    expect(getOrElse(result, 0)).toBe(0);
  });
});

describe('Result<T, E> - fromTry', () => {
  it('should catch errors from sync function', () => {
    const result = fromTry(() => {
      throw new Error('oops');
    });
    expect(isErr(result)).toBe(true);
  });

  it('should return ok for successful sync function', () => {
    const result = fromTry(() => 42);
    expect(isOk(result)).toBe(true);
  });
});

describe('Result<T, E> - fromNullable', () => {
  it('should return err for null', () => {
    const result = fromNullable(null);
    expect(isErr(result)).toBe(true);
  });

  it('should return err for undefined', () => {
    const result = fromNullable(undefined);
    expect(isErr(result)).toBe(true);
  });

  it('should return ok for non-null value', () => {
    const result = fromNullable(42);
    expect(isOk(result)).toBe(true);
  });
});
