/**
 * Logger types for shared logging functionality
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal';

export const LOG_LEVELS: Record<LogLevel, string> = {
  debug: '#6c757d',
  info: '#17a2b8',
  warn: '#ffc107',
  error: '#dc3545',
  fatal: '#721c24',
};

export interface LogContext {
  [key: string]: unknown;
}

export interface LogEntry {
  id: string;
  level: LogLevel;
  message: string;
  context?: Record<string, unknown>;
  timestamp: string;
  source?: string;
  stack?: string;
}

export interface LogQuery {
  level?: LogLevel;
  source?: string;
  from?: string;
  to?: string;
  search?: string;
  limit?: number;
  offset?: number;
}

export interface LogQueryResult {
  entries: LogEntry[];
  total: number;
  hasMore: boolean;
}

export interface Logger {
  debug(message: string, context?: LogContext): void;
  info(message: string, context?: LogContext): void;
  warn(message: string, context?: LogContext): void;
  error(message: string, context?: LogContext): void;
  fatal(message: string, context?: LogContext): void;
  setLevel(level: LogLevel): void;
  getLevel(): LogLevel;
}

export interface ILogger extends Logger {}

export interface LoggerTransport {
  write(entry: LogEntry): Promise<void>;
}
