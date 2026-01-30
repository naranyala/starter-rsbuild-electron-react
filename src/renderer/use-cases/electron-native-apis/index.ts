// Native Operating System APIs - Use Case
// Provides window configuration and content for Electron native APIs

import type { ContentSection, UseCase } from '../types';

const metadata = {
  id: 'electron-native-apis',
  title: 'Native Operating System APIs',
  description: 'Access native OS features through Electron APIs',
  category: 'api',
  tags: ['native-api', 'file-system', 'notifications', 'dialogs', 'clipboard', 'tray'],
  searchableTerms: ['os', 'operating system', 'system', 'shell', 'menu', 'dialog', 'fs', 'path'],
};

const windowConfig = {
  id: 'electron-native-apis',
  title: 'Native Operating System APIs',
  dimensions: {
    width: '570px',
    height: '490px',
  },
  theme: {
    name: 'teal',
    bg: '#14b8a6',
    color: 'white',
  },
  className: 'modern',
  border: 4,
};

function generateContent(): ContentSection[] {
  return [
    {
      type: 'paragraph',
      content:
        'Electron provides access to native OS features through its APIs: file system operations, dialog boxes, notifications, tray icons, clipboard, and more. These APIs bridge the gap between web technologies and desktop functionality.',
    },
    {
      type: 'heading',
      content: 'Core Native APIs',
      level: 3,
    },
    {
      type: 'list',
      content: 'File System and Dialogs',
      items: [
        'File open/save dialogs with filters',
        'Directory selection dialogs',
        'Message boxes and confirmation dialogs',
        'Native file drag and drop support',
        'Recent documents management',
      ],
    },
    {
      type: 'list',
      content: 'System Integration',
      items: [
        'System notifications with actions',
        'Tray icons with context menus',
        'Dock/taskbar integration',
        'Global keyboard shortcuts',
        'Power monitor and system events',
      ],
    },
    {
      type: 'heading',
      content: 'Inter-Process Communication',
      level: 3,
    },
    {
      type: 'paragraph',
      content:
        'IPC (Inter-Process Communication) is used to communicate between the main and renderer processes. Use ipcMain in the main process and ipcRenderer in the renderer process to enable secure communication.',
    },
    {
      type: 'list',
      content: 'Powerful API Modules',
      items: [
        'app - Application lifecycle and events',
        'BrowserWindow - Window management',
        'Menu - Application and context menus',
        'Tray - System tray integration',
        'nativeImage - Platform image handling',
      ],
    },
    {
      type: 'paragraph',
      content:
        'Preload scripts can be used to expose specific APIs to the renderer process while maintaining security through context isolation.',
    },
  ];
}

export const electronNativeApisUseCase: UseCase = {
  metadata,
  windowConfig,
  generateContent,
};

export default electronNativeApisUseCase;
