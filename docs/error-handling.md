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
flatmap(result, fn) // Chain operations
getOrElse(result, default) // Get value or default
fromTry(fn)        // Wrap sync function
fromTryAsync(fn)   // Wrap async function
fromNullable(val, error) // Handle null/undefined
```

## Backend Services

### FileService

Located in `src/main/services/FileService.ts`:

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
  // ...
}
```

### Usage

```typescript
const result = await fileService.readFile('/path/to/file');
if (result.ok) {
  console.log(result.value); // Success
} else {
  console.error(result.error.code, result.error.message);
}
```

## Frontend Services

### IPC Result

Located in `src/renderer/lib/ipc-result.ts`:

```typescript
class IpcError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode?: number
  ) { super(message); this.name = 'IpcError'; }
}

async function invoke<T>(channel: string, args?: unknown): Promise<IpcResult<T>>
```

### Usage

```typescript
import { invoke, isOk } from './lib/ipc-result';

const result = await invoke<string>('fs:read-file', { filePath: '/test.txt' });
if (isOk(result)) {
  display(result.value);
} else {
  handleError(result.error.code);
}
```

## React Error Boundary

Located in `src/renderer/components/ui/ErrorBoundary/`.

### Usage

```tsx
import { ErrorBoundary } from './components/ui/ErrorBoundary';

<ErrorBoundary>
  <MyComponent />
</ErrorBoundary>
```

The ErrorBoundary catches render errors and displays a modal with error details and a retry button.

## Best Practices

1. Use Result types for fallible operations
2. Always handle both success and error cases
3. Provide meaningful error codes
4. Log errors appropriately
5. Use ErrorBoundary for render errors
