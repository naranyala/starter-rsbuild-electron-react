# Event Bus System

This document describes the Event Bus system for cross-process communication.

## Overview

The Event Bus enables communication between:

- Main process and renderer process
- Different renderer windows
- Components within the same process

## Main Process Event Bus

Located in `src/main/lib/EventBus.ts`:

```typescript
class MainEventBus implements EventBus {
  on<T>(event: string, callback: EventCallback<T>): void
  once<T>(event: string, callback: EventCallback<T>): void
  off(event: string, callback?: EventCallback): void
  emit<T>(event: string, data: T): void
  removeAllListeners(event?: string): void
}
```

## Renderer Event Bus

Located in `src/renderer/lib/EventBus.ts`:

```typescript
class RendererEventBus {
  on<T>(event: string, callback: EventCallback<T>): () => void
  once<T>(event: string, callback: EventCallback<T>): void
  off(event: string, callback?: EventCallback): void
  emit<T>(event: string, data: T): void
  emitToMain<T>(event: string, data: T): void
  emitToRenderer<T>(event: string, data: T, windowId?: number): void
}
```

## Event Types

Located in `src/shared/types/event-bus.ts`:

```typescript
export interface IEvent {
  type: EventType;
  data?: unknown;
  timestamp?: number;
  source?: string;
}

export interface EventHandlerOptions {
  once?: boolean;
  priority?: number;
}

export const EVENT_IPC_CHANNELS = {
  subscribe: 'event:subscribe',
  unsubscribe: 'event:unsubscribe',
  emit: 'event:emit',
  emitToRenderer: 'event:emit-to-renderer',
  received: 'event:received',
} as const;
```

## Event Constants

Located in `src/shared/constants/events.ts`:

```typescript
export const AppEvents = {
  READY: 'app:ready',
  QUIT: 'app:quit',
  BEFORE_QUIT: 'app:before-quit',
} as const;

export const WindowEvents = {
  CREATED: 'window:created',
  CLOSED: 'window:closed',
  FOCUSED: 'window:focused',
  MINIMIZED: 'window:minimized',
  MAXIMIZED: 'window:maximized',
  RESTORED: 'window:restored',
} as const;

export const FileEvents = {
  CREATED: 'file:created',
  DELETED: 'file:deleted',
  MODIFIED: 'file:modified',
} as const;
```

## IPC Bridge

Located in `src/main/ipc/event-bus-handlers.ts`:

- `event:subscribe` - Subscribe renderer to events
- `event:unsubscribe` - Unsubscribe from events
- `event:emit` - Emit to main process
- `event:emit-to-renderer` - Broadcast to renderers

## Usage

### Main Process

```typescript
import { eventBus } from './lib/EventBus';

// Subscribe
eventBus.on('user:login', (data) => {
  console.log('User logged in:', data);
});

// Emit
eventBus.emit('app:ready', { timestamp: Date.now() });
```

### Renderer

```typescript
import { eventBus } from './lib/EventBus';

// Subscribe
const unsubscribe = eventBus.on('app:ready', (data) => {
  console.log('App ready:', data);
});

// Emit to main
eventBus.emitToMain('user:action', { action: 'click' });

// Cleanup
unsubscribe();
```

### Using Preload API

```typescript
// Subscribe
const unsubscribe = window.electronAPI.event.subscribe('app:ready');

// Emit
window.electronAPI.event.emit('user:action', { action: 'click' });

// Unsubscribe
window.electronAPI.event.unsubscribe('app:ready');
```

## Best Practices

1. Use constants for event names
2. Always unsubscribe on component unmount
3. Use type-safe payloads
4. Avoid excessive event listeners
5. Use descriptive event names (`domain:action` format)
