// Electron Architecture - Main process use-case handlers
// Backend handlers for architecture-related operations

import type { ElectronUseCase, IpcResponse } from './types';

const metadata = {
  id: 'electron-architecture',
  title: 'Electron Architecture',
  category: 'architecture',
};

const handlers = {
  // biome-ignore lint/suspicious/noExplicitAny: IPC handler args
  'usecase:electron-architecture:getProcessInfo': async (): Promise<IpcResponse> => {
    return {
      success: true,
      data: {
        pid: process.pid,
        ppid: process.ppid,
        type: 'browser', // Main process
        uptime: process.uptime(),
        memoryUsage: process.memoryUsage(),
        cpuUsage: process.cpuUsage(),
      },
    };
  },

  // biome-ignore lint/suspicious/noExplicitAny: IPC handler args
  'usecase:electron-architecture:getSystemInfo': async (): Promise<IpcResponse> => {
    return {
      success: true,
      data: {
        platform: process.platform,
        arch: process.arch,
        versions: process.versions,
        env: {
          NODE_ENV: process.env.NODE_ENV,
          ELECTRON_IS_DEV: process.env.ELECTRON_IS_DEV,
        },
      },
    };
  },
};

export const electronArchitectureMainUseCase: ElectronUseCase = {
  id: 'electron-architecture',
  metadata,
  handlers,
};

export default electronArchitectureMainUseCase;
