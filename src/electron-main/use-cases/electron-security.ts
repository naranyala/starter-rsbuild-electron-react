// Electron Security - Main process use-case handlers
// Backend handlers for security-related operations

import type { ElectronUseCase, IpcResponse, UseCaseHandlerContext } from './types';

const metadata = {
  id: 'electron-security',
  title: 'Electron Security Best Practices',
  category: 'security',
};

const handlers = {
  // biome-ignore lint/suspicious/noExplicitAny: IPC handler args
  'usecase:electron-security:getSecurityStatus': async (): Promise<IpcResponse> => {
    return {
      success: true,
      data: {
        sandbox: process.argv.some((arg) => arg.includes('sandbox')),
        contextIsolation: true, // This should come from actual config
        nodeIntegration: false, // This should come from actual config
        enableRemoteModule: false,
        allowRunningInsecureContent: false,
        experimentalFeatures: false,
      },
    };
  },

  // biome-ignore lint/suspicious/noExplicitAny: IPC handler args
  'usecase:electron-security:validatePath': async (
    _context: UseCaseHandlerContext,
    filePath: string
  ): Promise<IpcResponse> => {
    try {
      // Basic path validation example
      const path = await import('node:path');
      const normalizedPath = path.normalize(filePath);
      const isAbsolute = path.isAbsolute(normalizedPath);

      return {
        success: true,
        data: {
          isValid: !normalizedPath.includes('..') || isAbsolute,
          normalized: normalizedPath,
          isAbsolute,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: `Path validation failed: ${(error as Error).message}`,
      };
    }
  },
};

export const electronSecurityMainUseCase: ElectronUseCase = {
  id: 'electron-security',
  metadata,
  handlers,
};

export default electronSecurityMainUseCase;
