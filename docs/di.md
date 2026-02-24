# Dependency Injection

This document describes the Dependency Injection (DI) system implemented in both backend and frontend.

## Overview

The project uses a custom DI container for managing service dependencies, providing better control over object creation and lifecycle.

## Backend (Main Process)

### Container Implementation

Located in `src/main/lib/container.ts`:

```typescript
class Container {
  register<T>(token, factory, singleton?): this
  registerInstance<T>(token, instance): this
  resolve<T>(token): T
  has(token): boolean
  createScope(): Container
}
```

### Service Tokens

Located in `src/main/lib/tokens.ts`. Uses Symbol for type-safe tokens:

```typescript
export const TYPES = {
  LOGGER: Symbol.for('Logger'),
  CONFIG: Symbol.for('Config'),
  WINDOW_SERVICE: Symbol.for('WindowService'),
  FILE_SERVICE: Symbol.for('FileService'),
  APP_SERVICE: Symbol.for('AppService'),
} as const;
```

### Services

Located in `src/main/services/`:

- **WindowService**: Window creation and management
- **FileService**: File operations with error handling
- **AppService**: App lifecycle management

### Usage

```typescript
import { getContainer, TYPES } from './lib/container';

const container = getContainer();
const logger = container.resolve(TYPES.LOGGER);
```

## Frontend (Renderer)

### React Context DI

Located in `src/renderer/lib/di.tsx`:

```typescript
function DIProvider({ container, children })
function useContainer(): Container
function useService<T>(token: string): T
```

### Service Factory

Located in `src/renderer/lib/services.ts`:

```typescript
function createContainer(): Container
function useLogger(): LoggerService
```

### Usage

```tsx
import { DIProvider, createContainer } from './lib/services';

// Wrap app
<DIProvider container={createContainer()}>
  <App />
</DIProvider>

// In component
import { useLogger } from './lib/services';
const logger = useLogger();
```

## Best Practices

1. Register services at app startup
2. Use singletons for shared services
3. Use tokens (Symbols) for type safety
4. Avoid circular dependencies
