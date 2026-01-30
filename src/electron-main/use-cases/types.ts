// Base types for electron-main use-cases
// Defines structure for backend handlers corresponding to renderer use-cases

import type { BrowserWindow, IpcMainInvokeEvent } from 'electron';

export interface UseCaseHandlerContext {
  window: BrowserWindow | null;
  event: IpcMainInvokeEvent;
}

export interface UseCaseHandler {
  // biome-ignore lint/suspicious/noExplicitAny: Handler return type varies
  (context: UseCaseHandlerContext, ...args: any[]): Promise<any> | any;
}

export interface UseCaseHandlers {
  [channel: string]: UseCaseHandler;
}

export interface ElectronUseCase {
  id: string;
  // biome-ignore lint/suspicious/noExplicitAny: Metadata structure matches renderer
  metadata: Record<string, any>;
  handlers: UseCaseHandlers;
  onRegister?: () => void;
  onUnregister?: () => void;
}

export type ElectronUseCaseRegistry = Map<string, ElectronUseCase>;

// IPC Response structure
export interface IpcResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
