# IPC

The renderer communicates with the main process via a secure preload bridge. All access should go through `window.electronAPI`.

## Preload API

File: `src/preload/preload.ts`

The preload script implements channel whitelisting for security:

```typescript
const ALLOWED_INVOKE_CHANNELS = new Set([
  'fs:write-file',
  'fs:read-file',
  // ... other channels
]);

const ALLOWED_SEND_CHANNELS = new Set([
  'log-error',
  'log-warn',
  // ...
]);

const ALLOWED_ON_CHANNELS = new Set([
  'event:received',
  // ...
]);
```

### Exposed API Namespaces

```typescript
window.electronAPI = {
  // Core IPC
  invoke(channel, args)   // Call handler (whitelisted channels only)
  send(channel, args)     // Send one-way message
  on(channel, listener)   // Listen for events
  once(channel, listener) // Listen once
  removeListener(channel, listener)

  // File System
  fs: {
    writeFile(filePath, data)
    readFile(filePath)
    fileExists(filePath)
    deleteFile(filePath)
    listFiles(dirPath)
    getFileStats(filePath)
  }

  // Window
  window: {
    create(id, config)
    close(id)
    focus(id)
    minimize(id)
    maximize(id)
    toggleFullscreen(id)
  }

  // App
  app: {
    quit()
    relaunch()
    hide()
    show()
    getPath(name)
  }

  // Logging
  log: {
    write(entry)
    getPath()
    query(query)
  }

  // Event Bus
  event: {
    subscribe(event)
    unsubscribe(event)
    emit(event, data)
    emitToRenderer(windowId, event, data)
    on(listener)
  }
}
```

## IPC Channels

File: `src/shared/types/ipc-channels.ts`

### File System Channels

- `fs:write-file` - Write file to disk
- `fs:read-file` - Read file from disk
- `fs:file-exists` - Check if file exists
- `fs:delete-file` - Delete file
- `fs:list-files` - List files in directory
- `fs:get-file-stats` - Get file metadata

### Window Channels

- `window:create` - Create new window
- `window:close` - Close window
- `window:focus` - Focus window
- `window:minimize` - Minimize window
- `window:maximize` - Maximize window
- `window:toggle-fullscreen` - Toggle fullscreen

### App Channels

- `app:quit` - Quit application
- `app:relaunch` - Relaunch application
- `app:hide` - Hide application
- `app:show` - Show application
- `app:get-path` - Get app paths

### Event Channels

- `event:subscribe` - Subscribe to event
- `event:unsubscribe` - Unsubscribe from event
- `event:emit` - Emit event
- `event:emit-to-renderer` - Emit to renderer

### Log Channels

- `log:write` - Write log entry
- `log:getPath` - Get log path
- `log:query` - Query logs

## IPC Response Format

All IPC responses follow a consistent structure:

```typescript
// Success
{ success: true, data: T }

// Error
{ success: false, error: string }
```

## Input Validation

All IPC inputs are validated before reaching handlers.

File: `src/shared/lib/validation.ts`

```typescript
// Example: File path validation prevents path traversal
validateFilePath(value, field)
// Rejects paths with ".." or null bytes
```

File: `src/main/lib/ipc-validators.ts`

```typescript
// Validators for each channel
export const fsValidators = {
  writeFile: { validate(args) { ... } },
  readFile: { validate(args) { ... } },
  // ...
};
```

## Adding New IPC

1. Add channel to `src/shared/types/ipc-channels.ts`
2. Add validator to `src/main/lib/ipc-validators.ts` (optional but recommended)
3. Add handler in appropriate service
4. Add to whitelist in `src/preload/preload.ts`
5. Expose API method in preload

## Best Practices

1. Always validate IPC inputs
2. Use Result type for error handling
3. Keep channel names consistent (`domain:action`)
4. Document all channels
5. Never expose raw ipcRenderer to renderer
