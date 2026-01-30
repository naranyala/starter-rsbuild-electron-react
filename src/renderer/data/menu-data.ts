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
    content: '',
    category: 'framework',
    tags: ['electron', 'desktop', 'chromium', 'nodejs', 'cross-platform'],
  },
  {
    id: 'electron-architecture',
    title: 'Electron Architecture',
    content: '',
    category: 'architecture',
    tags: ['main-process', 'renderer-process', 'ipc', 'architecture'],
  },
  {
    id: 'electron-security',
    title: 'Electron Security Best Practices',
    content: '',
    category: 'security',
    tags: ['security', 'context-isolation', 'csp', 'best-practices'],
  },
  {
    id: 'electron-packaging',
    title: 'Packaging and Distribution',
    content: '',
    category: 'packaging',
    tags: ['packaging', 'distribution', 'electron-builder', 'installer'],
  },
  {
    id: 'electron-native-apis',
    title: 'Native Operating System APIs',
    content: '',
    category: 'api',
    tags: ['native-api', 'file-system', 'notifications', 'dialogs'],
  },
  {
    id: 'electron-performance',
    title: 'Performance Optimization',
    content: '',
    category: 'performance',
    tags: ['performance', 'optimization', 'memory', 'startup-time'],
  },
  {
    id: 'electron-development',
    title: 'Development Workflow',
    content: '',
    category: 'development',
    tags: ['development', 'workflow', 'debugging', 'hmr'],
  },
  {
    id: 'electron-versions',
    title: 'Version Management',
    content: '',
    category: 'maintenance',
    tags: ['version', 'updates', 'compatibility', 'maintenance'],
  },
];

// Export function to refresh menu data from use-cases
export { generateMenuDataFromUseCases };

// Default export for backward compatibility
export default menuData;
