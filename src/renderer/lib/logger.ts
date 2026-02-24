export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogEntry {
  level: LogLevel;
  message: string;
  context?: Record<string, unknown>;
  timestamp: string;
}

export interface ElectronAPI {
  log: {
    write: (entry: LogEntry) => Promise<{ success: boolean }>;
    getPath: () => Promise<{ path: string }>;
  };
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI;
  }
}

class Logger {
  private minLevel: LogLevel = 'debug';
  private levels: Record<LogLevel, number> = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
  };

  private shouldLog(level: LogLevel): boolean {
    return this.levels[level] >= this.levels[this.minLevel];
  }

  private formatMessage(
    level: LogLevel,
    message: string,
    context?: Record<string, unknown>
  ): string {
    const ctxStr = context ? ` ${JSON.stringify(context)}` : '';
    return `[${level.toUpperCase()}] ${message}${ctxStr}`;
  }

  private async writeToMain(
    level: LogLevel,
    message: string,
    context?: Record<string, unknown>
  ): Promise<void> {
    if (!window.electronAPI?.log?.write) {
      return;
    }

    try {
      await window.electronAPI.log.write({
        level,
        message,
        context,
        timestamp: new Date().toISOString(),
      });
    } catch {
      // Silent fail - don't crash the app
    }
  }

  debug(message: string, context?: Record<string, unknown>): void {
    const formatted = this.formatMessage('debug', message, context);
    console.debug(formatted);
    if (this.shouldLog('debug')) {
      this.writeToMain('debug', message, context);
    }
  }

  info(message: string, context?: Record<string, unknown>): void {
    const formatted = this.formatMessage('info', message, context);
    console.info(formatted);
    if (this.shouldLog('info')) {
      this.writeToMain('info', message, context);
    }
  }

  warn(message: string, context?: Record<string, unknown>): void {
    const formatted = this.formatMessage('warn', message, context);
    console.warn(formatted);
    if (this.shouldLog('warn')) {
      this.writeToMain('warn', message, context);
    }
  }

  error(message: string, context?: Record<string, unknown>): void {
    const formatted = this.formatMessage('error', message, context);
    console.error(formatted);
    if (this.shouldLog('error')) {
      this.writeToMain('error', message, context);
    }
  }

  setLevel(level: LogLevel): void {
    this.minLevel = level;
  }
}

export const logger = new Logger();
