// Version Management - Use Case
// Provides window configuration and content for Electron version management

import type { ContentSection, UseCase } from '../types';

const metadata = {
  id: 'electron-versions',
  title: 'Version Management',
  description: 'Managing Electron versions for stability and security',
  category: 'maintenance',
  tags: ['version', 'updates', 'compatibility', 'maintenance', 'changelog'],
  searchableTerms: ['upgrade', 'update', 'changelog', 'migration', 'breaking changes', 'semver'],
};

const windowConfig = {
  id: 'electron-versions',
  title: 'Version Management',
  dimensions: {
    width: '550px',
    height: '480px',
  },
  theme: {
    name: 'pink',
    bg: '#ec4899',
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
        'Managing Electron versions is important for stability and security. Regularly update to newer versions to get security patches and performance improvements. Consider the compatibility of Node.js and Chromium versions in each Electron release.',
    },
    {
      type: 'heading',
      content: 'Version Strategy',
      level: 3,
    },
    {
      type: 'list',
      content: 'Best Practices',
      items: [
        'Stay within 1-2 major versions of latest',
        'Subscribe to Electron security advisories',
        'Test thoroughly before major version upgrades',
        'Maintain consistent versions across team',
        'Document version-specific dependencies',
      ],
    },
    {
      type: 'heading',
      content: 'Chromium and Node.js Compatibility',
      level: 3,
    },
    {
      type: 'paragraph',
      content:
        'Each Electron version bundles specific Chromium and Node.js versions. Check the release notes for version matrices and ensure your application is compatible with the bundled runtime versions.',
    },
    {
      type: 'list',
      content: 'Compatibility Considerations',
      items: [
        'Native modules may need recompilation',
        'API changes between major versions',
        'Chromium feature availability',
        'Node.js API compatibility',
        'Breaking changes in release notes',
      ],
    },
    {
      type: 'heading',
      content: 'Dependency Management',
      level: 3,
    },
    {
      type: 'paragraph',
      content:
        'Keeping dependencies updated helps maintain security and performance. Use tools like npm audit to identify vulnerable packages.',
    },
    {
      type: 'list',
      content: 'Maintenance Tasks',
      items: [
        'Regular npm audit for vulnerabilities',
        'Update devDependencies for build tools',
        'Check peer dependency compatibility',
        'Review and prune unused dependencies',
        'Automate updates with Dependabot',
      ],
    },
    {
      type: 'paragraph',
      content:
        'Test your application thoroughly after version upgrades and maintain a consistent version across your team to avoid compatibility issues.',
    },
  ];
}

export const electronVersionsUseCase: UseCase = {
  metadata,
  windowConfig,
  generateContent,
};

export default electronVersionsUseCase;
