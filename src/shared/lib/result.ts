export type Result<T, E = Error> = Ok<T> | Err<E>;

export type Ok<T> = {
  readonly ok: true;
  readonly value: T;
};

export type Err<E = Error> = {
  readonly ok: false;
  readonly error: E;
};

export function ok<T>(value: T): Ok<T> {
  return { ok: true, value };
}

export function err<E = Error>(error: E): Err<E> {
  return { ok: false, error };
}

export function isOk<T, E>(result: Result<T, E>): result is Ok<T> {
  return result.ok === true;
}

export function isErr<T, E>(result: Result<T, E>): result is Err<E> {
  return result.ok === false;
}

export function map<T, U, E>(result: Result<T, E>, fn: (value: T) => U): Result<U, E> {
  return isOk(result) ? ok(fn(result.value)) : result;
}

export function mapErr<T, E, F>(result: Result<T, E>, fn: (error: E) => F): Result<T, F> {
  return isErr(result) ? err(fn(result.error)) : result;
}

export function flatmap<T, U, E>(
  result: Result<T, E>,
  fn: (value: T) => Result<U, E>
): Result<U, E> {
  return isOk(result) ? fn(result.value) : result;
}

export function getOrElse<T, E>(result: Result<T, E>, defaultValue: T): T {
  return isOk(result) ? result.value : defaultValue;
}

export function getOrElseFn<T, E>(result: Result<T, E>, fn: (error: E) => T): T {
  return isOk(result) ? result.value : fn(result.error);
}

export function fromTry<T>(fn: () => T): Result<T, Error> {
  try {
    return ok(fn());
  } catch (e) {
    return err(e instanceof Error ? e : new Error(String(e)));
  }
}

export async function fromTryAsync<T>(fn: () => Promise<T>): Promise<Result<T, Error>> {
  try {
    return ok(await fn());
  } catch (e) {
    return err(e instanceof Error ? e : new Error(String(e)));
  }
}

export function fromNullable<T>(
  value: T | null | undefined,
  error?: Error
): Result<NonNullable<T>, Error> {
  if (value === null || value === undefined) {
    return err(error ?? new Error('Value is null or undefined'));
  }
  return ok(value as NonNullable<T>);
}
