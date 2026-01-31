// Native Operating System APIs - Main process use-case handlers
// Backend handlers for native API demonstrations

import { clipboard, dialog, shell } from 'electron';
import type { ElectronUseCase, IpcResponse, UseCaseHandlerContext } from './types';

const metadata = {
  id: 'electron-native-apis',
  title: 'Native Operating System APIs',
  category: 'api',
};

const handlers = {
  // biome-ignore lint/suspicious/noExplicitAny: IPC handler args
  'usecase:electron-native-apis:showDialog': async (
    context: UseCaseHandlerContext,
    options: { type: string; title: string; message: string }
  ): Promise<IpcResponse> => {
    try {
      const { window } = context;
      if (!window) {
        return {
          success: false,
          error: 'Window not available',
        };
      }
      const result = await dialog.showMessageBox(window, {
        type: (options.type as 'info' | 'error' | 'question' | 'warning' | 'none') || 'info',
        title: options.title || 'Message',
        message: options.message || 'Hello from Electron!',
        buttons: ['OK', 'Cancel'],
      });
      return { success: true, data: result };
    } catch (error) {
      return {
        success: false,
        error: `Dialog failed: ${(error as Error).message}`,
      };
    }
  },

  // biome-ignore lint/suspicious/noExplicitAny: IPC handler args
  'usecase:electron-native-apis:getClipboard': async (): Promise<IpcResponse> => {
    try {
      const text = clipboard.readText();
      return {
        success: true,
        data: {
          text,
          hasText: clipboard.availableFormats().includes('text/plain'),
          formats: clipboard.availableFormats(),
        },
      };
    } catch (error) {
      return {
        success: false,
        error: `Clipboard read failed: ${(error as Error).message}`,
      };
    }
  },

  // biome-ignore lint/suspicious/noExplicitAny: IPC handler args
  'usecase:electron-native-apis:openExternal': async (
    _context: UseCaseHandlerContext,
    url: string
  ): Promise<IpcResponse> => {
    try {
      await shell.openExternal(url);
      return { success: true, data: null };
    } catch (error) {
      return {
        success: false,
        error: `Failed to open external URL: ${(error as Error).message}`,
      };
    }
  },

  // biome-ignore lint/suspicious/noExplicitAny: IPC handler args
  'usecase:electron-native-apis:showNotification': async (
    _context: UseCaseHandlerContext,
    options: { title: string; body: string }
  ): Promise<IpcResponse> => {
    try {
      // Notification permissions need to be checked in renderer
      // This is a main-process demonstration
      return {
        success: true,
        data: {
          message: `Notification would show: ${options.title} - ${options.body}`,
          note: 'Use renderer notification API for actual notifications',
        },
      };
    } catch (error) {
      return {
        success: false,
        error: `Notification failed: ${(error as Error).message}`,
      };
    }
  },
};

export const electronNativeApisMainUseCase: ElectronUseCase = {
  id: 'electron-native-apis',
  metadata,
  handlers,
};

export default electronNativeApisMainUseCase;
