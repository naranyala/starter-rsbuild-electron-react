import { err, ok, type Result } from '../types/result';

export type ValidationError = {
  field: string;
  message: string;
};

export type ValidationResult<T> = Result<T, ValidationError[]>;

export function validateString(
  value: unknown,
  field: string,
  required = true
): ValidationResult<string> {
  if (value === undefined || value === null) {
    if (required) {
      return err([{ field, message: `${field} is required` }]);
    }
    return ok(undefined as unknown as string);
  }

  if (typeof value !== 'string') {
    return err([{ field, message: `${field} must be a string` }]);
  }

  return ok(value);
}

export function validateNumber(
  value: unknown,
  field: string,
  required = true
): ValidationResult<number> {
  if (value === undefined || value === null) {
    if (required) {
      return err([{ field, message: `${field} is required` }]);
    }
    return ok(undefined as unknown as number);
  }

  if (typeof value !== 'number') {
    return err([{ field, message: `${field} must be a number` }]);
  }

  return ok(value);
}

export function validateBoolean(value: unknown, field: string): ValidationResult<boolean> {
  if (value === undefined || value === null) {
    return ok(false);
  }

  if (typeof value !== 'boolean') {
    return err([{ field, message: `${field} must be a boolean` }]);
  }

  return ok(value);
}

export function validateObject<T extends Record<string, unknown>>(
  value: unknown,
  field: string,
  schema: Record<string, (value: unknown) => ValidationResult<unknown>>
): ValidationResult<T> {
  if (value === undefined || value === null) {
    return err([{ field, message: `${field} is required` }]);
  }

  if (typeof value !== 'object' || Array.isArray(value)) {
    return err([{ field, message: `${field} must be an object` }]);
  }

  const obj = value as Record<string, unknown>;
  const errors: ValidationError[] = [];
  const validated: Record<string, unknown> = {};

  for (const [key, validator] of Object.entries(schema)) {
    const validationResult = validator(obj[key]);
    if (validationResult.ok) {
      validated[key] = validationResult.value;
    } else {
      errors.push(...validationResult.error);
    }
  }

  if (errors.length > 0) {
    return err(errors);
  }

  return ok(validated as T);
}

export function validateArray(
  value: unknown,
  field: string,
  itemValidator?: (item: unknown, index: number) => ValidationResult<unknown>
): ValidationResult<unknown[]> {
  if (value === undefined || value === null) {
    return ok([]);
  }

  if (!Array.isArray(value)) {
    return err([{ field, message: `${field} must be an array` }]);
  }

  if (!itemValidator) {
    return ok(value);
  }

  const errors: ValidationError[] = [];
  const result: unknown[] = [];

  for (let i = 0; i < value.length; i++) {
    const itemResult = itemValidator(value[i], i);
    if (itemResult.ok) {
      result.push(itemResult.value);
    } else {
      errors.push(
        ...itemResult.error.map((e) => ({
          ...e,
          field: `${field}[${i}].${e.field}`,
        }))
      );
    }
  }

  if (errors.length > 0) {
    return err(errors);
  }

  return ok(result);
}

export function validateFilePath(value: unknown, field: string): ValidationResult<string> {
  const stringResult = validateString(value, field);
  if (!stringResult.ok) {
    return stringResult;
  }

  const path = stringResult.value;
  if (path.includes('..')) {
    return err([{ field, message: `${field} must not contain path traversal` }]);
  }

  if (path.includes('\0')) {
    return err([{ field, message: `${field} must not contain null bytes` }]);
  }

  return ok(path);
}

export function validateOneOf<T extends string>(
  value: unknown,
  field: string,
  allowedValues: T[]
): ValidationResult<T> {
  const stringResult = validateString(value, field);
  if (!stringResult.ok) {
    return stringResult as ValidationResult<T>;
  }

  if (!allowedValues.includes(stringResult.value as T)) {
    return err([
      {
        field,
        message: `${field} must be one of: ${allowedValues.join(', ')}`,
      },
    ]);
  }

  return ok(stringResult.value as T);
}
