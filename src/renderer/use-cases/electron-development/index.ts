// Development Workflow - Use Case
// Provides window configuration and content for Electron development practices

import type { ContentSection, UseCase } from '../../types';

const metadata = {
  id: 'electron-development',
  title: 'Development Workflow',
  description: 'Best practices and tools for Electron development',
  category: 'development',
  tags: ['development', 'workflow', 'debugging', 'hmr', 'hot-reload'],
  searchableTerms: ['dev', 'debug', 'test', 'build', 'watch', 'reload', 'tools'],
};

const windowConfig = {
  id: 'electron-development',
  title: 'Development Workflow',
  dimensions: {
    width: '560px',
    height: '500px',
  },
  theme: {
    name: 'indigo',
    bg: '#6366f1',
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
        'Effective Electron development involves using tools like Hot Module Replacement (HMR), development servers, and proper debugging setups. Use electron-reload for automatic restarts during development.',
    },
    {
      type: 'heading',
      content: 'Development Tools',
      level: 3,
    },
    {
      type: 'list',
      content: 'Essential Tools',
      items: [
        'Hot Module Replacement (HMR) for fast iteration',
        'electron-reload for auto-restart on changes',
        'Chrome DevTools for renderer debugging',
        'Node.js debugger for main process',
        'TypeScript for type safety',
      ],
    },
    {
      type: 'heading',
      content: 'Debugging',
      level: 3,
    },
    {
      type: 'paragraph',
      content:
        'Debugging Electron applications can be done using Chrome DevTools for the renderer process and standard Node.js debugging tools for the main process.',
    },
    {
      type: 'list',
      content: 'Debugging Techniques',
      items: [
        'Open DevTools programmatically in development',
        'Use console logs strategically',
        'Set up VS Code debugging configuration',
        'Profile performance with DevTools',
        'Test on target platforms early',
      ],
    },
    {
      type: 'heading',
      content: 'Configuration Management',
      level: 3,
    },
    {
      type: 'paragraph',
      content:
        'Development workflow includes separate configurations for development and production, proper error handling, and using build tools to automate repetitive tasks.',
    },
    {
      type: 'list',
      content: 'Configuration Best Practices',
      items: [
        'Separate dev/prod environment configs',
        'Environment variables for secrets',
        'Linting and formatting tools (Biome, ESLint)',
        'Automated testing setup',
        'CI/CD pipeline integration',
      ],
    },
    {
      type: 'paragraph',
      content:
        'Testing Electron applications involves unit tests for business logic, integration tests for IPC communication, and end-to-end tests for user interactions.',
    },
  ];
}

export const electronDevelopmentUseCase: UseCase = {
  metadata,
  windowConfig,
  generateContent,
};

export default electronDevelopmentUseCase;
