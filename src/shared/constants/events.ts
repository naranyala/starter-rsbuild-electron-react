export const AppEvents = {
  READY: 'app:ready',
  QUIT: 'app:quit',
  BEFORE_QUIT: 'app:before-quit',
} as const;

export const WindowEvents = {
  CREATED: 'window:created',
  CLOSED: 'window:closed',
  FOCUSED: 'window:focused',
  MINIMIZED: 'window:minimized',
  MAXIMIZED: 'window:maximized',
  RESTORED: 'window:restored',
  RESIZED: 'window:resized',
  MOVED: 'window:moved',
} as const;

export const FileEvents = {
  CREATED: 'file:created',
  DELETED: 'file:deleted',
  MODIFIED: 'file:modified',
  READ_ERROR: 'file:read-error',
} as const;

export const IPCEvents = {
  CHANNEL_SUBSCRIBE: 'ipc:subscribe',
  CHANNEL_UNSUBSCRIBE: 'ipc:unsubscribe',
  CHANNEL_EMIT: 'ipc:emit',
} as const;

export type AppEvent = (typeof AppEvents)[keyof typeof AppEvents];
export type WindowEvent = (typeof WindowEvents)[keyof typeof WindowEvents];
export type FileEvent = (typeof FileEvents)[keyof typeof FileEvents];
export type IPCEvent = (typeof IPCEvents)[keyof typeof IPCEvents];
export type AppEventType = AppEvent | WindowEvent | FileEvent | IPCEvent;
