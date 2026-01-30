import { contextBridge, ipcRenderer } from 'electron';

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // IPC communication methods
  invoke: (channel: string, args?: any) => ipcRenderer.invoke(channel, args),
  send: (channel: string, args?: any) => ipcRenderer.send(channel, args),
  on: (channel: string, listener: (event: any, ...args: any[]) => void) =>
    ipcRenderer.on(channel, listener),
  once: (channel: string, listener: (event: any, ...args: any[]) => void) =>
    ipcRenderer.once(channel, listener),
  removeListener: (channel: string, listener: (event: any, ...args: any[]) => void) =>
    ipcRenderer.removeListener(channel, listener),

  // File system operations
  fs: {
    writeFile: (filePath: string, data: string) =>
      ipcRenderer.invoke('fs:write-file', { filePath, data }),
    readFile: (filePath: string) => ipcRenderer.invoke('fs:read-file', { filePath }),
    fileExists: (filePath: string) => ipcRenderer.invoke('fs:file-exists', { filePath }),
    deleteFile: (filePath: string) => ipcRenderer.invoke('fs:delete-file', { filePath }),
    listFiles: (dirPath: string) => ipcRenderer.invoke('fs:list-files', { dirPath }),
    getFileStats: (filePath: string) => ipcRenderer.invoke('fs:get-file-stats', { filePath }),
  },

  // Window operations
  window: {
    create: (id: string, config: any) => ipcRenderer.invoke('window:create', { id, config }),
    close: (id: string) => ipcRenderer.invoke('window:close', { id }),
    focus: (id: string) => ipcRenderer.invoke('window:focus', { id }),
    minimize: (id: string) => ipcRenderer.invoke('window:minimize', { id }),
    maximize: (id: string) => ipcRenderer.invoke('window:maximize', { id }),
    toggleFullscreen: (id: string) => ipcRenderer.invoke('window:toggle-fullscreen', { id }),
  },

  // App operations
  app: {
    quit: () => ipcRenderer.invoke('app:quit'),
    relaunch: () => ipcRenderer.invoke('app:relaunch'),
    hide: () => ipcRenderer.invoke('app:hide'),
    show: () => ipcRenderer.invoke('app:show'),
    getPath: (name: string) => ipcRenderer.invoke('app:get-path', { name }),
  },
});
