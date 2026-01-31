// What is Electron? - Main process use-case handlers
// Backend handlers for the Electron introduction use-case

import { shell } from 'electron';
import type { ElectronUseCase, IpcResponse, UseCaseHandlerContext } from './types';

const metadata = {
  id: 'electron-intro',
  title: 'What is Electron?',
  category: 'framework',
};

const handlers = {
  // biome-ignore lint/suspicious/noExplicitAny: IPC handler args
  'usecase:electron-intro:getInfo': async (): Promise<IpcResponse> => {
    return {
      success: true,
      data: {
        version: process.versions.electron,
        chrome: process.versions.chrome,
        node: process.versions.node,
        platform: process.platform,
        arch: process.arch,
      },
    };
  },

  // biome-ignore lint/suspicious/noExplicitAny: IPC handler args
  'usecase:electron-intro:openDocs': async (
    _context: UseCaseHandlerContext,
    url: string
  ): Promise<IpcResponse> => {
    try {
      await shell.openExternal(url || 'https://www.electronjs.org/docs');
      return { success: true, data: null };
    } catch (error) {
      return {
        success: false,
        error: `Failed to open URL: ${(error as Error).message}`,
      };
    }
  },
};

export const electronIntroMainUseCase: ElectronUseCase = {
  id: 'electron-intro',
  metadata,
  handlers,
};

export default electronIntroMainUseCase;
