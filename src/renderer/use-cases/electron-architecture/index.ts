// Electron Architecture - Use Case
// Provides window configuration and content for the Electron architecture topic

import type { ContentSection, UseCase } from '../../types';

const metadata = {
  id: 'electron-architecture',
  title: 'Electron Architecture',
  description: 'Understanding the main process, renderer process, and IPC communication',
  category: 'architecture',
  tags: ['main-process', 'renderer-process', 'ipc', 'architecture', 'multi-process'],
  searchableTerms: ['processes', 'communication', 'lifecycle', 'browserwindow', 'webcontents'],
};

const windowConfig = {
  id: 'electron-architecture',
  title: 'Electron Architecture',
  dimensions: {
    width: '600px',
    height: '500px',
  },
  theme: {
    name: 'purple',
    bg: '#a78bfa',
    color: 'white',
  },
  className: 'modern',
  border: 4,
};

function generateContent(): ContentSection[] {
  return [
    {
      type: 'heading',
      content: 'Multi-Process Architecture',
      level: 3,
    },
    {
      type: 'paragraph',
      content:
        'Electron applications have two main processes: the Main Process and the Renderer Process. The Main Process controls the life cycle of the app and creates browser windows. The Renderer Process renders the UI and runs in the browser window.',
    },
    {
      type: 'heading',
      content: 'Main Process',
      level: 4,
    },
    {
      type: 'list',
      content: 'Responsibilities',
      items: [
        'Application lifecycle management',
        'Creating and managing BrowserWindows',
        'System-level API access',
        'Menu and tray management',
        'IPC communication handling',
      ],
    },
    {
      type: 'heading',
      content: 'Renderer Process',
      level: 4,
    },
    {
      type: 'list',
      content: 'Characteristics',
      items: [
        'Runs in isolated Chromium environment',
        'Handles UI rendering and user interactions',
        'Limited access to Node.js APIs (with contextIsolation)',
        'Communicates with main via IPC',
        'Multiple renderers can exist simultaneously',
      ],
    },
    {
      type: 'heading',
      content: 'Inter-Process Communication',
      level: 4,
    },
    {
      type: 'paragraph',
      content:
        'Communication between processes happens via IPC (Inter-Process Communication). This architecture allows for secure separation of concerns while maintaining flexibility. Use ipcMain in the main process and ipcRenderer in the renderer process.',
    },
    {
      type: 'list',
      content: 'IPC Patterns',
      items: [
        'Synchronous and asynchronous messaging',
        'One-way and two-way communication',
        'Preload scripts as secure bridges',
      ],
    },
  ];
}

export const electronArchitectureUseCase: UseCase = {
  metadata,
  windowConfig,
  generateContent,
};

export default electronArchitectureUseCase;
