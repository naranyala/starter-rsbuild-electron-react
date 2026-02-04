# Enhanced Utilities for 10x Backend/Frontend Development

This project includes a comprehensive set of enhanced utilities designed to accelerate development by providing robust, reusable, and efficient solutions for common development challenges.

## Table of Contents
- [Overview](#overview)
- [Enhanced Main Process Utilities](#enhanced-main-process-utilities)
- [Enhanced Renderer Process Utilities](#enhanced-renderer-process-utilities)
- [Enhanced React Hooks](#enhanced-react-hooks)
- [Enhanced Services](#enhanced-services)
- [Enhanced State Management](#enhanced-state-management)
- [Best Practices](#best-practices)

## Overview

The enhanced utilities are organized into several categories to support 10x development:

- **Main Process Utilities**: Comprehensive tools for Electron main process operations
- **Renderer Process Utilities**: Robust utilities for frontend operations
- **React Hooks**: Advanced hooks for efficient state management and side effects
- **Services**: Enterprise-grade service layer for backend/frontend operations
- **State Management**: Multiple patterns for scalable state management

## Enhanced Main Process Utilities

Located in `src/main/lib/enhanced-main-utils.ts`, these utilities provide:

### File System Utilities (`FSUtils`)
- Enhanced file operations with progress tracking
- Recursive directory operations
- File hashing and integrity checking
- Cross-platform path handling

```typescript
import { FSUtils } from './enhanced-main-utils';

// Copy file with progress tracking
await FSUtils.copyFileWithProgress(
  '/path/to/source',
  '/path/to/destination',
  (progress) => console.log(`Progress: ${Math.round(progress * 100)}%`)
);

// Calculate file hash
const hash = await FSUtils.calculateHash('/path/to/file', 'sha256');
```

### System Utilities (`SystemUtils`)
- Comprehensive system information
- Process management with real-time output
- External URL/file opening
- System dialogs

```typescript
import { SystemUtils } from './enhanced-main-utils';

// Execute command with promise
const result = await SystemUtils.execCommand('ls -la', { timeout: 5000 });

// Spawn process with real-time output
const { process, promise } = SystemUtils.spawnProcess('npm', ['install']);
```

### Security Utilities (`SecurityUtils`)
- Cryptographic operations
- Path validation and sanitization
- Input validation
- Encryption/decryption

```typescript
import { SecurityUtils } from './enhanced-main-utils';

// Generate secure random values
const randomHex = SecurityUtils.randomHex(32);
const uuid = SecurityUtils.uuid();

// Encrypt/decrypt data
const { encrypted, iv } = SecurityUtils.encrypt('secret', 'password');
const decrypted = SecurityUtils.decrypt(encrypted, 'password', iv);
```

## Enhanced Renderer Process Utilities

Located in `src/renderer/lib/enhanced-renderer-utils.ts`, these utilities provide:

### DOM Utilities (`DOMUtils`)
- Element creation with options
- Visibility and viewport detection
- Clipboard operations
- Responsive utilities
- Animation helpers

```typescript
import { DOMUtils } from './enhanced-renderer-utils';

// Create element with options
const button = DOMUtils.createElement('button', {
  attributes: { type: 'submit' },
  classes: ['btn', 'btn-primary'],
  textContent: 'Submit'
});

// Check if element is in viewport
if (DOMUtils.isInViewport(element)) {
  // Do something
}
```

### Data Utilities (`DataUtils`)
- Deep cloning
- Array manipulation (unique, shuffle, chunk, groupBy)
- Type checking utilities
- Validation helpers

```typescript
import { DataUtils } from './enhanced-renderer-utils';

// Deep clone an object
const cloned = DataUtils.deepClone(originalObject);

// Group array by property
const grouped = DataUtils.groupBy(items, 'category');
```

### HTTP Utilities (`HttpUtils`)
- Typed HTTP methods (get, post, put, patch, delete)
- Download/upload with progress
- Request/response interceptors

```typescript
import { HttpUtils } from './enhanced-renderer-utils';

// Typed HTTP request
const user = await HttpUtils.get<User>('/api/users/123');

// Upload with progress
await HttpUtils.upload('/api/upload', file, (progress) => {
  console.log(`Upload progress: ${Math.round(progress * 100)}%`);
});
```

## Enhanced React Hooks

Located in `src/renderer/hooks/enhanced-hooks.ts`, these hooks provide:

### State Management Hooks
- `useLocalStorageState`: State synced with localStorage
- `useUndoState`: State with undo/redo functionality
- `useDebounceState`: Debounced state updates

```typescript
import { useLocalStorageState, useUndoState } from './enhanced-hooks';

// State persisted in localStorage
const [theme, setTheme] = useLocalStorageState('theme', 'light');

// State with undo/redo
const [value, setValue, { undo, redo, canUndo, canRedo }] = useUndoState('initial');
```

### Effect Hooks
- `useMountEffect`: Runs only on mount
- `useUnmountEffect`: Runs only on unmount
- `useConditionalEffect`: Conditional effect execution

### Data Fetching Hooks
- `useAsync`: Enhanced async data fetching with loading/error states
- `useSWR`: Stale-While-Revalidate pattern

```typescript
import { useAsync } from './enhanced-hooks';

// Async data fetching
const { data, loading, error, refetch } = useAsync(
  () => fetch('/api/users').then(r => r.json()),
  [],
  { cacheTime: 5 * 60 * 1000 } // 5 minutes cache
);
```

### Form Hooks
- `useFormState`: Comprehensive form state management
- Validation and error handling

## Enhanced Services

Located in `src/renderer/services/enhanced-services.ts`, these services provide:

### HTTP Service
Enterprise-grade HTTP client with interceptors, caching, and error handling.

```typescript
import { HttpService } from './enhanced-services';

const httpService = new HttpService({
  baseUrl: 'https://api.example.com',
  headers: { 'Authorization': 'Bearer token' },
  timeout: 10000
});

const users = await httpService.get('/users');
```

### Cache Service
Advanced caching with TTL, LRU eviction, and size limits.

```typescript
import { CacheService } from './enhanced-services';

const cache = new CacheService({ maxSize: 1000, defaultTTL: 5 * 60 * 1000 }); // 5 minutes
cache.set('key', 'value');
const value = cache.get('key');
```

### Storage Service
Unified storage abstraction with localStorage, sessionStorage, and in-memory fallbacks.

### Logging Service
Structured logging with multiple transports and log levels.

### Validation Service
Comprehensive validation with custom rules and sanitization.

## Enhanced State Management

Located in `src/renderer/store/enhanced-store.ts`, this provides multiple state management patterns:

### Basic Store
Simple state management with subscriptions.

```typescript
import { createStore } from './enhanced-store';

const store = createStore((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 }))
}));

const { count, increment } = store.getState();
```

### Persistent Store
State automatically saved to and loaded from storage.

```typescript
import { createPersistentStore } from './enhanced-store';

const persistentStore = createPersistentStore(
  { count: 0, name: 'app' },
  'app-storage-key'
);
```

### Undoable Store
State with built-in undo/redo functionality.

```typescript
import { createUndoableStore } from './enhanced-store';

const undoableStore = createUndoableStore({ text: '' });
undoableStore.setState({ text: 'Hello' });
undoableStore.undo(); // Reverts to previous state
```

### Time Travel Store
Debugging-friendly store with time travel capabilities.

## Best Practices

### 1. Use the Right Tool for the Job
- Use `useAsync` for data fetching instead of manual useEffect
- Use `createPersistentStore` for user preferences
- Use `SecurityUtils` for all security-sensitive operations

### 2. Leverage Type Safety
All utilities are fully typed. Take advantage of TypeScript's type inference.

### 3. Composition Over Inheritance
Combine utilities to build complex functionality:

```typescript
// Combine multiple utilities
const { data, loading } = useAsync(
  () => httpService.get<User>('/api/profile'),
  [userId],
  { initialData: cachedProfile }
);
```

### 4. Performance Considerations
- Use `useDebounceState` for frequently changing inputs
- Use `useSelector` with proper selectors to avoid unnecessary re-renders
- Use `useMemo` and `useCallback` appropriately

### 5. Error Handling
All utilities include proper error handling. Always handle potential errors in your components.

## Migration Guide

To migrate from the old utilities to the enhanced ones:

1. Replace imports from old utility files to the new enhanced ones
2. Update any custom implementations to use the enhanced utilities
3. Take advantage of new features like progress tracking, caching, and validation

## Contributing

The enhanced utilities are designed to be extensible. Feel free to add new utilities that follow the same patterns:

1. Organize by category (DOM, HTTP, Storage, etc.)
2. Use namespaces for grouping related functionality
3. Maintain consistent API patterns
4. Include comprehensive TypeScript types
5. Add proper error handling and validation