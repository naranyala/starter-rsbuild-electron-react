// Development Workflow - Main process use-case handlers
// Backend handlers for development utilities

import type { ElectronUseCase, IpcResponse, UseCaseHandlerContext } from './types';

const metadata = {
  id: 'electron-development',
  title: 'Development Workflow',
  category: 'development',
};

const handlers = {
  // biome-ignore lint/suspicious/noExplicitAny: IPC handler args
  'usecase:electron-development:getEnv': async (): Promise<IpcResponse> => {
    return {
      success: true,
      data: {
        NODE_ENV: process.env.NODE_ENV,
        ELECTRON_IS_DEV: process.env.ELECTRON_IS_DEV,
        DEBUG: process.env.DEBUG,
        // biome-ignore lint/suspicious/noExplicitAny: Process versions type
        versions: process.versions as Record<string, string>,
        platform: process.platform,
        arch: process.arch,
      },
    };
  },

  // biome-ignore lint/suspicious/noExplicitAny: IPC handler args
  'usecase:electron-development:reload': async (): Promise<IpcResponse> => {
    try {
      const { app } = await import('electron');
      app.relaunch();
      app.exit(0);
      return { success: true, data: null };
    } catch (error) {
      return {
        success: false,
        error: `Failed to reload: ${(error as Error).message}`,
      };
    }
  },

  // biome-ignore lint/suspicious/noExplicitAny: IPC handler args
  'usecase:electron-development:toggleDevTools': async (
    context: UseCaseHandlerContext
  ): Promise<IpcResponse> => {
    try {
      const { window } = context;
      if (!window) {
        return {
          success: false,
          error: 'Window not available',
        };
      }
      if (window.webContents.isDevToolsOpened()) {
        window.webContents.closeDevTools();
        return { success: true, data: { devToolsOpen: false } };
      } else {
        window.webContents.openDevTools();
        return { success: true, data: { devToolsOpen: true } };
      }
    } catch (error) {
      return {
        success: false,
        error: `Failed to toggle DevTools: ${(error as Error).message}`,
      };
    }
  },
};

export const electronDevelopmentMainUseCase: ElectronUseCase = {
  id: 'electron-development',
  metadata,
  handlers,
};

export default electronDevelopmentMainUseCase;
