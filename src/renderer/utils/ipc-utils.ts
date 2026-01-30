/**
 * IPC utilities for the renderer process to communicate with the main process
 */

interface IpcResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Send an asynchronous message to the main process and wait for a response
 */
export async function invokeIpc<T = any, R = any>(channel: string, args?: T): Promise<R> {
  if (typeof window !== 'undefined' && (window as any).electronAPI) {
    try {
      const response: IpcResponse<R> = await (window as any).electronAPI.invoke(channel, args);
      if (response.success) {
        return response.data as R;
      } else {
        throw new Error(response.error || `IPC call to '${channel}' failed`);
      }
    } catch (error) {
      console.error(`IPC invoke error for channel '${channel}':`, error);
      throw error;
    }
  } else {
    throw new Error('Electron API not available. Are you running in Electron environment?');
  }
}

/**
 * Send a synchronous message to the main process
 */
export function sendIpc<T = any>(channel: string, args?: T): void {
  if (typeof window !== 'undefined' && (window as any).electronAPI) {
    try {
      (window as any).electronAPI.send(channel, args);
    } catch (error) {
      console.error(`IPC send error for channel '${channel}':`, error);
      throw error;
    }
  } else {
    throw new Error('Electron API not available. Are you running in Electron environment?');
  }
}

/**
 * Listen for messages from the main process
 */
export function onIpc<T = any>(channel: string, listener: (data: T) => void): () => void {
  if (typeof window !== 'undefined' && (window as any).electronAPI) {
    try {
      (window as any).electronAPI.on(channel, listener);

      // Return a function to remove the listener
      return () => {
        (window as any).electronAPI.removeListener(channel, listener);
      };
    } catch (error) {
      console.error(`IPC listen error for channel '${channel}':`, error);
      throw error;
    }
  } else {
    throw new Error('Electron API not available. Are you running in Electron environment?');
  }
}

/**
 * Once listener for messages from the main process (removes itself after first call)
 */
export function onceIpc<T = any>(channel: string, listener: (data: T) => void): void {
  if (typeof window !== 'undefined' && (window as any).electronAPI) {
    try {
      (window as any).electronAPI.once(channel, listener);
    } catch (error) {
      console.error(`IPC once error for channel '${channel}':`, error);
      throw error;
    }
  } else {
    throw new Error('Electron API not available. Are you running in Electron environment?');
  }
}

/**
 * Helper function to check if running in Electron environment
 */
export function isElectron(): boolean {
  return typeof window !== 'undefined' && !!(window as any).electronAPI;
}

/**
 * File system operations through IPC
 */
export namespace FsOperations {
  export async function writeFile(filePath: string, data: string): Promise<void> {
    return invokeIpc('fs:write-file', { filePath, data });
  }

  export async function readFile(filePath: string): Promise<string> {
    return invokeIpc('fs:read-file', { filePath });
  }

  export async function fileExists(filePath: string): Promise<boolean> {
    return invokeIpc('fs:file-exists', { filePath });
  }

  export async function deleteFile(filePath: string): Promise<void> {
    return invokeIpc('fs:delete-file', { filePath });
  }

  export async function listFiles(dirPath: string): Promise<string[]> {
    return invokeIpc('fs:list-files', { dirPath });
  }

  export async function getFileStats(filePath: string): Promise<any> {
    return invokeIpc('fs:get-file-stats', { filePath });
  }
}

/**
 * Window management operations through IPC
 */
export namespace WindowOperations {
  export async function createWindow(id: string, config: any): Promise<void> {
    return invokeIpc('window:create', { id, config });
  }

  export async function closeWindow(id: string): Promise<boolean> {
    return invokeIpc('window:close', { id });
  }

  export async function focusWindow(id: string): Promise<boolean> {
    return invokeIpc('window:focus', { id });
  }

  export async function minimizeWindow(id: string): Promise<boolean> {
    return invokeIpc('window:minimize', { id });
  }

  export async function maximizeWindow(id: string): Promise<boolean> {
    return invokeIpc('window:maximize', { id });
  }

  export async function toggleFullscreen(id: string): Promise<boolean> {
    return invokeIpc('window:toggle-fullscreen', { id });
  }
}

/**
 * Application operations through IPC
 */
export namespace AppOperations {
  export async function quit(): Promise<void> {
    return invokeIpc('app:quit');
  }

  export async function relaunch(): Promise<void> {
    return invokeIpc('app:relaunch');
  }

  export async function hide(): Promise<void> {
    return invokeIpc('app:hide');
  }

  export async function show(): Promise<void> {
    return invokeIpc('app:show');
  }

  export async function getPath(name: string): Promise<string> {
    return invokeIpc('app:get-path', { name });
  }
}
