/**
 * Global Store for WinBox Windows
 * Manages all active windows and provides centralized state management
 */

import { useState, useEffect } from 'react';

export interface WindowInfo {
  id: string;
  title: string;
  minimized: boolean;
  active: boolean;
  createdAt: Date;
  lastFocused: Date;
  content?: string;
  position?: { x: number; y: number };
  size?: { width: number; height: number };
}

export interface WindowStore {
  windows: WindowInfo[];
  activeWindowId: string | null;
  focusedWindowId: string | null;
  minimizedWindows: string[];
  maximizedWindows: string[];
  addWindow: (window: WindowInfo) => void;
  removeWindow: (id: string) => void;
  updateWindow: (id: string, updates: Partial<WindowInfo>) => void;
  setActiveWindow: (id: string | null) => void;
  setFocusedWindow: (id: string | null) => void;
  minimizeWindow: (id: string) => void;
  restoreWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  unmaximizeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  closeWindow: (id: string) => void;
  closeAllWindows: () => void;
  getWindowsByStatus: (status: 'active' | 'minimized' | 'maximized') => WindowInfo[];
  getWindowById: (id: string) => WindowInfo | undefined;
}

// Global state for all windows
let globalWindows: WindowInfo[] = [];
let globalActiveWindowId: string | null = null;
let globalFocusedWindowId: string | null = null;
let globalMinimizedWindows: string[] = [];
let globalMaximizedWindows: string[] = [];

// Listeners for state changes
const listeners: Array<() => void> = [];

// Notify all listeners when state changes
const notifyListeners = () => {
  listeners.forEach(listener => listener());
};

// Create the global store
const windowStore: WindowStore = {
  get windows() {
    return globalWindows;
  },
  get activeWindowId() {
    return globalActiveWindowId;
  },
  get focusedWindowId() {
    return globalFocusedWindowId;
  },
  get minimizedWindows() {
    return globalMinimizedWindows;
  },
  get maximizedWindows() {
    return globalMaximizedWindows;
  },

  addWindow(window: WindowInfo) {
    // Check if window already exists
    const existingIndex = globalWindows.findIndex(w => w.id === window.id);
    if (existingIndex !== -1) {
      globalWindows[existingIndex] = { ...globalWindows[existingIndex], ...window };
    } else {
      globalWindows.push(window);
    }
    notifyListeners();
  },

  removeWindow(id: string) {
    globalWindows = globalWindows.filter(window => window.id !== id);
    
    // Update active window if the removed window was active
    if (globalActiveWindowId === id) {
      globalActiveWindowId = globalWindows.length > 0 ? globalWindows[0].id : null;
    }
    
    // Update focused window if the removed window was focused
    if (globalFocusedWindowId === id) {
      globalFocusedWindowId = null;
    }
    
    // Remove from minimized/maximized lists if present
    globalMinimizedWindows = globalMinimizedWindows.filter(windowId => windowId !== id);
    globalMaximizedWindows = globalMaximizedWindows.filter(windowId => windowId !== id);
    
    notifyListeners();
  },

  updateWindow(id: string, updates: Partial<WindowInfo>) {
    const index = globalWindows.findIndex(window => window.id === id);
    if (index !== -1) {
      globalWindows[index] = { ...globalWindows[index], ...updates };
      notifyListeners();
    }
  },

  setActiveWindow(id: string | null) {
    globalActiveWindowId = id;
    if (id) {
      const windowIndex = globalWindows.findIndex(w => w.id === id);
      if (windowIndex !== -1) {
        globalWindows[windowIndex].lastFocused = new Date();
      }
    }
    notifyListeners();
  },

  setFocusedWindow(id: string | null) {
    globalFocusedWindowId = id;
    if (id) {
      const windowIndex = globalWindows.findIndex(w => w.id === id);
      if (windowIndex !== -1) {
        globalWindows[windowIndex].lastFocused = new Date();
      }
    }
    notifyListeners();
  },

  minimizeWindow(id: string) {
    if (!globalMinimizedWindows.includes(id)) {
      globalMinimizedWindows.push(id);
    }
    
    // Update window state
    const index = globalWindows.findIndex(window => window.id === id);
    if (index !== -1) {
      globalWindows[index].minimized = true;
    }
    
    // If this was the active window, set active to null or next available
    if (globalActiveWindowId === id) {
      const nextWindow = globalWindows.find(w => !globalMinimizedWindows.includes(w.id) && w.id !== id);
      globalActiveWindowId = nextWindow ? nextWindow.id : null;
    }
    
    notifyListeners();
  },

  restoreWindow(id: string) {
    globalMinimizedWindows = globalMinimizedWindows.filter(windowId => windowId !== id);
    
    // Update window state
    const index = globalWindows.findIndex(window => window.id === id);
    if (index !== -1) {
      globalWindows[index].minimized = false;
    }
    
    notifyListeners();
  },

  maximizeWindow(id: string) {
    if (!globalMaximizedWindows.includes(id)) {
      globalMaximizedWindows.push(id);
    }
    notifyListeners();
  },

  unmaximizeWindow(id: string) {
    globalMaximizedWindows = globalMaximizedWindows.filter(windowId => windowId !== id);
    notifyListeners();
  },

  focusWindow(id: string) {
    // Update focused window
    globalFocusedWindowId = id;
    
    // Update active window
    globalActiveWindowId = id;
    
    // Remove from minimized list if it was minimized
    globalMinimizedWindows = globalMinimizedWindows.filter(windowId => windowId !== id);
    
    // Update window state
    const index = globalWindows.findIndex(window => window.id === id);
    if (index !== -1) {
      globalWindows[index].minimized = false;
      globalWindows[index].lastFocused = new Date();
    }
    
    notifyListeners();
  },

  closeWindow(id: string) {
    this.removeWindow(id);
  },

  closeAllWindows() {
    globalWindows = [];
    globalActiveWindowId = null;
    globalFocusedWindowId = null;
    globalMinimizedWindows = [];
    globalMaximizedWindows = [];
    notifyListeners();
  },

  getWindowsByStatus(status: 'active' | 'minimized' | 'maximized'): WindowInfo[] {
    switch (status) {
      case 'active':
        return globalWindows.filter(window => 
          !globalMinimizedWindows.includes(window.id) && 
          window.id === globalActiveWindowId
        );
      case 'minimized':
        return globalWindows.filter(window => globalMinimizedWindows.includes(window.id));
      case 'maximized':
        return globalWindows.filter(window => globalMaximizedWindows.includes(window.id));
      default:
        return globalWindows;
    }
  },

  getWindowById(id: string): WindowInfo | undefined {
    return globalWindows.find(window => window.id === id);
  }
};

// React hook to use the global store
export const useWindowStore = (): WindowStore => {
  const [, forceUpdate] = useState({});

  useEffect(() => {
    const listener = () => forceUpdate({});
    listeners.push(listener);

    return () => {
      const index = listeners.indexOf(listener);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, []);

  return windowStore;
};

// Initialize window event listeners
if (typeof window !== 'undefined') {
  // Listen for window creation events
  window.addEventListener('window-created', (event: Event) => {
    const customEvent = event as CustomEvent<WindowInfo>;
    windowStore.addWindow(customEvent.detail);
  });

  // Listen for window focus events
  window.addEventListener('focus-window', (event: Event) => {
    const customEvent = event as CustomEvent<{ id: string; title: string }>;
    windowStore.focusWindow(customEvent.detail.id);
  });

  // Listen for window close events
  window.addEventListener('window-closed', (event: Event) => {
    const customEvent = event as CustomEvent<{ id: string }>;
    windowStore.removeWindow(customEvent.detail.id);
  });

  // Listen for window minimize events
  window.addEventListener('window-minimized', (event: Event) => {
    const customEvent = event as CustomEvent<{ id: string }>;
    windowStore.minimizeWindow(customEvent.detail.id);
  });

  // Listen for window restore events
  window.addEventListener('window-restored', (event: Event) => {
    const customEvent = event as CustomEvent<{ id: string }>;
    windowStore.restoreWindow(customEvent.detail.id);
  });
}

export default windowStore;