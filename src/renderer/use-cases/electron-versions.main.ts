// Version Management - Main process use-case handlers
// Backend handlers for version and dependency information

import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { ElectronUseCase, IpcResponse } from './types';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const metadata = {
  id: 'electron-versions',
  title: 'Version Management',
  category: 'maintenance',
};

const handlers = {
  // biome-ignore lint/suspicious/noExplicitAny: IPC handler args
  'usecase:electron-versions:getVersions': async (): Promise<IpcResponse> => {
    return {
      success: true,
      data: {
        electron: process.versions.electron,
        chrome: process.versions.chrome,
        node: process.versions.node,
        v8: process.versions.v8,
        zlib: process.versions.zlib,
        openssl: process.versions.openssl,
        modules: process.versions.modules,
      },
    };
  },

  // biome-ignore lint/suspicious/noExplicitAny: IPC handler args
  'usecase:electron-versions:getDependencies': async (): Promise<IpcResponse> => {
    try {
      // Attempt to read package.json from app root
      const appPath = path.join(__dirname, '../../../..');
      const packageJsonPath = path.join(appPath, 'package.json');
      const content = await fs.readFile(packageJsonPath, 'utf-8');
      const packageJson = JSON.parse(content);

      return {
        success: true,
        data: {
          dependencies: packageJson.dependencies || {},
          devDependencies: packageJson.devDependencies || {},
          name: packageJson.name,
          version: packageJson.version,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to read package.json: ${(error as Error).message}`,
      };
    }
  },

  // biome-ignore lint/suspicious/noExplicitAny: IPC handler args
  'usecase:electron-versions:checkUpdateStatus': async (): Promise<IpcResponse> => {
    // In a real app, this would check for updates using electron-updater
    return {
      success: true,
      data: {
        updateAvailable: false,
        currentVersion: process.versions.electron,
        latestVersion: null,
        message: 'Update checking not implemented. Use electron-updater for production apps.',
      },
    };
  },
};

export const electronVersionsMainUseCase: ElectronUseCase = {
  id: 'electron-versions',
  metadata,
  handlers,
};

export default electronVersionsMainUseCase;
