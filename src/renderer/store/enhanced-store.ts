/**
 * Enhanced State Management Store for 10x Development
 * Comprehensive state management solution with multiple patterns
 */

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';

// Base types
export interface StoreState {
  [key: string]: any;
}

export type StateSelector<T, S> = (state: T) => S;
export type StateSetter<T> = (partial: Partial<T> | ((state: T) => Partial<T>)) => void;
export type StateListener<T> = (state: T, prevState: T) => void;
export type StateMiddleware<T> = (state: T, action: string, payload?: any) => T;

// Enhanced Store Interface
export interface EnhancedStore<T extends StoreState> {
  getState: () => T;
  setState: (partial: Partial<T> | ((state: T) => Partial<T>), replace?: boolean) => void;
  subscribe: (listener: StateListener<T>) => () => void;
  destroy: () => void;
  getSnapshot: () => T;
  useStore: <S>(selector: StateSelector<T, S>, equalityFn?: (a: S, b: S) => boolean) => S;
}

// Enhanced Store Implementation
class EnhancedStoreImpl<T extends StoreState> implements EnhancedStore<T> {
  private state: T;
  private listeners: Set<StateListener<T>> = new Set();
  private middlewares: StateMiddleware<T>[] = [];
  private snapshot: T;
  private subscribers: Map<number, { selector: StateSelector<T, any>; equalityFn: (a: any, b: any) => boolean; listener: () => void; id: number }> = new Map();
  private nextSubscriberId: number = 0;

  constructor(initialState: T, middlewares: StateMiddleware<T>[] = []) {
    this.state = { ...initialState };
    this.snapshot = { ...initialState };
    this.middlewares = [...middlewares];
  }

  getState(): T {
    return this.state;
  }

  setState(partial: Partial<T> | ((state: T) => Partial<T>), replace: boolean = false): void {
    const nextState = partial instanceof Function ? partial(this.state) : partial;
    
    // Apply middlewares
    let newState = { ...this.state, ...nextState };
    for (const middleware of this.middlewares) {
      newState = middleware(newState, 'SET_STATE', nextState);
    }

    if (replace) {
      this.state = newState as T;
    } else {
      this.state = { ...this.state, ...nextState } as T;
    }

    this.notifyListeners();
  }

  subscribe(listener: StateListener<T>): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  destroy(): void {
    this.listeners.clear();
    this.subscribers.clear();
  }

  getSnapshot(): T {
    return this.snapshot;
  }

  useStore<S>(
    selector: StateSelector<T, S>, 
    equalityFn: (a: S, b: S) => boolean = Object.is
  ): S {
    // This is a simplified implementation - in a real scenario, this would be a React hook
    // For now, we'll return the selected state
    return selector(this.state);
  }

  private notifyListeners(): void {
    const prevState = { ...this.snapshot };
    this.snapshot = { ...this.state };

    // Notify all listeners
    for (const listener of this.listeners) {
      try {
        listener(this.state, prevState);
      } catch (error) {
        console.error('Error in store listener:', error);
      }
    }

    // Notify subscribers with selectors
    for (const subscriber of this.subscribers.values()) {
      try {
        const currentState = selector(this.state);
        const previousState = selector(prevState);
        
        if (!equalityFn(currentState, previousState)) {
          subscriber.listener();
        }
      } catch (error) {
        console.error('Error in store subscriber:', error);
      }
    }
  }

  addMiddleware(middleware: StateMiddleware<T>): void {
    this.middlewares.push(middleware);
  }

  removeMiddleware(middleware: StateMiddleware<T>): boolean {
    const index = this.middlewares.indexOf(middleware);
    if (index !== -1) {
      this.middlewares.splice(index, 1);
      return true;
    }
    return false;
  }
}

// Zustand-like store creator
export function createStore<T extends StoreState>(
  stateCreator: (set: StateSetter<T>, get: () => T, api: EnhancedStore<T>) => T,
  middlewares: StateMiddleware<T>[] = []
): EnhancedStore<T> {
  let store: EnhancedStore<T>;
  const set: StateSetter<T> = (partial, replace) => {
    store.setState(partial, replace);
  };
  const get = () => store.getState();
  
  const initialState = stateCreator(set, get, {} as EnhancedStore<T>);
  store = new EnhancedStoreImpl(initialState, middlewares);
  
  // Re-call stateCreator with the actual store instance
  stateCreator(set, get, store);
  
  return store;
}

// Redux-like reducer pattern
export interface Action<T = any> {
  type: string;
  payload?: T;
}

export type Reducer<T extends StoreState, A extends Action = Action> = (state: T, action: A) => T;

export function createReduxStore<T extends StoreState, A extends Action = Action>(
  reducer: Reducer<T, A>,
  initialState: T,
  enhancer?: (createStore: typeof createStore) => typeof createStore
): EnhancedStore<T> {
  if (enhancer) {
    return enhancer(createStore)(() => initialState) as EnhancedStore<T>;
  }

  return createStore<T>((set) => {
    // Initial state is already provided
    return initialState;
  }).addMiddleware((state, action, payload) => {
    if (action === 'SET_STATE' && payload) {
      return reducer(state, { type: 'UPDATE', payload });
    }
    return state;
  });
}

// Context-based store provider
import { createContext, useContext } from 'react';

export function createTypedContext<T extends StoreState>(store: EnhancedStore<T>) {
  const Context = createContext<EnhancedStore<T> | null>(null);
  
  const Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return <Context.Provider value={store}>{children}</Context.Provider>;
  };

  const useStore = () => {
    const context = useContext(Context);
    if (!context) {
      throw new Error('useStore must be used within a StoreProvider');
    }
    return context;
  };

  return [Provider, useStore] as const;
}

// Selector hook for efficient state selection
export function useSelector<T extends StoreState, S>(
  store: EnhancedStore<T>,
  selector: StateSelector<T, S>,
  equalityFn: (a: S, b: S) => boolean = Object.is
): S {
  const [selectedState, setSelectedState] = useState(() => selector(store.getState()));
  
  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      const newState = selector(store.getState());
      if (!equalityFn(selectedState, newState)) {
        setSelectedState(newState);
      }
    });
    
    return unsubscribe;
  }, [store, selector, equalityFn]);

  return selectedState;
}

// Enhanced store with persistence
export class PersistentStore<T extends StoreState> extends EnhancedStoreImpl<T> {
  private storageKey: string;
  private storage: Storage;

  constructor(
    initialState: T,
    storageKey: string,
    storage: Storage = typeof window !== 'undefined' ? window.localStorage : null,
    middlewares: StateMiddleware<T>[] = []
  ) {
    // Try to load state from storage
    let persistedState = initialState;
    if (storage) {
      try {
        const stored = storage.getItem(storageKey);
        if (stored) {
          persistedState = { ...initialState, ...JSON.parse(stored) };
        }
      } catch (error) {
        console.error('Failed to load state from storage:', error);
      }
    }

    super(persistedState, middlewares);
    this.storageKey = storageKey;
    this.storage = storage;

    // Subscribe to state changes to persist them
    this.subscribe((state) => {
      if (this.storage) {
        try {
          this.storage.setItem(this.storageKey, JSON.stringify(state));
        } catch (error) {
          console.error('Failed to save state to storage:', error);
        }
      }
    });
  }
}

// Store with undo/redo functionality
export class UndoableStore<T extends StoreState> extends EnhancedStoreImpl<T> {
  private history: T[] = [];
  private currentIndex: number = 0;
  private maxHistory: number;

  constructor(
    initialState: T,
    maxHistory: number = 50,
    middlewares: StateMiddleware<T>[] = []
  ) {
    super(initialState, middlewares);
    this.history = [initialState];
    this.maxHistory = maxHistory;

    // Override setState to track history
    const originalSetState = this.setState.bind(this);
    this.setState = (partial, replace = false) => {
      const nextState = partial instanceof Function ? partial(this.getState()) : partial;
      const newState = { ...this.getState(), ...nextState } as T;

      // Add to history
      this.history = this.history.slice(0, this.currentIndex + 1);
      this.history.push(newState);
      
      if (this.history.length > this.maxHistory) {
        this.history.shift();
      } else {
        this.currentIndex = this.history.length - 1;
      }

      originalSetState(partial, replace);
    };
  }

  undo(): boolean {
    if (this.canUndo()) {
      this.currentIndex--;
      const prevState = this.history[this.currentIndex];
      super.setState(prevState as Partial<T>, true);
      return true;
    }
    return false;
  }

  redo(): boolean {
    if (this.canRedo()) {
      this.currentIndex++;
      const nextState = this.history[this.currentIndex];
      super.setState(nextState as Partial<T>, true);
      return true;
    }
    return false;
  }

  canUndo(): boolean {
    return this.currentIndex > 0;
  }

  canRedo(): boolean {
    return this.currentIndex < this.history.length - 1;
  }

  getHistory(): T[] {
    return [...this.history];
  }

  clearHistory(): void {
    this.history = [this.getState()];
    this.currentIndex = 0;
  }
}

// Store with async actions
export interface AsyncAction<T extends StoreState> {
  type: string;
  payload?: any;
  meta?: any;
}

export type AsyncThunk<T extends StoreState> = (
  dispatch: (action: AsyncAction<T>) => void,
  getState: () => T
) => Promise<void> | void;

export class AsyncStore<T extends StoreState> extends EnhancedStoreImpl<T> {
  constructor(initialState: T, middlewares: StateMiddleware<T>[] = []) {
    super(initialState, middlewares);
  }

  dispatch(action: AsyncAction<T> | AsyncThunk<T>): void {
    if (typeof action === 'function') {
      // It's an async thunk
      action(this.dispatch.bind(this), this.getState.bind(this));
    } else {
      // It's a regular action
      this.setState({ [action.type]: action.payload } as Partial<T>);
    }
  }
}

// Store with optimistic updates
export class OptimisticStore<T extends StoreState> extends EnhancedStoreImpl<T> {
  private optimisticUpdates: Map<string, { originalState: T; rollbackAction: () => void }> = new Map();

  constructor(initialState: T, middlewares: StateMiddleware<T>[] = []) {
    super(initialState, middlewares);
  }

  async dispatchOptimistic(
    optimisticUpdate: (state: T) => Partial<T>,
    asyncOperation: () => Promise<any>,
    rollbackOnError: boolean = true
  ): Promise<void> {
    const id = Date.now().toString();
    const originalState = { ...this.getState() };
    
    // Apply optimistic update
    const update = optimisticUpdate(this.getState());
    this.setState(update);
    
    // Store for potential rollback
    this.optimisticUpdates.set(id, {
      originalState,
      rollbackAction: () => this.setState(originalState)
    });

    try {
      await asyncOperation();
      // Success - remove the optimistic update record
      this.optimisticUpdates.delete(id);
    } catch (error) {
      if (rollbackOnError) {
        // Rollback on error
        const updateRecord = this.optimisticUpdates.get(id);
        if (updateRecord) {
          updateRecord.rollbackAction();
        }
      }
      this.optimisticUpdates.delete(id);
      throw error;
    }
  }

  rollbackOptimistic(id: string): boolean {
    const updateRecord = this.optimisticUpdates.get(id);
    if (updateRecord) {
      updateRecord.rollbackAction();
      this.optimisticUpdates.delete(id);
      return true;
    }
    return false;
  }
}

// Store with time travel debugging
export class TimeTravelStore<T extends StoreState> extends EnhancedStoreImpl<T> {
  private timeline: { state: T; action: string; timestamp: number }[] = [];
  private currentTime: number = 0;

  constructor(initialState: T, middlewares: StateMiddleware<T>[] = []) {
    super(initialState, middlewares);
    
    // Record initial state
    this.timeline.push({
      state: { ...initialState },
      action: 'INIT',
      timestamp: Date.now()
    });
  }

  setState(partial: Partial<T> | ((state: T) => Partial<T>), replace: boolean = false): void {
    const prevState = { ...this.getState() };
    super.setState(partial, replace);
    
    // Add to timeline
    this.timeline.push({
      state: { ...this.getState() },
      action: 'SET_STATE',
      timestamp: Date.now()
    });
    
    // Limit timeline size
    if (this.timeline.length > 100) {
      this.timeline.shift();
    }
  }

  goToState(index: number): boolean {
    if (index >= 0 && index < this.timeline.length) {
      this.currentTime = index;
      const targetState = this.timeline[index].state;
      super.setState(targetState as Partial<T>, true);
      return true;
    }
    return false;
  }

  goToTime(time: number): boolean {
    const closestState = this.timeline.reduce((prev, curr) => 
      Math.abs(curr.timestamp - time) < Math.abs(prev.timestamp - time) ? curr : prev
    );
    
    const index = this.timeline.indexOf(closestState);
    return this.goToState(index);
  }

  getTimeline(): { state: T; action: string; timestamp: number }[] {
    return [...this.timeline];
  }

  getCurrentTime(): number {
    return this.currentTime;
  }

  getTimelineLength(): number {
    return this.timeline.length;
  }
}

// Factory functions for common store types
export const createPersistentStore = <T extends StoreState>(
  initialState: T,
  storageKey: string,
  storage?: Storage
) => new PersistentStore(initialState, storageKey, storage);

export const createUndoableStore = <T extends StoreState>(
  initialState: T,
  maxHistory?: number
) => new UndoableStore(initialState, maxHistory);

export const createAsyncStore = <T extends StoreState>(
  initialState: T
) => new AsyncStore(initialState);

export const createOptimisticStore = <T extends StoreState>(
  initialState: T
) => new OptimisticStore(initialState);

export const createTimeTravelStore = <T extends StoreState>(
  initialState: T
) => new TimeTravelStore(initialState);