// Packaging and Distribution - Main process use-case handlers
// Backend handlers for packaging-related operations

import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { ElectronUseCase, IpcResponse } from './types';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const metadata = {
  id: 'electron-packaging',
  title: 'Packaging and Distribution',
  category: 'packaging',
};

const handlers = {
  // biome-ignore lint/suspicious/noExplicitAny: IPC handler args
  'usecase:electron-packaging:getAppInfo': async (): Promise<IpcResponse> => {
    try {
      const { app } = await import('electron');
      return {
        success: true,
        data: {
          name: app.getName(),
          version: app.getVersion(),
          path: {
            appData: app.getPath('appData'),
            userData: app.getPath('userData'),
            temp: app.getPath('temp'),
            exe: app.getPath('exe'),
            module: app.getPath('module'),
          },
        },
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to get app info: ${(error as Error).message}`,
      };
    }
  },

  // biome-ignore lint/suspicious/noExplicitAny: IPC handler args
  'usecase:electron-packaging:getBuildInfo': async (): Promise<IpcResponse> => {
    return {
      success: true,
      data: {
        isPackaged: process.env.NODE_ENV === 'production',
        resourcesPath: process.resourcesPath,
        execPath: process.execPath,
        argv: process.argv,
      },
    };
  },
};

export const electronPackagingMainUseCase: ElectronUseCase = {
  id: 'electron-packaging',
  metadata,
  handlers,
};

export default electronPackagingMainUseCase;
