/**
 * Enhanced React Hooks for 10x Development
 * Comprehensive hook library for efficient React development
 */

import { useState, useEffect, useRef, useCallback, useMemo, useContext, createContext, useReducer, Reducer } from 'react';

/**
 * State management hooks
 */

// Enhanced useState with persistence
export function useLocalStorageState<T>(key: string, initialValue: T): [T, (value: T | ((prevValue: T) => T)) => void] {
  const [state, setState] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback((value: T | ((prevValue: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(state) : value;
      setState(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, state]);

  return [state, setValue];
}

// Enhanced useState with undo/redo functionality
export function useUndoState<T>(initialValue: T) {
  const [history, setHistory] = useState<T[]>([initialValue]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const setState = useCallback((newValue: T | ((prevValue: T) => T)) => {
    const valueToSet = newValue instanceof Function ? newValue(history[currentIndex]) : newValue;
    const newHistory = history.slice(0, currentIndex + 1);
    newHistory.push(valueToSet);
    setHistory(newHistory);
    setCurrentIndex(newHistory.length - 1);
  }, [history, currentIndex]);

  const undo = useCallback(() => {
    setCurrentIndex(prev => Math.max(prev - 1, 0));
  }, []);

  const redo = useCallback(() => {
    setCurrentIndex(prev => Math.min(prev + 1, history.length - 1));
  }, [history.length]);

  const canUndo = currentIndex > 0;
  const canRedo = currentIndex < history.length - 1;

  return [
    history[currentIndex],
    setState,
    { undo, redo, canUndo, canRedo }
  ] as const;
}

// State with debounced updates
export function useDebounceState<T>(initialValue: T, delay: number = 300) {
  const [value, setValue] = useState(initialValue);
  const [debouncedValue, setDebouncedValue] = useState(initialValue);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const updateValue = useCallback((newValue: T | ((prevValue: T) => T)) => {
    const resolvedValue = newValue instanceof Function ? newValue(value) : newValue;
    setValue(resolvedValue);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setDebouncedValue(resolvedValue);
    }, delay);
  }, [value, delay]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return [value, updateValue, debouncedValue] as const;
}

/**
 * Effect hooks
 */

// Effect with cleanup tracking
export function useTrackedEffect(effect: () => void | (() => void), deps?: React.DependencyList) {
  const cleanupRef = useRef<(() => void) | void>();

  useEffect(() => {
    if (cleanupRef.current) {
      cleanupRef.current();
    }
    const result = effect();
    cleanupRef.current = result;
  }, deps);
}

// Effect that only runs on mount
export function useMountEffect(effect: () => void | (() => void)) {
  useEffect(effect, []);
}

// Effect that only runs on unmount
export function useUnmountEffect(effect: () => void) {
  useEffect(() => effect, []);
}

// Effect with conditional execution
export function useConditionalEffect(
  effect: () => void | (() => void),
  condition: boolean,
  deps?: React.DependencyList
) {
  useEffect(() => {
    if (condition) {
      return effect();
    }
  }, deps);
}

/**
 * Memoization hooks
 */

// Memoized callback with automatic dependency tracking
export function useMemoCallback<T extends (...args: any[]) => any>(callback: T, deps?: React.DependencyList): T {
  return useCallback(callback, deps);
}

// Memoized value with refresh capability
export function useRefreshableMemo<T>(
  factory: () => T,
  deps?: React.DependencyList,
  refreshDeps?: React.DependencyList
) {
  const [version, setVersion] = useState(0);

  const value = useMemo(factory, deps);

  const refresh = useCallback(() => {
    setVersion(prev => prev + 1);
  }, []);

  useEffect(() => {
    refresh();
  }, refreshDeps);

  return [value, refresh] as const;
}

/**
 * Ref hooks
 */

// Ref with previous value
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

// Ref with change callback
export function useRefWithCallback<T>(
  initialValue: T,
  onChange: (value: T, previousValue: T | undefined) => void
): React.MutableRefObject<T> {
  const ref = useRef(initialValue);
  const previous = usePrevious(ref.current);

  useEffect(() => {
    if (previous !== ref.current) {
      onChange(ref.current, previous);
    }
  });

  return ref;
}

// Managed ref that tracks mounted state
export function useMountedRef<T>(initialValue: T): React.MutableRefObject<T> {
  const ref = useRef(initialValue);
  const mountedRef = useRef(true);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  return {
    get current() {
      return ref.current;
    },
    set current(value: T) {
      if (mountedRef.current) {
        ref.current = value;
      }
    }
  };
}

/**
 * Lifecycle hooks
 */

// Hook to determine if component is mounted
export function useIsMounted(): () => boolean {
  const mountedRef = useRef(true);
  const isMounted = useCallback(() => mountedRef.current, []);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  return isMounted;
}

// Hook to determine if component is first render
export function useIsFirstRender(): boolean {
  const isFirst = useRef(true);

  if (isFirst.current) {
    isFirst.current = false;
    return true;
  }

  return false;
}

/**
 * Event hooks
 */

// Hook for handling keyboard events
export function useKeyboardEvent(
  key: string,
  handler: (event: KeyboardEvent) => void,
  options?: { event?: 'keydown' | 'keyup' | 'keypress'; target?: EventTarget }
) {
  const { event = 'keydown', target = window } = options || {};

  useEffect(() => {
    const handleEvent = (e: KeyboardEvent) => {
      if (e.key === key) {
        handler(e);
      }
    };

    target.addEventListener(event, handleEvent);
    return () => target.removeEventListener(event, handleEvent);
  }, [key, handler, event, target]);
}

// Hook for handling clicks outside an element
export function useClickOutside<T extends HTMLElement>(
  handler: () => void,
  ref?: React.RefObject<T>
) {
  const fallbackRef = useRef<T>(null);
  const elementRef = ref || fallbackRef;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (elementRef.current && !elementRef.current.contains(event.target as Node)) {
        handler();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handler, elementRef]);
}

/**
 * Data fetching hooks
 */

// Enhanced fetch hook with loading, error, and caching
export function useAsync<T>(
  asyncFunction: () => Promise<T>,
  deps: React.DependencyList = [],
  options: {
    initialData?: T;
    revalidateOnFocus?: boolean;
    revalidateOnReconnect?: boolean;
    cacheTime?: number;
  } = {}
) {
  const { initialData, revalidateOnFocus = true, revalidateOnReconnect = true, cacheTime = 5 * 60 * 1000 } = options;
  
  const [data, setData] = useState<T | undefined>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastFetched, setLastFetched] = useState<number | null>(null);
  const isMountedRef = useMountedRef(true);

  const execute = useCallback(async () => {
    if (lastFetched && Date.now() - lastFetched < cacheTime) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await asyncFunction();
      if (isMountedRef.current) {
        setData(result);
        setLastFetched(Date.now());
      }
    } catch (err) {
      if (isMountedRef.current) {
        setError(err instanceof Error ? err : new Error('An error occurred'));
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [asyncFunction, cacheTime, lastFetched, isMountedRef]);

  useEffect(() => {
    execute();
  }, deps);

  // Revalidate on focus
  useEffect(() => {
    if (!revalidateOnFocus) return;

    const handleFocus = () => {
      execute();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [revalidateOnFocus, execute]);

  // Revalidate on reconnect
  useEffect(() => {
    if (!revalidateOnReconnect) return;

    const handleReconnect = () => {
      execute();
    };

    window.addEventListener('online', handleReconnect);
    return () => window.removeEventListener('online', handleReconnect);
  }, [revalidateOnReconnect, execute]);

  return { data, loading, error, execute, refetch: execute };
}

// SWR (Stale While Revalidate) hook
export function useSWR<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: {
    initialData?: T;
    refreshInterval?: number;
  } = {}
) {
  const { initialData, refreshInterval } = options;
  const [data, setData] = useState<T | undefined>(initialData);
  const [error, setError] = useState<Error | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const isMountedRef = useMountedRef(true);

  const execute = useCallback(async () => {
    setIsValidating(true);
    try {
      const result = await fetcher();
      if (isMountedRef.current) {
        setData(result);
        setError(null);
      }
    } catch (err) {
      if (isMountedRef.current) {
        setError(err instanceof Error ? err : new Error('An error occurred'));
      }
    } finally {
      if (isMountedRef.current) {
        setIsValidating(false);
      }
    }
  }, [fetcher, isMountedRef]);

  useEffect(() => {
    execute();
  }, [key]); // Re-fetch when key changes

  // Auto-refresh if interval is provided
  useEffect(() => {
    if (!refreshInterval) return;

    const interval = setInterval(execute, refreshInterval);
    return () => clearInterval(interval);
  }, [refreshInterval, execute]);

  return { data, error, isValidating, mutate: execute };
}

/**
 * Form hooks
 */

// Controlled form state
export function useFormState<T extends Record<string, any>>(
  initialState: T,
  options: {
    validateOnChange?: boolean;
    validateOnBlur?: boolean;
  } = {}
) {
  const { validateOnChange = false, validateOnBlur = true } = options;
  const [values, setValues] = useState<T>(initialState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleChange = useCallback((name: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }));
    
    if (validateOnChange) {
      // In a real implementation, you'd run validation here
    }
    
    if (touched[name as string]) {
      // Re-validate if field was already touched
      // In a real implementation, you'd run validation here
    }
  }, [validateOnChange, touched]);

  const handleBlur = useCallback((name: keyof T) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    
    if (validateOnBlur) {
      // In a real implementation, you'd run validation here
    }
  }, [validateOnBlur]);

  const reset = useCallback(() => {
    setValues(initialState);
    setErrors({});
    setTouched({});
  }, [initialState]);

  const handleSubmit = useCallback(async (onSubmit: (values: T) => Promise<void> | void) => {
    // In a real implementation, you'd validate all fields here
    await onSubmit(values);
  }, [values]);

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    reset,
    handleSubmit,
    setFieldValue: (name: keyof T, value: any) => setValues(prev => ({ ...prev, [name]: value })),
    setFieldError: (name: keyof T, error: string) => setErrors(prev => ({ ...prev, [name]: error })),
  };
}

/**
 * Context hooks
 */

// Create context with hook
export function createContextHook<T>(
  displayName: string,
  defaultValue: T
): [React.Provider<T>, () => T] {
  const Context = createContext<T>(defaultValue);
  Context.displayName = displayName;

  const useCtx = () => {
    const ctx = useContext(Context);
    if (ctx === undefined) {
      throw new Error(`use${displayName} must be used within ${displayName}Provider`);
    }
    return ctx;
  };

  return [Context.Provider, useCtx];
}

/**
 * Animation hooks
 */

// Hook for CSS transitions
export function useTransition(
  show: boolean,
  options: {
    enterFrom?: string;
    enterTo?: string;
    leaveFrom?: string;
    leaveTo?: string;
    duration?: number;
  } = {}
) {
  const { 
    enterFrom = 'opacity-0 scale-95', 
    enterTo = 'opacity-100 scale-100', 
    leaveFrom = 'opacity-100 scale-100', 
    leaveTo = 'opacity-0 scale-95',
    duration = 150 
  } = options;

  const [transitionClass, setTransitionClass] = useState('');

  useEffect(() => {
    if (show) {
      setTransitionClass(enterFrom);
      // Trigger reflow
      void document.body.offsetHeight;
      setTransitionClass(enterTo);
    } else {
      setTransitionClass(leaveFrom);
      // Trigger reflow
      void document.body.offsetHeight;
      setTransitionClass(leaveTo);
    }
  }, [show, enterFrom, enterTo, leaveFrom, leaveTo]);

  return transitionClass;
}

/**
 * Performance hooks
 */

// Hook to measure render performance
export function useRenderCounter(componentName: string = 'Component') {
  const renderCount = useRef(0);
  
  useEffect(() => {
    renderCount.current += 1;
    console.debug(`${componentName} rendered ${renderCount.current} times`);
  });

  return renderCount.current;
}

// Hook to detect slow renders
export function useSlowRenderDetector(threshold: number = 16) {
  const startTime = useRef<number | null>(null);

  useEffect(() => {
    startTime.current = performance.now();
  });

  useEffect(() => {
    if (startTime.current) {
      const renderTime = performance.now() - startTime.current;
      if (renderTime > threshold) {
        console.warn(`Slow render detected: ${renderTime.toFixed(2)}ms`);
      }
    }
  });
}

/**
 * Utility hooks
 */

// Hook for managing timeouts
export function useTimeout(callback: () => void, delay: number | null) {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null) return;

    const id = setTimeout(() => savedCallback.current(), delay);
    return () => clearTimeout(id);
  }, [delay]);
}

// Hook for managing intervals
export function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null) return;

    const id = setInterval(() => savedCallback.current(), delay);
    return () => clearInterval(id);
  }, [delay]);
}

// Hook for measuring element dimensions
export function useElementSize<T extends HTMLElement>() {
  const [size, setSize] = useState({ width: 0, height: 0 });
  const ref = useRef<T>(null);

  useEffect(() => {
    const updateSize = () => {
      if (ref.current) {
        const { offsetWidth, offsetHeight } = ref.current;
        setSize({ width: offsetWidth, height: offsetHeight });
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  return [ref, size] as const;
}

// Hook for managing focus
export function useFocus<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  const setFocus = useCallback(() => {
    if (ref.current) {
      ref.current.focus();
    }
  }, []);

  return [ref, setFocus] as const;
}