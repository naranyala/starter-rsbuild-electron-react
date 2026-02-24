import * as path from 'node:path';
import { app } from 'electron';
import electronLog from 'electron-log';

const isDev = process.argv.some((arg) => arg === '--start-dev');

const logDir = isDev
  ? path.join(app.getPath('userData'), 'logs-dev')
  : path.join(app.getPath('userData'), 'logs');

electronLog.transports.file.resolvePathFn = () => path.join(logDir, 'main.log');

electronLog.transports.file.level = isDev ? 'debug' : 'info';

electronLog.transports.file.maxSize = 10 * 1024 * 1024;

electronLog.transports.file.format = '[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}] {text}';

electronLog.transports.console.level = isDev ? 'debug' : 'info';

electronLog.transports.console.format = isDev
  ? '[{h}:{i}:{s}.{ms}] [{level}] {text}'
  : '[{level}] {text}';

Object.assign(console, electronLog.functions);

export const logger = {
  debug: (...args: unknown[]) => electronLog.debug(...args),
  info: (...args: unknown[]) => electronLog.info(...args),
  warn: (...args: unknown[]) => electronLog.warn(...args),
  error: (...args: unknown[]) => electronLog.error(...args),

  log: (level: 'debug' | 'info' | 'warn' | 'error', ...args: unknown[]) => {
    electronLog[level](...args);
  },

  getLogPath: () => logDir,
};

export default logger;
