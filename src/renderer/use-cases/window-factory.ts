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
  // Additional properties for window state management
  id?: string;
  title?: string;
  minimize?: () => void;
  maximize?: () => void;
  focus?: () => void;
  isMinimized?: boolean;
  onFocus?: (callback: () => void) => void;
  onblur?: (callback: () => void) => void;
  hide?: () => void;
  show?: () => void;
  toggle?: () => void;
  dom?: HTMLElement;
}

// Store references to created windows
const windowInstances = new Map<string, WinBoxInstance>();

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

  // Generate a unique ID for the window
  const windowId = `${metadata.title}-${Date.now()}`;

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
    class: windowConfig.className ?? 'modern dark-theme', // Ensure dark theme class is applied
    background: windowConfig.theme?.bg ?? theme.bg, // Use generated dark theme background
    border: windowConfig.border ?? 4,
    modal: windowConfig.modal ?? false,
    ...windowConfig.additionalOptions,
  }) as WinBoxInstance;

  // Add ID and state tracking to the window instance
  winbox.id = windowId;

  // Track minimized state
  let isMinimizedState = false;
  let isActiveState = false; // Track if this window is currently active/focused
  winbox.isMinimized = isMinimizedState;

  // Override the minimize method to track state
  const originalMinimize = (winbox as any).minimize;
  winbox.minimize = () => {
    isMinimizedState = !isMinimizedState;
    winbox.isMinimized = isMinimizedState;

    // Dispatch event to notify the global store
    if (typeof window !== 'undefined') {
      const eventType = isMinimizedState ? 'window-minimized' : 'window-restored';
      const event = new CustomEvent(eventType, { detail: { id: winbox.id } });
      window.dispatchEvent(event);
    }

    if (originalMinimize) {
      originalMinimize.call(winbox);
    }
  };

  // Override the focus method
  const originalFocus = (winbox as any).focus;
  winbox.focus = () => {
    // Update active state
    isActiveState = true;

    // If the window is minimized, restore it first
    if (isMinimizedState && originalMinimize) {
      // Toggle to restore from minimized state
      originalMinimize.call(winbox);
      isMinimizedState = false;
      winbox.isMinimized = isMinimizedState;

      // Dispatch restored event
      if (typeof window !== 'undefined') {
        const event = new CustomEvent('window-restored', { detail: { id: winbox.id } });
        window.dispatchEvent(event);
      }
    }

    // Dispatch focus event
    if (typeof window !== 'undefined') {
      const event = new CustomEvent('focus-window', {
        detail: { id: winbox.id, title: winbox.title },
      });
      window.dispatchEvent(event);
    }

    if (originalFocus) {
      originalFocus.call(winbox);
    }
  };

  // Add blur event to track when window loses focus
  const originalOnblur = (winbox as any).on;
  if (originalOnblur) {
    originalOnblur.call(winbox, 'blur', () => {
      isActiveState = false;
    });
  }

  // Store callback for when window closes
  const originalClose = winbox.close;
  winbox.close = () => {
    if (useCase.onWindowClose) {
      useCase.onWindowClose();
    }
    // Remove from instances map when closed
    if (winbox.id) {
      windowInstances.delete(winbox.id);

      // Dispatch event to notify the global store
      if (typeof window !== 'undefined') {
        const event = new CustomEvent('window-closed', { detail: { id: winbox.id } });
        window.dispatchEvent(event);
      }
    }
    return originalClose.call(winbox);
  };

  // Trigger on open callback
  setTimeout(() => {
    if (useCase.onWindowOpen) {
      useCase.onWindowOpen();
    }
  }, 10);

  // Store the window instance
  if (winbox.id) {
    windowInstances.set(winbox.id, winbox);
  }

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
    class: 'modern dark-theme', // Ensure dark theme class is applied
    background: theme.bg, // Use generated dark theme background
    border: 4,
  }) as WinBoxInstance;
}

/**
 * Gets a window by ID
 */
export function getWindow(id: string): WinBoxInstance | undefined {
  return windowInstances.get(id);
}

/**
 * Finds a window by title
 */
export function getWindowByTitle(title: string): WinBoxInstance | undefined {
  for (const win of windowInstances.values()) {
    if (win.title === title) {
      return win;
    }
  }
  return undefined;
}

/**
 * Checks if a window exists by ID or title
 */
export function windowExists(idOrTitle: string): boolean {
  if (windowInstances.has(idOrTitle)) {
    return true;
  }
  return getWindowByTitle(idOrTitle) !== undefined;
}

/**
 * Checks if a window is minimized
 */
export function isWindowMinimized(id: string): boolean {
  const window = windowInstances.get(id);
  return window?.isMinimized === true;
}

/**
 * Checks if a window is currently active/focused
 */
export function isWindowActive(id: string): boolean {
  const window = windowInstances.get(id);
  // Note: We can't directly access the active state from the closure,
  // so we'll determine activity based on whether it's not minimized and has focus
  return window ? !window.isMinimized : false;
}

/**
 * Toggles a window's minimized state
 */
export function toggleWindow(id: string): boolean {
  const window = windowInstances.get(id);
  if (window && window.minimize) {
    window.minimize();
    return true;
  }
  return false;
}

/**
 * Minimizes all windows
 */
export function minimizeAll(): void {
  for (const window of windowInstances.values()) {
    if (window.minimize) {
      window.minimize();
    }
  }

  if (typeof window !== 'undefined') {
    windowInstances.forEach((win, id) => {
      const event = new CustomEvent('window-minimized', { detail: { id: id } });
      window.dispatchEvent(event);
    });
  }
}

/**
 * Maximizes a window
 */
export function maximizeWindow(id: string): boolean {
  const window = windowInstances.get(id);
  if (window && window.maximize) {
    window.maximize();
    return true;
  }
  return false;
}

const SIDEBAR_WIDTH = 280;

/**
 * Creates a fullscreen WinBox window that respects the sidebar width
 * Both the sidebar and window will be visible together
 */
export function createFullscreenWindow(
  id: string,
  title: string,
  content?: string
): WinBoxInstance {
  const theme = generateDarkTheme(title);
  const windowHtml = `
    <div class="winbox-content">
      <h3 style="color: ${theme.color}; margin-top: 0;">${title}</h3>
      <div style="color: ${theme.color};" class="winbox-dynamic-content">
        ${content || `<p>Content for "${title}"</p>`}
      </div>
    </div>
  `;

  const winbox = new WinBox({
    title: title,
    html: windowHtml,
    width: `calc(100vw - ${SIDEBAR_WIDTH}px)`,
    height: '100vh',
    x: SIDEBAR_WIDTH,
    y: 0,
    class: 'modern dark-theme',
    background: theme.bg,
    border: 0,
    top: 0,
    left: SIDEBAR_WIDTH,
  }) as WinBoxInstance;

  winbox.id = id;
  winbox.title = title;

  let isMinimizedState = false;
  winbox.isMinimized = isMinimizedState;

  const originalMinimize = (winbox as any).minimize;
  winbox.minimize = () => {
    isMinimizedState = !isMinimizedState;
    winbox.isMinimized = isMinimizedState;

    if (typeof window !== 'undefined') {
      const eventType = isMinimizedState ? 'window-minimized' : 'window-restored';
      const event = new CustomEvent(eventType, { detail: { id: winbox.id } });
      window.dispatchEvent(event);
    }

    if (originalMinimize) {
      originalMinimize.call(winbox);
    }
  };

  const originalFocus = (winbox as any).focus;
  winbox.focus = () => {
    if (typeof window !== 'undefined') {
      const event = new CustomEvent('focus-window', {
        detail: { id: winbox.id, title: winbox.title },
      });
      window.dispatchEvent(event);
    }
    if (originalFocus) {
      originalFocus.call(winbox);
    }
  };

  const originalClose = winbox.close;
  winbox.close = () => {
    if (winbox.id) {
      windowInstances.delete(winbox.id);
      if (typeof window !== 'undefined') {
        const event = new CustomEvent('window-closed', { detail: { id: winbox.id } });
        window.dispatchEvent(event);
      }
    }
    return originalClose.call(winbox);
  };

  windowInstances.set(winbox.id, winbox);

  setTimeout(() => {
    if (winbox.maximize) {
      winbox.maximize();
    }
  }, 50);

  return winbox;
}

export { contentSectionsToHtml, generateDarkTheme };
