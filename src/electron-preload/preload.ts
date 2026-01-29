import { contextBridge, ipcRenderer } from 'electron';

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Example API methods could be added here
  // send: (channel: string, data: any) => {
  //   ipcRenderer.invoke(channel, data);
  // },
  // receive: (channel: string, func: Function) => {
  //   const subscription = (event: Electron.IpcRendererEvent, ...args: any[]) => func(...args);
  //   ipcRenderer.on(channel, subscription);
  //   return () => ipcRenderer.removeListener(channel, subscription);
  // }
});