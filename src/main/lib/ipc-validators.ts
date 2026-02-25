import {
  type ValidationError,
  type ValidationResult,
  validateFilePath,
  validateObject,
  validateString,
} from '../../shared/lib/validation';
import { err, isErr, ok, type Result } from '../../shared/types/result';
import { logger } from './logger';

export type IpcHandler<TArgs, TResult> = (args: TArgs) => Promise<Result<TResult, Error>>;

export interface IpcValidator<TArgs> {
  validate(args: unknown): ValidationResult<TArgs>;
}

export function createIpcHandler<TArgs, TResult>(
  validator: IpcValidator<TArgs>,
  handler: IpcHandler<TArgs, TResult>
): IpcHandler<unknown, TResult> {
  return async (args: unknown): Promise<Result<TResult, Error>> => {
    const validationResult = validator.validate(args);

    if (isErr(validationResult)) {
      const errorMessages = validationResult.error
        .map((e) => `${e.field}: ${e.message}`)
        .join(', ');
      logger.warn(`IPC validation failed: ${errorMessages}`);
      return err(new Error(`Validation failed: ${errorMessages}`));
    }

    try {
      const result = await handler(validationResult.value);
      return result;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      logger.error(`IPC handler error: ${message}`);
      return err(error instanceof Error ? error : new Error(message));
    }
  };
}

export const fsValidators = {
  writeFile: {
    validate(args: unknown): ValidationResult<{ filePath: string; data: string }> {
      return validateObject(args, 'args', {
        filePath: (v) => validateFilePath(v, 'filePath'),
        data: (v) => validateString(v, 'data'),
      });
    },
  },
  readFile: {
    validate(args: unknown): ValidationResult<{ filePath: string }> {
      return validateObject(args, 'args', {
        filePath: (v) => validateFilePath(v, 'filePath'),
      });
    },
  },
  deleteFile: {
    validate(args: unknown): ValidationResult<{ filePath: string }> {
      return validateObject(args, 'args', {
        filePath: (v) => validateFilePath(v, 'filePath'),
      });
    },
  },
  listFiles: {
    validate(args: unknown): ValidationResult<{ dirPath: string }> {
      return validateObject(args, 'args', {
        dirPath: (v) => validateFilePath(v, 'dirPath'),
      });
    },
  },
  fileExists: {
    validate(args: unknown): ValidationResult<{ filePath: string }> {
      return validateObject(args, 'args', {
        filePath: (v) => validateFilePath(v, 'filePath'),
      });
    },
  },
  getFileStats: {
    validate(args: unknown): ValidationResult<{ filePath: string }> {
      return validateObject(args, 'args', {
        filePath: (v) => validateFilePath(v, 'filePath'),
      });
    },
  },
};

export const windowValidators = {
  create: {
    validate(args: unknown): ValidationResult<{ id: string; config: Record<string, unknown> }> {
      return validateObject(args, 'args', {
        id: (v) => validateString(v, 'id'),
        config: (v) => validateObject(v, 'config', {}),
      });
    },
  },
  close: {
    validate(args: unknown): ValidationResult<{ id: string }> {
      return validateObject(args, 'args', {
        id: (v) => validateString(v, 'id'),
      });
    },
  },
  focus: {
    validate(args: unknown): ValidationResult<{ id: string }> {
      return validateObject(args, 'args', {
        id: (v) => validateString(v, 'id'),
      });
    },
  },
  minimize: {
    validate(args: unknown): ValidationResult<{ id: string }> {
      return validateObject(args, 'args', {
        id: (v) => validateString(v, 'id'),
      });
    },
  },
  maximize: {
    validate(args: unknown): ValidationResult<{ id: string }> {
      return validateObject(args, 'args', {
        id: (v) => validateString(v, 'id'),
      });
    },
  },
};

export const eventValidators = {
  subscribe: {
    validate(args: unknown): ValidationResult<{ event: string }> {
      return validateObject(args, 'args', {
        event: (v) => validateString(v, 'event'),
      });
    },
  },
  emit: {
    validate(args: unknown): ValidationResult<{ event: string; data?: unknown }> {
      return validateObject(args, 'args', {
        event: (v) => validateString(v, 'event'),
      });
    },
  },
};
