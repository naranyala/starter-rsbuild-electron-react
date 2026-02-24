export const TYPES = {
  LOGGER: Symbol.for('Logger'),
  CONFIG: Symbol.for('Config'),
  WINDOW_SERVICE: Symbol.for('WindowService'),
  WINDOW_MANAGER: Symbol.for('WindowManager'),
  IPC_REGISTRY: Symbol.for('IpcRegistry'),
  FILE_SERVICE: Symbol.for('FileService'),
  APP_SERVICE: Symbol.for('AppService'),
} as const;

export type ServiceToken = (typeof TYPES)[keyof typeof TYPES];
