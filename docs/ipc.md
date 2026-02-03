# IPC

The renderer communicates with the main process via a secure preload bridge. All access should go through `window.electronAPI`.

## Preload API
File: `src/preload/preload.ts`

Exposed namespaces:
- `electronAPI.invoke`, `electronAPI.send`, `electronAPI.on`, `electronAPI.once`
- `electronAPI.fs.*` for filesystem operations
- `electronAPI.window.*` for window operations
- `electronAPI.app.*` for app operations

## Main IPC Handlers
File: `src/main/ipc/handlers.ts`

Channels:
- `fs:write-file`, `fs:read-file`, `fs:file-exists`, `fs:delete-file`, `fs:list-files`, `fs:get-file-stats`
- `window:create`, `window:close`, `window:focus`, `window:minimize`, `window:maximize`, `window:toggle-fullscreen`
- `app:quit`, `app:relaunch`, `app:hide`, `app:show`, `app:get-path`

Responses follow a consistent structure:
- `{ success: true, data: ... }`
- `{ success: false, error: ... }`

## Adding New IPC
1. Add a handler in `src/main/ipc/handlers.ts`
2. Expose a method in `src/preload/preload.ts`
3. Call it from the renderer via `window.electronAPI`

Avoid exposing raw `ipcRenderer` or Node APIs directly in the renderer.
