export interface WindowState {
  id: string;
  title: string;
  isMinimized: boolean;
  isMaximized: boolean;
  isFocused: boolean;
}

export interface WindowStateManager {
  getState(id: string): WindowState | undefined;
  setState(id: string, state: Partial<WindowState>): void;
  removeState(id: string): void;
  getAllStates(): WindowState[];
  getMinimizedIds(): string[];
}

export function createWindowStateManager(): WindowStateManager {
  const states = new Map<string, WindowState>();

  return {
    getState(id: string): WindowState | undefined {
      return states.get(id);
    },

    setState(id: string, state: Partial<WindowState>): void {
      const current = states.get(id) || {
        id,
        title: '',
        isMinimized: false,
        isMaximized: false,
        isFocused: false,
      };
      states.set(id, { ...current, ...state });
    },

    removeState(id: string): void {
      states.delete(id);
    },

    getAllStates(): WindowState[] {
      return Array.from(states.values());
    },

    getMinimizedIds(): string[] {
      return Array.from(states.entries())
        .filter(([, state]) => state.isMinimized)
        .map(([id]) => id);
    },
  };
}
