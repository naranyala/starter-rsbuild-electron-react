import * as path from 'node:path';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { app, BrowserWindow, shell } from 'electron';
import { appConfig } from './config';
import { registerIpcHandlers } from './lib/ipc-handlers';
import { registerUseCaseIpcHandlers } from './use-cases';

// For ES modules, __dirname is not available, so we need to derive it
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow: BrowserWindow | null;

// Determine if the app is in development mode
const isDev = process.argv.some((arg) => arg === '--start-dev');

async function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: appConfig.mainWindow.width,
    height: appConfig.mainWindow.height,
    minWidth: appConfig.mainWindow.minWidth,
    minHeight: appConfig.mainWindow.minHeight,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: true,
      preload: path.join(__dirname, '../electron-preload/preload.js'), // Add preload script if needed
    },
    icon: path.join(__dirname, '../assets/images/icon.png'), // Add app icon
  });

  // Load the index.html when not in development
  if (!isDev) {
    const startUrl = path.join(__dirname, '../dist/index.html');
    mainWindow.loadFile(startUrl);
  } else {
    // Load the url from the dev server when in development mode
    const devUrl = process.env.ELECTRON_START_URL || 'http://localhost:35703';
    await mainWindow.loadURL(devUrl);

    // Don't open DevTools by default in development
    // Only open when needed for debugging
    // mainWindow.webContents.openDevTools({ mode: 'detach' });
  }

  // Emitted when the window is closed
  mainWindow.on('closed', () => {
    // Dereference the window object
    mainWindow = null;
  });

  // Handle navigation to external URLs in the default browser
  mainWindow.webContents.setWindowOpenHandler((details) => {
    void shell.openExternal(details.url);
    return { action: 'deny' };
  });
}

// This method will be called when Electron has finished initialization
app.on('ready', async () => {
  registerIpcHandlers();
  registerUseCaseIpcHandlers();
  createWindow();
});

// Quit when all windows are closed
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

// Handle app quitting
app.on('before-quit', () => {
  // Perform cleanup tasks here if needed
});
