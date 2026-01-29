// Main process utilities and configurations
// This lib folder contains code for the Electron main process

/**
 * Interface for application configuration
 */
export interface AppConfig {
  appName: string;
  version: string;
  mainWindow: {
    width: number;
    height: number;
    minWidth: number;
    minHeight: number;
    webPreferences: {
      nodeIntegration: boolean;
      contextIsolation: boolean;
      webSecurity: boolean;
    };
  };
}

/**
 * Interface for menu configuration
 */
export interface MenuConfig {
  fileMenu: {
    label: string;
    submenu: Array<{
      label?: string;
      accelerator?: string;
      type?: 'separator';
    }>;
  };
  viewMenu: {
    label: string;
    submenu: Array<{
      label?: string;
      accelerator?: string;
      type?: 'separator';
    }>;
  };
}

/**
 * Application configuration
 */
export const appConfig: AppConfig = {
  appName: 'Electron React Rsbuild App',
  version: '1.0.0',
  mainWindow: {
    width: 1024,
    height: 768,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false,
    },
  },
};

/**
 * Menu configuration for the main process
 */
export const mainMenuConfig: MenuConfig = {
  fileMenu: {
    label: 'File',
    submenu: [
      { label: 'New Window', accelerator: 'CmdOrCtrl+N' },
      { label: 'Open...', accelerator: 'CmdOrCtrl+O' },
      { type: 'separator' },
      { label: 'Settings', accelerator: 'CmdOrCtrl+,' },
      { type: 'separator' },
      { label: 'Quit', accelerator: 'CmdOrCtrl+Q' },
    ],
  },
  viewMenu: {
    label: 'View',
    submenu: [
      { label: 'Reload', accelerator: 'CmdOrCtrl+R' },
      { label: 'Toggle Developer Tools', accelerator: 'CmdOrCtrl+Shift+I' },
      { type: 'separator' },
      { label: 'Actual Size', accelerator: 'CmdOrCtrl+0' },
      { label: 'Zoom In', accelerator: 'CmdOrCtrl+=' },
      { label: 'Zoom Out', accelerator: 'CmdOrCtrl+-' },
    ],
  },
};
