// Window factory for creating WinBox windows from use-cases
// Integrates use-case registry with WinBox for modular window management

import WinBox from 'winbox/src/js/winbox';
import type { ContentSection, UseCase, WindowConfig } from '../types';
import { useCaseRegistry } from './renderer-registry';

interface WinBoxInstance {
  // biome-ignore lint/suspicious/noExplicitAny: WinBox API
  close: () => any;
  body?: HTMLElement;
  // biome-ignore lint/suspicious/noExplicitAny: WinBox callback
  onclose?: () => any;
}

/**
 * Converts content sections to HTML string
 */
function contentSectionsToHtml(sections: ContentSection[] | string): string {
  if (typeof sections === 'string') {
    return sections;
  }

  return sections
    .map((section) => {
      switch (section.type) {
        case 'heading': {
          const level = section.level || 3;
          return `<h${level}>${section.content}</h${level}>`;
        }
        case 'paragraph':
          return `<p>${section.content}</p>`;
        case 'list': {
          const items = section.items?.map((item) => `<li>${item}</li>`).join('') || '';
          return `<h4>${section.content}</h4><ul>${items}</ul>`;
        }
        case 'custom':
          return section.content;
        default:
          return `<p>${section.content}</p>`;
      }
    })
    .join('');
}

/**
 * Generates dark theme based on title hash
 */
function generateDarkTheme(title: string): { bg: string; color: string } {
  const themes = [
    { bg: '#2d2d2d', color: '#e0e0e0' }, // Dark gray with light text
    { bg: '#1a1a1a', color: '#e0e0e0' }, // Very dark gray with light text
    { bg: '#252525', color: '#e0e0e0' }, // Secondary dark gray
    { bg: '#3a3a3a', color: '#ffffff' }, // Slightly lighter gray
    { bg: '#202020', color: '#f0f0f0' }, // Almost black with bright text
    { bg: '#333333', color: '#dcdcdc' }, // Medium dark gray
    { bg: '#282828', color: '#e8e8e8' }, // Dark gray with bright text
    { bg: '#1e1e1e', color: '#f5f5f5' }, // VS Code-like dark
    { bg: '#2b2b2b', color: '#eaeaea' }, // IntelliJ-like dark
    { bg: '#222222', color: '#ededed' }, // Near-black with light text
  ];

  let hash = 0;
  const lowerTitle = title.toLowerCase();
  for (let i = 0; i < lowerTitle.length; i++) {
    hash = lowerTitle.charCodeAt(i) + ((hash << 5) - hash);
  }

  const index = Math.abs(hash) % themes.length;
  return themes[index];
}

/**
 * Creates a WinBox window from a use-case
 */
export function createWindowFromUseCase(
  useCase: UseCase,
  position?: { x: number; y: number }
): WinBoxInstance {
  const { windowConfig, metadata, generateContent, generateTheme: customGenerateTheme } = useCase;

  // Determine theme - use dark theme by default
  const theme = customGenerateTheme ? customGenerateTheme() : generateDarkTheme(metadata.title);

  // Generate content
  const content = generateContent();
  const htmlContent = contentSectionsToHtml(content);

  // Build window HTML with dark theme styling
  const windowHtml = `
    <div class="winbox-content">
      <h3 style="color: ${theme.color}; margin-top: 0;">${metadata.title}</h3>
      <div style="color: ${theme.color};" class="winbox-dynamic-content">
        ${htmlContent}
      </div>
    </div>
  `;

  // Create WinBox instance with dark theme
  const winbox = new WinBox({
    title: metadata.title,
    html: windowHtml,
    width: windowConfig.dimensions.width,
    height: windowConfig.dimensions.height,
    minwidth: windowConfig.dimensions.minWidth,
    minheight: windowConfig.dimensions.minHeight,
    maxwidth: windowConfig.dimensions.maxWidth,
    maxheight: windowConfig.dimensions.maxHeight,
    x: position?.x ?? windowConfig.position?.x ?? 'center',
    y: position?.y ?? windowConfig.position?.y ?? 'center',
    class: windowConfig.className ?? 'modern dark-theme',
    background: windowConfig.theme?.bg ?? theme.bg,
    border: windowConfig.border ?? 4,
    modal: windowConfig.modal ?? false,
    ...windowConfig.additionalOptions,
  }) as WinBoxInstance;

  // Store callback for when window closes
  const originalClose = winbox.close;
  winbox.close = () => {
    if (useCase.onWindowClose) {
      useCase.onWindowClose();
    }
    return originalClose.call(winbox);
  };

  // Trigger on open callback
  setTimeout(() => {
    if (useCase.onWindowOpen) {
      useCase.onWindowOpen();
    }
  }, 10);

  return winbox;
}

/**
 * Creates a window by use-case ID
 */
export function createWindowById(
  id: string,
  position?: { x: number; y: number }
): WinBoxInstance | null {
  const useCase = useCaseRegistry.get(id);
  if (!useCase) {
    console.error(`Use-case with id "${id}" not found in registry`);
    return null;
  }
  return createWindowFromUseCase(useCase, position);
}

/**
 * Creates a window from menu item click
 * Maintains compatibility with existing Card component
 */
export function createWindowFromMenuItem(
  id: string,
  title: string,
  content?: string,
  position?: { x: number; y: number }
): WinBoxInstance {
  // Check if registered use-case exists
  const useCase = useCaseRegistry.get(id);
  if (useCase) {
    return createWindowFromUseCase(useCase, position);
  }

  // Fallback to dynamic window creation for unregistered items
  const theme = generateDarkTheme(title);
  const windowHtml = `
    <div class="winbox-content">
      <h3 style="color: ${theme.color}; margin-top: 0;">${title}</h3>
      <div style="color: ${theme.color};" class="winbox-dynamic-content">
        ${content || `<p>Content for "${title}"</p>`}
      </div>
    </div>
  `;

  return new WinBox({
    title: title,
    html: windowHtml,
    width: '500px',
    height: '400px',
    x: position?.x ?? 'center',
    y: position?.y ?? 'center',
    class: 'modern dark-theme',
    background: theme.bg,
    border: 4,
  }) as WinBoxInstance;
}

export { contentSectionsToHtml, generateDarkTheme };
