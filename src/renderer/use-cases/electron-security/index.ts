// Electron Security Best Practices - Use Case
// Provides window configuration and content for the Electron security topic

import type { ContentSection, UseCase } from '../../types';

const metadata = {
  id: 'electron-security',
  title: 'Electron Security Best Practices',
  description: 'Security guidelines and best practices for Electron applications',
  category: 'security',
  tags: ['security', 'context-isolation', 'csp', 'best-practices', 'sandbox'],
  searchableTerms: [
    'protection',
    'vulnerability',
    'xss',
    'injection',
    'sanitization',
    'validation',
  ],
};

const windowConfig = {
  id: 'electron-security',
  title: 'Electron Security Best Practices',
  dimensions: {
    width: '580px',
    height: '520px',
  },
  theme: {
    name: 'red',
    bg: '#f87171',
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
        'Security is crucial in Electron applications. Important practices include: enabling context isolation, disabling nodeIntegration when possible, using CSP (Content Security Policy), validating all input, and sanitizing user-provided content.',
    },
    {
      type: 'heading',
      content: 'Context Isolation',
      level: 3,
    },
    {
      type: 'paragraph',
      content:
        'Context Isolation is a security feature that ensures that your preload scripts and Electron internal logic run in a separate context to the website loaded in a WebContents. This prevents websites from accessing Electron internals or your preload script APIs.',
    },
    {
      type: 'list',
      content: 'Key Security Measures',
      items: [
        'Enable contextIsolation: true in webPreferences',
        'Disable nodeIntegration in renderer processes',
        'Use preload scripts to expose only necessary APIs',
        'Implement Content Security Policy headers',
        'Validate and sanitize all user inputs',
      ],
    },
    {
      type: 'heading',
      content: 'Content Security Policy',
      level: 3,
    },
    {
      type: 'paragraph',
      content:
        'Content Security Policy (CSP) helps prevent cross-site scripting (XSS) attacks by allowing you to restrict which resources can be loaded by the page. Define strict CSP rules to prevent execution of unauthorized scripts.',
    },
    {
      type: 'list',
      content: 'Additional Best Practices',
      items: [
        'Keep Electron and dependencies updated',
        'Use secure protocols (HTTPS) for external content',
        'Implement proper authentication mechanisms',
        'Audit dependencies for vulnerabilities',
        'Follow principle of least privilege',
      ],
    },
    {
      type: 'paragraph',
      content:
        'Always run Electron in a secure context and keep your dependencies updated. Follow the principle of least privilege for all operations.',
    },
  ];
}

export const electronSecurityUseCase: UseCase = {
  metadata,
  windowConfig,
  generateContent,
};

export default electronSecurityUseCase;
