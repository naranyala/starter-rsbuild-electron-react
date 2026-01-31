// Electron Packaging and Distribution - Use Case
// Provides window configuration and content for packaging Electron apps

import type { ContentSection, UseCase } from '../../types';

const metadata = {
  id: 'electron-packaging',
  title: 'Packaging and Distribution',
  description: 'Tools and techniques for packaging Electron apps for distribution',
  category: 'packaging',
  tags: ['packaging', 'distribution', 'electron-builder', 'installer', 'deployment'],
  searchableTerms: ['build', 'release', 'deploy', 'exe', 'dmg', 'appimage', 'code-signing'],
};

const windowConfig = {
  id: 'electron-packaging',
  title: 'Packaging and Distribution',
  dimensions: {
    width: '560px',
    height: '480px',
  },
  theme: {
    name: 'green',
    bg: '#4ade80',
    color: 'black',
  },
  className: 'modern',
  border: 4,
};

function generateContent(): ContentSection[] {
  return [
    {
      type: 'paragraph',
      content:
        'Electron applications can be packaged for distribution using tools like electron-builder, electron-forge, or electron-packager. These tools create installable executables for Windows, macOS, and Linux.',
    },
    {
      type: 'heading',
      content: 'electron-builder',
      level: 3,
    },
    {
      type: 'paragraph',
      content:
        'electron-builder is a complete solution for packaging and building a ready-for-distribution Electron app. It supports multiple formats for each platform and provides advanced configuration options through package.json or a separate config file.',
    },
    {
      type: 'list',
      content: 'Supported Formats',
      items: [
        'Windows: MSI, NSIS, portable executable',
        'macOS: DMG, PKG, ZIP',
        'Linux: AppImage, DEB, RPM, Snap',
        'Auto-updater support',
        'Code signing integration',
      ],
    },
    {
      type: 'heading',
      content: 'Configuration',
      level: 3,
    },
    {
      type: 'paragraph',
      content:
        'Configuration includes app metadata, icons, installer options, and platform-specific settings. Proper packaging ensures a professional user experience across all platforms.',
    },
    {
      type: 'list',
      content: 'Key Configuration Options',
      items: [
        'App ID and metadata',
        'Icon files for each platform',
        'Installer customization',
        'Build targets and output directories',
        'File associations and protocols',
      ],
    },
    {
      type: 'heading',
      content: 'Code Signing',
      level: 3,
    },
    {
      type: 'paragraph',
      content:
        'Code signing is important for distributing Electron applications, especially on macOS and Windows. It verifies the authenticity of the application and prevents tampering. Auto-updater functionality can be implemented using libraries like electron-updater to provide seamless updates to users.',
    },
  ];
}

export const electronPackagingUseCase: UseCase = {
  metadata,
  windowConfig,
  generateContent,
};

export default electronPackagingUseCase;
