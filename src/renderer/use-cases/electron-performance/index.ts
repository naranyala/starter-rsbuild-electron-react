// Performance Optimization - Use Case
// Provides window configuration and content for Electron performance

import type { ContentSection, UseCase } from '../../types';

const metadata = {
  id: 'electron-performance',
  title: 'Performance Optimization',
  description: 'Techniques for optimizing Electron app performance and resource usage',
  category: 'performance',
  tags: ['performance', 'optimization', 'memory', 'startup-time', 'profiling'],
  searchableTerms: ['speed', 'efficiency', 'cpu', 'ram', 'loading', 'bundle size', 'lazy loading'],
};

const windowConfig = {
  id: 'electron-performance',
  title: 'Performance Optimization',
  dimensions: {
    width: '590px',
    height: '510px',
  },
  theme: {
    name: 'orange',
    bg: '#f97316',
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
        'Optimizing Electron apps involves reducing memory usage, improving startup time, and efficient resource management. Techniques include code splitting, lazy loading, proper cleanup of event listeners, and optimizing asset loading.',
    },
    {
      type: 'heading',
      content: 'Memory Management',
      level: 3,
    },
    {
      type: 'paragraph',
      content:
        'Memory management is crucial in Electron applications. Avoid memory leaks by properly cleaning up event listeners, timers, and references when windows are closed.',
    },
    {
      type: 'list',
      content: 'Memory Optimization Strategies',
      items: [
        'Remove event listeners on window close',
        'Clear intervals and timeouts properly',
        'Avoid circular references in closures',
        'Use WeakMap and WeakSet for caching',
        'Profile memory usage with DevTools',
      ],
    },
    {
      type: 'heading',
      content: 'Startup Performance',
      level: 3,
    },
    {
      type: 'paragraph',
      content:
        'Startup performance can be improved by optimizing the main process initialization and deferring non-critical operations until after the application has loaded.',
    },
    {
      type: 'list',
      content: 'Startup Optimization Tips',
      items: [
        'Minimize main process initialization code',
        'Show splash screen during loading',
        'Defer non-essential module loading',
        'Use code splitting and lazy imports',
        'Optimize webpack/bundler configuration',
      ],
    },
    {
      type: 'heading',
      content: 'Renderer Process Optimization',
      level: 3,
    },
    {
      type: 'paragraph',
      content:
        'Renderer process performance benefits from standard web optimization techniques: efficient JavaScript, optimized images, and proper use of web workers for heavy computations. Monitor performance with Chrome DevTools and consider using native modules for CPU-intensive tasks.',
    },
    {
      type: 'paragraph',
      content:
        'Efficient IPC communication also improves responsiveness. Minimize message size and frequency between processes.',
    },
  ];
}

export const electronPerformanceUseCase: UseCase = {
  metadata,
  windowConfig,
  generateContent,
};

export default electronPerformanceUseCase;
