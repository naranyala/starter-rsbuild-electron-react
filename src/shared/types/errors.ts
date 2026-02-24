/**
 * Error types for shared error handling
 */

export type ErrorCode = 
  | 'VALIDATION_ERROR'
  | 'NETWORK_ERROR'
  | 'AUTH_ERROR'
  | 'NOT_FOUND'
  | 'PERMISSION_DENIED'
  | 'UNKNOWN_ERROR';

export type ErrorSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface ErrorState {
  hasError: boolean;
  error?: AppError;
  isRecovering: boolean;
}

export interface ErrorReporter {
  report(error: AppError): void;
  flush(): Promise<void>;
}

export interface IErrorService {
  capture(error: unknown, context?: ErrorContext): AppError;
  display(error: AppError): void;
  recover(error: AppError): Promise<boolean>;
}

export interface ErrorContext {
  source?: string;
  recoverable?: boolean;
  details?: Record<string, unknown>;
  errorCode?: string;
  context?: Record<string, unknown>;
  isFatal?: boolean;
}

export interface AppError {
  code: ErrorCode;
  message: string;
  severity: ErrorSeverity;
  source?: string;
  recoverable: boolean;
  details?: Record<string, unknown>;
  timestamp?: string;
  stack?: string;
  context?: Record<string, unknown>;
  originalError?: unknown;
  suggestedAction?: string;
  cause?: Error;
}

export interface ValidationError {
  field: string;
  message: string;
  value?: unknown;
}

export function createError(code: ErrorCode, message: string, context?: ErrorContext): AppError {
  return {
    code,
    message,
    severity: context?.isFatal ? 'critical' : 'medium',
    recoverable: context?.recoverable ?? true,
    source: context?.source,
    details: context?.details,
    context: context?.context,
    timestamp: new Date().toISOString(),
  };
}

export function isAppError(error: unknown): error is AppError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    'message' in error
  );
}
