// Dynamic menu configuration for the frontend fuzzy search
// This allows for modular design where menu items can be easily updated
// Content is now generated dynamically from use-cases in renderer/use-cases/

import { type UseCase, useCaseRegistry } from '@renderer/use-cases';

// Define TypeScript interface for menu items
export interface MenuItem {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
}

// Menu data is now generated from registered use-cases
// This ensures the menu stays in sync with the use-case registry
function generateMenuDataFromUseCases(): MenuItem[] {
  const useCases = useCaseRegistry.getAll();

  return useCases.map((useCase: UseCase) => ({
    id: useCase.metadata.id,
    title: useCase.metadata.title,
    content: '', // Content is now generated dynamically by the use-case
    category: useCase.metadata.category,
    tags: useCase.metadata.tags,
  }));
}

// Static menu data for initial rendering (before registry loads)
// This provides the basic structure and is replaced by use-case data at runtime
export const menuData: MenuItem[] = [
  {
    id: 'electron-intro',
    title: 'What is Electron?',
    content: 'Introduction to Electron framework for building cross-platform desktop applications',
    category: 'framework',
    tags: ['electron', 'desktop', 'chromium', 'nodejs', 'cross-platform'],
  },
  {
    id: 'electron-architecture',
    title: 'Electron Architecture',
    content: 'Understanding the main and renderer process architecture',
    category: 'framework',
    tags: ['main-process', 'renderer-process', 'ipc', 'architecture'],
  },
  {
    id: 'electron-security',
    title: 'Electron Security Best Practices',
    content: 'Secure your Electron app with context isolation and CSP',
    category: 'security',
    tags: ['security', 'context-isolation', 'csp', 'best-practices'],
  },
  {
    id: 'electron-packaging',
    title: 'Packaging and Distribution',
    content: 'Package your Electron app for distribution on multiple platforms',
    category: 'packaging',
    tags: ['packaging', 'distribution', 'electron-builder', 'installer'],
  },
  {
    id: 'electron-native-apis',
    title: 'Native Operating System APIs',
    content: 'Access file system, notifications, and dialogs',
    category: 'api',
    tags: ['native-api', 'file-system', 'notifications', 'dialogs'],
  },
  {
    id: 'electron-performance',
    title: 'Performance Optimization',
    content: 'Optimize memory usage and startup time',
    category: 'performance',
    tags: ['performance', 'optimization', 'memory', 'startup-time'],
  },
  {
    id: 'electron-development',
    title: 'Development Workflow',
    content: 'Debugging and hot module replacement techniques',
    category: 'development',
    tags: ['development', 'workflow', 'debugging', 'hmr'],
  },
  {
    id: 'electron-versions',
    title: 'Version Management',
    content: 'Keep your Electron app updated with latest features',
    category: 'maintenance',
    tags: ['version', 'updates', 'compatibility', 'maintenance'],
  },
  // Mockup content for potential Electron.js integrations
  {
    id: 'electron-file-system',
    title: 'File System Integration',
    content: "Access and manipulate files on the user's system",
    category: 'api',
    tags: ['file-system', 'fs', 'read-write', 'local-storage'],
  },
  {
    id: 'electron-notifications',
    title: 'Desktop Notifications',
    content: 'Display native notifications to users',
    category: 'api',
    tags: ['notifications', 'alerts', 'system', 'messages'],
  },
  {
    id: 'electron-menu-bar',
    title: 'Custom Menu Bar',
    content: 'Create custom application menus and context menus',
    category: 'framework',
    tags: ['menu', 'context-menu', 'application-menu', 'tray'],
  },
  {
    id: 'electron-auto-updater',
    title: 'Auto Updater',
    content: 'Automatically update your application when new versions are released',
    category: 'packaging',
    tags: ['auto-update', 'updater', 'squirrel', 'publishing'],
  },
  {
    id: 'electron-tray-icon',
    title: 'System Tray Integration',
    content: 'Add your app to the system tray for quick access',
    category: 'framework',
    tags: ['tray', 'system-tray', 'icon', 'background'],
  },
  {
    id: 'electron-single-instance',
    title: 'Single Instance Application',
    content: 'Ensure only one instance of your app runs at a time',
    category: 'framework',
    tags: ['single-instance', 'instance-lock', 'duplicate', 'unique'],
  },
  {
    id: 'electron-crash-reporting',
    title: 'Crash Reporting',
    content: 'Collect crash reports to improve app stability',
    category: 'development',
    tags: ['crash-report', 'error-handling', 'logging', 'analytics'],
  },
  {
    id: 'electron-dev-tools',
    title: 'Developer Tools Integration',
    content: 'Integrate Chrome DevTools for debugging',
    category: 'development',
    tags: ['dev-tools', 'debugging', 'inspector', 'console'],
  },
  {
    id: 'electron-printing',
    title: 'Printing Capabilities',
    content: 'Enable printing functionality in your desktop app',
    category: 'api',
    tags: ['printing', 'print', 'pdf', 'document'],
  },
  {
    id: 'electron-clipboard',
    title: 'Clipboard Operations',
    content: 'Read from and write to the system clipboard',
    category: 'api',
    tags: ['clipboard', 'copy', 'paste', 'cut'],
  },
  {
    id: 'electron-screen-recording',
    title: 'Screen Recording',
    content: 'Capture screen content programmatically',
    category: 'api',
    tags: ['screen-recording', 'capture', 'media', 'recording'],
  },
  {
    id: 'electron-bluetooth',
    title: 'Bluetooth Integration',
    content: 'Connect to Bluetooth devices from your Electron app',
    category: 'api',
    tags: ['bluetooth', 'ble', 'device', 'connection'],
  },
  {
    id: 'electron-camera',
    title: 'Camera Access',
    content: 'Access camera and video streaming capabilities',
    category: 'api',
    tags: ['camera', 'video', 'streaming', 'media'],
  },
  {
    id: 'electron-websocket',
    title: 'WebSocket Communication',
    content: 'Real-time bidirectional communication with servers',
    category: 'framework',
    tags: ['websocket', 'real-time', 'communication', 'server'],
  },
  {
    id: 'electron-database',
    title: 'Local Database Storage',
    content: 'Store data locally using SQLite or other databases',
    category: 'framework',
    tags: ['database', 'sqlite', 'storage', 'persistence'],
  },
  {
    id: 'electron-analytics',
    title: 'Analytics Integration',
    content: 'Track user behavior and app usage metrics',
    category: 'development',
    tags: ['analytics', 'tracking', 'metrics', 'usage'],
  },
  {
    id: 'electron-theme',
    title: 'Dynamic Theming',
    content: 'Switch between light and dark themes dynamically',
    category: 'framework',
    tags: ['theme', 'dark-mode', 'light-mode', 'styling'],
  },
  {
    id: 'electron-i18n',
    title: 'Internationalization',
    content: 'Support multiple languages in your Electron app',
    category: 'framework',
    tags: ['i18n', 'internationalization', 'translation', 'locale'],
  },
  {
    id: 'electron-sandbox',
    title: 'Sandbox Mode',
    content: 'Run renderer processes in a secure sandbox',
    category: 'security',
    tags: ['sandbox', 'security', 'isolation', 'protection'],
  },
  {
    id: 'electron-network',
    title: 'Network Monitoring',
    content: 'Monitor network activity and connectivity',
    category: 'development',
    tags: ['network', 'connectivity', 'monitoring', 'offline'],
  },
];

// Export function to refresh menu data from use-cases
export { generateMenuDataFromUseCases };

// Default export for backward compatibility
export default menuData;
