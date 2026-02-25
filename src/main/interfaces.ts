import type { BrowserWindow } from 'electron';

export interface WindowConfig {
  width?: number;
  height?: number;
  minWidth?: number;
  minHeight?: number;
  title?: string;
  preloadPath?: string;
  iconPath?: string;
}

export interface WindowState {
  id: string;
  isMinimized: boolean;
  isMaximized: boolean;
  isFocused: boolean;
}

export interface IWindowService {
  createMainWindow(config: WindowConfig): BrowserWindow;
  createWindow(id: string, config: WindowConfig): BrowserWindow | null;
  closeWindow(id: string): void;
  focusWindow(id: string): void;
  minimizeWindow(id: string): void;
  maximizeWindow(id: string): void;
  toggleFullscreen(id: string): void;
  getMainWindow(): BrowserWindow | null;
  getWindow(id: string): BrowserWindow | null;
  getWindowId(win: BrowserWindow): number | undefined;
}

export interface FileStats {
  size: number;
  created: Date;
  modified: Date;
  isFile: boolean;
  isDirectory: boolean;
}

export interface IFileService {
  writeFile(
    filePath: string,
    data: string
  ): Promise<import('../shared/types/result').Result<void, Error>>;
  readFile(filePath: string): Promise<import('../shared/types/result').Result<string, Error>>;
  deleteFile(filePath: string): Promise<import('../shared/types/result').Result<void, Error>>;
  listFiles(dirPath: string): Promise<import('../shared/types/result').Result<string[], Error>>;
  fileExists(filePath: string): Promise<import('../shared/types/result').Result<boolean, Error>>;
  getFileStats(
    filePath: string
  ): Promise<import('../shared/types/result').Result<FileStats, Error>>;
  registerHandlers(): void;
}

export interface IAppService {
  initialize(): void;
  registerAppHandlers(): void;
  handleWindowAllClosed(callback: () => void): void;
  handleActivate(callback: () => void): void;
  quit(): void;
  relaunch(): void;
  hide(): void;
  show(): void;
  getPath(name: string): string | undefined;
}
