// IPC Integration for use-cases
// Registers all use-case handlers with electron's ipcMain

import { BrowserWindow, ipcMain } from 'electron';
import { electronUseCaseRegistry } from './index';

/**
 * Register all use-case IPC handlers
 * This function iterates through registered use-cases and registers their handlers
 */
export function registerUseCaseIpcHandlers(): void {
  const useCases = electronUseCaseRegistry.getAll();

  useCases.forEach((useCase) => {
    const { id, handlers } = useCase;

    Object.entries(handlers).forEach(([channel, handler]) => {
      // biome-ignore lint/suspicious/noExplicitAny: IPC handler signature
      ipcMain.handle(channel, async (event, ...args) => {
        const window = BrowserWindow.fromWebContents(event.sender);
        const context = {
          event,
          window: window,
        };

        try {
          return await handler(context, ...args);
        } catch (error) {
          console.error(`[IPC Error] ${channel}:`, error);
          return {
            success: false,
            error: `Handler error: ${(error as Error).message}`,
          };
        }
      });
    });

    console.log(`[main] Registered use-case IPC handlers for: ${id}`);
  });
}

/**
 * Unregister all use-case IPC handlers
 */
export function unregisterUseCaseIpcHandlers(): void {
  const useCases = electronUseCaseRegistry.getAll();

  useCases.forEach((useCase) => {
    const { handlers } = useCase;

    Object.keys(handlers).forEach((channel) => {
      ipcMain.removeHandler(channel);
    });

    console.log(`[main] Unregistered use-case IPC handlers for: ${useCase.id}`);
  });
}
