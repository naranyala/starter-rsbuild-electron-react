# Architecture

This document describes the system architecture of the Electron + React + Rsbuild application.

## Process Model

The application follows the standard Electron architecture with three main processes:

```
+-------------------+     +-------------------+     +-------------------+
|   Main Process    |     |  Preload Script  |     | Renderer Process |
|   (Node.js)       |     |   (ContextBridge)|     |    (Chromium)    |
+-------------------+     +-------------------+     +-------------------+
|                   |     |                   |     |                   |
| - Window mgmt    | <-> | - IPC bridge     | <-> | - React UI       |
| - File system    |     | - Channel whitelist|    | - State mgmt    |
| - App lifecycle  |     | - Type-safe API  |     | - Use-cases     |
| - Native APIs    |     |                   |     |                   |
+-------------------+     +-------------------+     +-------------------+
```

## Main Process

The main process runs in Node.js and handles:

- **Window Management**: Creating, managing, and destroying BrowserWindow instances
- **File Operations**: Reading, writing, and managing files via FileService
- **App Lifecycle**: Handling app ready, activate, and quit events
- **IPC Handlers**: Registering handlers for all IPC channels
- **Native APIs**: Dialogs, clipboard, notifications, shell operations

Entry point: `src/main/main.ts`

### Security Defaults

```typescript
{
  nodeIntegration: false,
  contextIsolation: true,
  webSecurity: true
}
```

### Services

- `AppService`: Application lifecycle and window coordination
- `FileService`: File system operations with Result type error handling
- `WindowService`: BrowserWindow creation and management

### Key Files

- `src/main/main.ts`: App entry point, initialization
- `src/main/lib/error-handlers.ts`: Global error handlers
- `src/main/lib/logger.ts`: Logging via electron-log
- `src/main/services/`: Service implementations
- `src/main/config/app-config.ts`: App configuration
- `src/main/ipc/`: IPC handler registration

## Preload Script

The preload script runs in a privileged context and exposes a limited, type-safe API to the renderer via ContextBridge.

Entry point: `src/preload/preload.ts`

### Security Features

- **Channel Whitelisting**: Only documented channels are accessible
- **ALLOWED_INVOKE_CHANNELS**: Whitelist for ipcRenderer.invoke
- **ALLOWED_SEND_CHANNELS**: Whitelist for ipcRenderer.send
- **ALLOWED_ON_CHANNELS**: Whitelist for event listeners
- **Input Validation**: All IPC arguments validated before reaching handlers

### Exposed API

```typescript
window.electronAPI = {
  invoke,      // Call IPC handlers (whitelisted channels only)
  send,        // Send one-way messages
  on,          // Listen for events (whitelisted channels only)
  fs: { ... }, // File system operations
  window: { ... }, // Window controls
  app: { ... },   // App controls
  log: { ... },   // Logging
  event: { ... }  // Event bus
}
```

## Renderer Process

The renderer process runs in Chromium and hosts the React application.

### Key Files

- `src/renderer/main.tsx`: React entry point
- `src/renderer/components/`: React components
- `src/renderer/use-cases/`: Use-case system, window-factory
- `src/renderer/store/window-store.ts`: Window state management

### Features

- **WinBox Integration**: Floating window management
- **Window Store**: Global state management for windows
- **Use-Case Registry**: Dynamic content loading system
- **DevTools Panel**: Integrated debugging bottom bar

## Shared Code

Code shared between main and renderer processes is in `src/shared/`:

- `src/shared/types/`: TypeScript types (IPC channels, event bus types, Result)
- `src/shared/lib/`: Utilities (validation, Result pattern, common utilities)

## Event Flow

### IPC Communication

1. Renderer calls preload API (`window.electronAPI.fs.readFile`)
2. Preload validates channel against whitelist
3. Preload calls `ipcRenderer.invoke('fs:read-file', args)`
4. Main process receives via `ipcMain.handle`
5. Handler validates input using validators
6. Service processes request
7. Result returned to renderer

### Event Bus

1. Renderer subscribes to event via preload API
2. Main process registers subscription in EventBus
3. Any process emits event
4. EventBus notifies all subscribers
5. Renderer receives via ipcRenderer.on

## Error Handling Architecture

Errors flow through multiple layers:

1. **Process-level**: Global error handlers catch uncaught exceptions
2. **IPC-level**: Input validation catches malformed requests
3. **Service-level**: Result type encapsulates success/failure
4. **UI-level**: React ErrorBoundary catches component errors
5. **DevTools**: All errors displayed in bottom panel

See [Error Handling](error-handling.md) for details.

## Build Outputs

- Renderer build: `dist/`
- Electron main build: `dist-electron/`
- Combined package: `release/`
