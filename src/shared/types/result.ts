/**
 * Result type for error handling with explicit errors
 */

export type Result<T, E = Error> = Ok<T> | Err<E>;

export interface Ok<T> {
  ok: true;
  value: T;
  isOk: true;
  isErr: false;
}

export interface Err<E = Error> {
  ok: false;
  error: E;
  isOk: false;
  isErr: true;
}

export function ok<T>(value: T): Ok<T> {
  return { ok: true, value, isOk: true, isErr: false };
}

export function err<E = Error>(error: E): Err<E> {
  return { ok: false, error, isOk: false, isErr: true };
}

export function isOk<T, E>(result: Result<T, E>): result is Ok<T> {
  return result.ok;
}

export function isErr<T, E>(result: Result<T, E>): result is Err<E> {
  return !result.ok;
}

export function unwrap<T, E>(result: Result<T, E>): T {
  if (isOk(result)) {
    return result.value;
  }
  throw result.error;
}

export function unwrapOr<T, E>(result: Result<T, E>, defaultValue: T): T {
  return isOk(result) ? result.value : defaultValue;
}

export function map<T, U, E>(result: Result<T, E>, fn: (value: T) => U): Result<U, E> {
  return isOk(result) ? ok(fn(result.value)) : result;
}

export function mapErr<T, E, F>(result: Result<T, E>, fn: (error: E) => F): Result<T, F> {
  return isErr(result) ? err(fn(result.error)) : result;
}

export function andThen<T, U, E>(result: Result<T, E>, fn: (value: T) => Result<U, E>): Result<U, E> {
  return isOk(result) ? fn(result.value) : result;
}

export function match<T, E, R>(
  result: Result<T, E>,
  handlers: {
    ok: (value: T) => R;
    err: (error: E) => R;
  }
): R {
  return isOk(result) ? handlers.ok(result.value) : handlers.err(result.error);
}

export function tryCatch<T>(fn: () => T): Result<T, Error> {
  try {
    return ok(fn());
  } catch (e) {
    return err(e instanceof Error ? e : new Error(String(e)));
  }
}

export async function tryCatchAsync<T>(fn: () => Promise<T>): Promise<Result<T, Error>> {
  try {
    return ok(await fn());
  } catch (e) {
    return err(e instanceof Error ? e : new Error(String(e)));
  }
}
