# Error Handling

This document describes the error handling strategies implemented in the project.

## Result Type (Errors as Values)

Located in `src/shared/lib/result.ts`.

The project implements the Result pattern for explicit error handling without exceptions.

### Type Definition

```typescript
type Result<T, E = Error> = Ok<T> | Err<E>;

type Ok<T> = { ok: true; value: T };
type Err<E> = { ok: false; error: E };
```

### Creation Functions

```typescript
ok(value)           // Create success result
err(error)         // Create error result
```

### Helper Functions

```typescript
isOk(result)       // Type guard for success
isErr(result)      // Type guard for error
map(result, fn)    // Transform success value
mapErr(result, fn) // Transform error value
getOrElse(result, default) // Get value or default
getOrElseFn(result, fn)    // Get value or compute default
fromTry(fn)        // Wrap sync function
fromTryAsync(fn)   // Wrap async function
fromNullable(val)  // Handle null/undefined
```

## Multi-Layer Error Handling

### 1. Global Process Handlers

Located in `src/main/lib/error-handlers.ts`.

```typescript
setupGlobalErrorHandlers();    // uncaughtException, unhandledRejection
setupWindowErrorHandlers(win); // render-process-gone, did-fail-load
setupIpcErrorHandlers();       // IPC error logging
setupSignalHandlers();         // SIGINT, SIGTERM
logStartupInfo();             // App version, Electron version
```

### 2. IPC Input Validation

Located in `src/shared/lib/validation.ts` and `src/main/lib/ipc-validators.ts`.

```typescript
// Validators for IPC inputs
validateString(value, field)
validateNumber(value, field)
validateObject(value, field, schema)
validateFilePath(value, field)  // Prevents path traversal
validateOneOf(value, field, allowed)
```

### 3. Service Layer

Located in `src/main/services/FileService.ts`.

```typescript
class FileError extends Error {
  constructor(
    message: string,
    public code: string,
    public path?: string
  ) { super(message); this.name = 'FileError'; }
}

class FileService {
  async readFile(path: string): Promise<FileResult<string>>
  async writeFile(path: string, data: string): Promise<FileResult<void>>
}
```

### 4. React Error Boundary

Located in `src/renderer/lib/error-boundary.tsx`.

```typescript
// Setup error handlers in main.tsx
setupRendererErrorHandlers();

// Wrap app in ErrorBoundary
<ErrorBoundary>
  <App />
</ErrorBoundary>
```

Features:
- Catches React component errors
- Displays fallback UI with error message
- Provides reload button
- Logs errors to main process

### 5. DevTools Panel

All errors are logged to the integrated DevTools bottom panel:
- Console errors, warnings, info
- IPC errors from main process
- Uncaught exceptions
- Unhandled promise rejections

## Usage Examples

### Backend Service

```typescript
const result = await fileService.readFile('/path/to/file');
if (result.ok) {
  console.log(result.value); // Success
} else {
  console.error(result.error.code, result.error.message);
}
```

### Frontend IPC

```typescript
const result = await window.electronAPI.fs.readFile('/test.txt');
if (result.success) {
  display(result.data);
} else {
  handleError(result.error);
}
```

### Manual Error Logging

```typescript
import { sendToMainProcess } from './lib/error-boundary';

sendToMainProcess('error', {
  message: 'Something went wrong',
  stack: error.stack,
  source: 'MyComponent'
});
```

## Best Practices

1. Use Result types for fallible operations
2. Always handle both success and error cases
3. Validate all IPC inputs before processing
4. Use descriptive error codes
5. Log errors with appropriate context
6. Use ErrorBoundary for React component errors
7. Use the DevTools panel to debug issues
