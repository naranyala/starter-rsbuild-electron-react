import { contextBridge, type IpcRendererEvent, ipcRenderer } from 'electron';

const ALLOWED_INVOKE_CHANNELS = new Set([
  'fs:write-file',
  'fs:read-file',
  'fs:file-exists',
  'fs:delete-file',
  'fs:list-files',
  'fs:get-file-stats',
  'window:create',
  'window:close',
  'window:focus',
  'window:minimize',
  'window:maximize',
  'window:toggle-fullscreen',
  'app:quit',
  'app:relaunch',
  'app:hide',
  'app:show',
  'app:get-path',
  'log:write',
  'log:getPath',
  'log:query',
  'event:subscribe',
  'event:unsubscribe',
  'event:emit',
  'event:emit-to-renderer',
]);

const ALLOWED_SEND_CHANNELS = new Set([
  'log-error',
  'log-warn',
  'log-info',
  'uncaught-error',
  'unhandled-rejection',
]);

const ALLOWED_ON_CHANNELS = new Set([
  'event:received',
  'window-minimized',
  'window-maximized',
  'window-closed',
  'app:before-quit',
]);

function isChannelAllowed(channel: string, allowed: Set<string>): boolean {
  return allowed.has(channel);
}

function createInvokeHandler(channel: string, args?: unknown): Promise<unknown> | undefined {
  if (!isChannelAllowed(channel, ALLOWED_INVOKE_CHANNELS)) {
    console.error(`[Preload] Blocked invoke to unauthorized channel: ${channel}`);
    return Promise.reject(new Error(`Channel not allowed: ${channel}`));
  }
  return ipcRenderer.invoke(channel, args);
}

function createSendHandler(channel: string, args?: unknown): void {
  if (!isChannelAllowed(channel, ALLOWED_SEND_CHANNELS)) {
    console.error(`[Preload] Blocked send to unauthorized channel: ${channel}`);
    return;
  }
  ipcRenderer.send(channel, args);
}

function createOnHandler(
  channel: string,
  listener: (event: IpcRendererEvent, ...args: unknown[]) => void
): (() => void) | undefined {
  if (!isChannelAllowed(channel, ALLOWED_ON_CHANNELS)) {
    console.error(`[Preload] Blocked listener on unauthorized channel: ${channel}`);
    return undefined;
  }
  ipcRenderer.on(channel, listener);
  return () => ipcRenderer.removeListener(channel, listener);
}

contextBridge.exposeInMainWorld('electronAPI', {
  invoke: createInvokeHandler,
  send: createSendHandler,
  on: createOnHandler,
  once: (channel: string, listener: (event: IpcRendererEvent, ...args: unknown[]) => void) => {
    if (!isChannelAllowed(channel, ALLOWED_ON_CHANNELS)) {
      console.error(`[Preload] Blocked once listener on unauthorized channel: ${channel}`);
      return;
    }
    ipcRenderer.once(channel, listener);
  },
  removeListener: (
    channel: string,
    listener: (event: IpcRendererEvent, ...args: unknown[]) => void
  ) => {
    if (isChannelAllowed(channel, ALLOWED_ON_CHANNELS)) {
      ipcRenderer.removeListener(channel, listener);
    }
  },

  fs: {
    writeFile: (filePath: string, data: string) =>
      ipcRenderer.invoke('fs:write-file', { filePath, data }),
    readFile: (filePath: string) => ipcRenderer.invoke('fs:read-file', { filePath }),
    fileExists: (filePath: string) => ipcRenderer.invoke('fs:file-exists', { filePath }),
    deleteFile: (filePath: string) => ipcRenderer.invoke('fs:delete-file', { filePath }),
    listFiles: (dirPath: string) => ipcRenderer.invoke('fs:list-files', { dirPath }),
    getFileStats: (filePath: string) => ipcRenderer.invoke('fs:get-file-stats', { filePath }),
  },

  window: {
    create: (id: string, config: Record<string, unknown>) =>
      ipcRenderer.invoke('window:create', { id, config }),
    close: (id: string) => ipcRenderer.invoke('window:close', { id }),
    focus: (id: string) => ipcRenderer.invoke('window:focus', { id }),
    minimize: (id: string) => ipcRenderer.invoke('window:minimize', { id }),
    maximize: (id: string) => ipcRenderer.invoke('window:maximize', { id }),
    toggleFullscreen: (id: string) => ipcRenderer.invoke('window:toggle-fullscreen', { id }),
  },

  app: {
    quit: () => ipcRenderer.invoke('app:quit'),
    relaunch: () => ipcRenderer.invoke('app:relaunch'),
    hide: () => ipcRenderer.invoke('app:hide'),
    show: () => ipcRenderer.invoke('app:show'),
    getPath: (name: string) => ipcRenderer.invoke('app:get-path', { name }),
  },

  log: {
    write: (entry: {
      level: string;
      message: string;
      context?: Record<string, unknown>;
      timestamp: string;
    }) => ipcRenderer.invoke('log:write', entry),
    getPath: () => ipcRenderer.invoke('log:getPath'),
    query: (query: Record<string, unknown>) => ipcRenderer.invoke('log:query', query),
  },

  event: {
    subscribe: (event: string) => ipcRenderer.invoke('event:subscribe', { event }),
    unsubscribe: (event: string) => ipcRenderer.invoke('event:unsubscribe', { event }),
    emit: (event: string, data?: unknown) => ipcRenderer.invoke('event:emit', { event, data }),
    emitToRenderer: (windowId: number | undefined, event: string, data?: unknown) =>
      ipcRenderer.invoke('event:emit-to-renderer', { windowId, event, data }),
    on: (listener: (event: string, data: unknown) => void) => {
      const handler = (_: IpcRendererEvent, payload: { event: string; data: unknown }) => {
        listener(payload.event, payload.data);
      };
      ipcRenderer.on('event:received', handler);
      return () => ipcRenderer.removeListener('event:received', handler);
    },
  },
});
