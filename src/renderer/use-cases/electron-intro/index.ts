// What is Electron? - Use Case
// Provides window configuration and content for the Electron introduction topic

import type { ContentSection, UseCase, WindowTheme } from '../../types';

const metadata = {
  id: 'electron-intro',
  title: 'What is Electron?',
  description:
    'Introduction to Electron framework for building cross-platform desktop applications',
  category: 'framework',
  tags: ['electron', 'desktop', 'chromium', 'nodejs', 'cross-platform'],
  searchableTerms: [
    'framework',
    'web technologies',
    'html',
    'css',
    'javascript',
    'vs code',
    'slack',
    'discord',
  ],
};

const windowConfig = {
  id: 'electron-intro',
  title: 'What is Electron?',
  dimensions: {
    width: '550px',
    height: '450px',
  },
  theme: {
    name: 'blue',
    bg: '#4a6cf7',
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
        'Electron is a framework for building cross-platform desktop applications using web technologies like HTML, CSS, and JavaScript. It combines the Chromium rendering engine and the Node.js runtime.',
    },
    {
      type: 'paragraph',
      content:
        'With Electron, you can develop desktop applications that run on Windows, macOS, and Linux using familiar web technologies. Popular applications like Visual Studio Code, Slack, Discord, and WhatsApp Desktop are built with Electron.',
    },
    {
      type: 'list',
      content: 'Key Advantages',
      items: [
        'Single codebase for all platforms',
        'Access to native OS APIs',
        'Automatic updates and installers',
        'Large ecosystem of web libraries',
        'Active community and documentation',
      ],
    },
    {
      type: 'list',
      content: 'Core Components',
      items: [
        'Chromium - Renders the UI',
        'Node.js - Provides system access',
        'Native APIs - OS integration',
      ],
    },
    {
      type: 'paragraph',
      content:
        'Electron applications are essentially web applications packaged as native desktop apps, giving you the best of both worlds.',
    },
  ];
}

export const electronIntroUseCase: UseCase = {
  metadata,
  windowConfig,
  generateContent,
};

export default electronIntroUseCase;
