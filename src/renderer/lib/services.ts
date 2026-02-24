import { Container, DIProvider, RENDERER_TYPES, useService } from './di';

export interface LoggerService {
  debug(message: string, context?: Record<string, unknown>): void;
  info(message: string, context?: Record<string, unknown>): void;
  warn(message: string, context?: Record<string, unknown>): void;
  error(message: string, context?: Record<string, unknown>): void;
  setLevel(level: 'debug' | 'info' | 'warn' | 'error'): void;
}

export function createLoggerService(): LoggerService {
  let minLevel: 'debug' | 'info' | 'warn' | 'error' = 'debug';

  const levels = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
  };

  const shouldLog = (level: string) => levels[level as keyof typeof levels] >= levels[minLevel];

  const writeToMain = async (
    level: 'debug' | 'info' | 'warn' | 'error',
    message: string,
    context?: Record<string, unknown>
  ) => {
    if (!window.electronAPI?.log?.write) return;

    try {
      await window.electronAPI.log.write({
        level,
        message,
        context,
        timestamp: new Date().toISOString(),
      });
    } catch {
      // Silent fail
    }
  };

  return {
    debug(message: string, context?: Record<string, unknown>) {
      console.debug(`[DEBUG] ${message}`, context);
      if (shouldLog('debug')) writeToMain('debug', message, context);
    },
    info(message: string, context?: Record<string, unknown>) {
      console.info(`[INFO] ${message}`, context);
      if (shouldLog('info')) writeToMain('info', message, context);
    },
    warn(message: string, context?: Record<string, unknown>) {
      console.warn(`[WARN] ${message}`, context);
      if (shouldLog('warn')) writeToMain('warn', message, context);
    },
    error(message: string, context?: Record<string, unknown>) {
      console.error(`[ERROR] ${message}`, context);
      if (shouldLog('error')) writeToMain('error', message, context);
    },
    setLevel(level: 'debug' | 'info' | 'warn' | 'error') {
      minLevel = level;
    },
  };
}

export function createContainer(): Container {
  const container = new Container();
  container.registerInstance(RENDERER_TYPES.LOGGER, createLoggerService());
  return container;
}

export function useLogger(): LoggerService {
  return useService<LoggerService>(RENDERER_TYPES.LOGGER);
}

export { DIProvider };
