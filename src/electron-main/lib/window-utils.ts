import { BrowserWindow, type Rectangle, screen } from 'electron';
import * as path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

/**
 * Utility functions for window management in the main process
 */

// For ES modules, __dirname is not available, so we need to derive it
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export interface WindowConfig {
  width: number;
  height: number;
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
  x?: number;
  y?: number;
  resizable?: boolean;
  fullscreen?: boolean;
  maximizable?: boolean;
  minimizable?: boolean;
  closable?: boolean;
  frame?: boolean;
  titleBarStyle?: 'default' | 'hidden' | 'hiddenInset' | 'customButtonsOnHover';
  trafficLightPosition?: { x: number; y: number };
  backgroundColor?: string;
  icon?: string;
  webPreferences?: {
    nodeIntegration?: boolean;
    contextIsolation?: boolean;
    webSecurity?: boolean;
    preload?: string;
  };
}

export interface WindowState {
  bounds: Rectangle;
  isMaximized: boolean;
  isFullScreen: boolean;
}

export class WindowManager {
  private static windows = new Map<string, BrowserWindow>();

  /**
   * Create a new window with the specified configuration
   */
  static createWindow(id: string, config: WindowConfig, isDev: boolean): BrowserWindow {
    // Get the primary display
    const primaryDisplay = screen.getPrimaryDisplay();
    const { width: screenWidth, height: screenHeight } = primaryDisplay.workArea;

    // Calculate default position if not provided
    const defaultX = config.x ?? Math.floor((screenWidth - config.width) / 2);
    const defaultY = config.y ?? Math.floor((screenHeight - config.height) / 2);

    // Create the browser window
    const window = new BrowserWindow({
      width: config.width,
      height: config.height,
      x: defaultX,
      y: defaultY,
      minWidth: config.minWidth,
      minHeight: config.minHeight,
      maxWidth: config.maxWidth,
      maxHeight: config.maxHeight,
      resizable: config.resizable ?? true,
      fullscreen: config.fullscreen ?? false,
      maximizable: config.maximizable ?? true,
      minimizable: config.minimizable ?? true,
      closable: config.closable ?? true,
      frame: config.frame,
      titleBarStyle: config.titleBarStyle,
      trafficLightPosition: config.trafficLightPosition,
      backgroundColor: config.backgroundColor,
      webPreferences: {
        nodeIntegration: config.webPreferences?.nodeIntegration ?? false,
        contextIsolation: config.webPreferences?.contextIsolation ?? true,
        webSecurity: config.webPreferences?.webSecurity ?? true,
        preload:
          config.webPreferences?.preload ??
          path.join(__dirname, '../../electron-preload/preload.js'),
      },
      icon: config.icon ?? path.join(__dirname, '../../assets/images/icon.png'),
    });

    // Store the window
    WindowManager.windows.set(id, window);

    // Load the appropriate content based on environment
    if (!isDev) {
      const startUrl = path.join(__dirname, '../../dist/index.html');
      window.loadFile(startUrl);
    } else {
      const devUrl = process.env.ELECTRON_START_URL || 'http://localhost:35703';
      void window.loadURL(devUrl);
    }

    // Handle window close
    window.on('closed', () => {
      WindowManager.windows.delete(id);
    });

    return window;
  }

  /**
   * Get a window by ID
   */
  static getWindow(id: string): BrowserWindow | undefined {
    return WindowManager.windows.get(id);
  }

  /**
   * Close a window by ID
   */
  static closeWindow(id: string): boolean {
    const window = WindowManager.getWindow(id);
    if (window && !window.isDestroyed()) {
      window.close();
      WindowManager.windows.delete(id);
      return true;
    }
    return false;
  }

  /**
   * Focus a window by ID
   */
  static focusWindow(id: string): boolean {
    const window = WindowManager.getWindow(id);
    if (window && !window.isDestroyed()) {
      window.focus();
      return true;
    }
    return false;
  }

  /**
   * Minimize a window by ID
   */
  static minimizeWindow(id: string): boolean {
    const window = WindowManager.getWindow(id);
    if (window && !window.isDestroyed()) {
      window.minimize();
      return true;
    }
    return false;
  }

  /**
   * Maximize a window by ID
   */
  static maximizeWindow(id: string): boolean {
    const window = WindowManager.getWindow(id);
    if (window && !window.isDestroyed()) {
      if (window.isMaximized()) {
        window.unmaximize();
      } else {
        window.maximize();
      }
      return true;
    }
    return false;
  }

  /**
   * Toggle fullscreen for a window by ID
   */
  static toggleFullscreen(id: string): boolean {
    const window = WindowManager.getWindow(id);
    if (window && !window.isDestroyed()) {
      window.setFullScreen(!window.isFullScreen());
      return true;
    }
    return false;
  }

  /**
   * Get all windows
   */
  static getAllWindows(): BrowserWindow[] {
    return Array.from(WindowManager.windows.values()).filter((window) => !window.isDestroyed());
  }

  /**
   * Close all windows
   */
  static closeAllWindows(): void {
    for (const [id] of WindowManager.windows) {
      WindowManager.closeWindow(id);
    }
  }

  /**
   * Save window state
   */
  static saveWindowState(window: BrowserWindow): WindowState {
    return {
      bounds: window.getBounds(),
      isMaximized: window.isMaximized(),
      isFullScreen: window.isFullScreen(),
    };
  }

  /**
   * Restore window state
   */
  static restoreWindowState(window: BrowserWindow, state: WindowState): void {
    if (state.isMaximized) {
      window.maximize();
    } else if (state.isFullScreen) {
      window.setFullScreen(true);
    } else {
      window.setBounds(state.bounds);
    }
  }
}
