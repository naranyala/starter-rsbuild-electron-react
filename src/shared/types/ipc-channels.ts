/**
 * IPC channel types for main-renderer communication
 */

export type IpcChannel = 
  // File system channels
  | 'fs:read-file'
  | 'fs:write-file'
  | 'fs:delete-file'
  | 'fs:list-files'
  | 'fs:file-exists'
  | 'fs:get-file-stats'
  // Window channels
  | 'window:create'
  | 'window:close'
  | 'window:focus'
  | 'window:minimize'
  | 'window:maximize'
  | 'window:toggle-fullscreen'
  // App channels
  | 'app:quit'
  | 'app:relaunch'
  | 'app:hide'
  | 'app:show'
  | 'app:get-path'
  // Event channels
  | 'event:subscribe'
  | 'event:unsubscribe'
  | 'event:emit'
  | 'event:emit-to-renderer'
  | 'event:received'
  // Log channels
  | 'log:write'
  | 'log:getPath'
  | 'log:query';

export interface IpcRequest {
  channel: IpcChannel;
  args?: unknown;
}

export interface IpcResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
}

export const IPC_CHANNELS = {
  // File system
  FS_READ_FILE: 'fs:read-file',
  FS_WRITE_FILE: 'fs:write-file',
  FS_DELETE_FILE: 'fs:delete-file',
  FS_LIST_FILES: 'fs:list-files',
  FS_FILE_EXISTS: 'fs:file-exists',
  FS_GET_FILE_STATS: 'fs:get-file-stats',
  // Window
  WINDOW_CREATE: 'window:create',
  WINDOW_CLOSE: 'window:close',
  WINDOW_FOCUS: 'window:focus',
  WINDOW_MINIMIZE: 'window:minimize',
  WINDOW_MAXIMIZE: 'window:maximize',
  WINDOW_TOGGLE_FULLSCREEN: 'window:toggle-fullscreen',
  // App
  APP_QUIT: 'app:quit',
  APP_RELAUNCH: 'app:relaunch',
  APP_HIDE: 'app:hide',
  APP_SHOW: 'app:show',
  APP_GET_PATH: 'app:get-path',
  // Event
  EVENT_SUBSCRIBE: 'event:subscribe',
  EVENT_UNSUBSCRIBE: 'event:unsubscribe',
  EVENT_EMIT: 'event:emit',
  EVENT_EMIT_TO_RENDERER: 'event:emit-to-renderer',
  EVENT_RECEIVED: 'event:received',
  // Log
  LOG_WRITE: 'log:write',
  LOG_GET_PATH: 'log:getPath',
  LOG_QUERY: 'log:query',
} as const;
