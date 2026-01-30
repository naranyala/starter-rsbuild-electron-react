// Window factory for creating WinBox windows from use-cases
// Integrates use-case registry with WinBox for modular window management

import WinBox from 'winbox/src/js/winbox';
import { useCaseRegistry } from './registry';
import type { ContentSection, UseCase, WindowConfig } from './types';

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
 * Generates theme based on title hash
 */
function generateTheme(title: string): { bg: string; color: string } {
  const themes = [
    { bg: '#4a6cf7', color: 'white' },
    { bg: '#4ade80', color: 'black' },
    { bg: '#a78bfa', color: 'white' },
    { bg: '#f87171', color: 'white' },
    { bg: '#fbbf24', color: 'black' },
    { bg: '#6366f1', color: 'white' },
    { bg: '#ec4899', color: 'white' },
    { bg: '#14b8a6', color: 'white' },
    { bg: '#f97316', color: 'white' },
    { bg: '#6b7280', color: 'white' },
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

  // Determine theme
  const theme = customGenerateTheme ? customGenerateTheme() : generateTheme(metadata.title);

  // Generate content
  const content = generateContent();
  const htmlContent = contentSectionsToHtml(content);

  // Build window HTML
  const windowHtml = `
    <div class="winbox-content">
      <h3 style="color: ${theme.color};">${metadata.title}</h3>
      <div style="color: ${theme.color};" class="winbox-dynamic-content">
        ${htmlContent}
      </div>
    </div>
  `;

  // Create WinBox instance
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
    class: windowConfig.className ?? 'modern',
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
  const theme = generateTheme(title);
  const windowHtml = `
    <div class="winbox-content">
      <h3 style="color: ${theme.color};">${title}</h3>
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
    class: 'modern',
    background: theme.bg,
    border: 4,
  }) as WinBoxInstance;
}

export { contentSectionsToHtml, generateTheme };
