# Architecture

This app follows Electron best practices with strict process separation and a modular use-case system.

## Process Model
- Main process: app lifecycle, window creation, and OS-level operations
- Preload: secure bridge exposing a minimal API to the renderer
- Renderer: React UI, WinBox window management, and use-cases

## Main Process
Key files:
- `src/main/main.ts` initializes the app, creates the main window, and registers IPC handlers
- `src/main/ipc/handlers.ts` defines IPC channels for filesystem, window, and app operations
- `src/main/windows/window-manager.ts` manages secondary Electron windows (not WinBox)
- `src/main/config/app-config.ts` defines base window sizes

The main process uses safe defaults:
- `nodeIntegration: false`
- `contextIsolation: true`
- `webSecurity: true`

## Preload Bridge
`src/preload/preload.ts` exposes a structured API under `window.electronAPI`:
- IPC invoke/send/on helpers
- File system operations
- Window controls
- App controls

## Renderer
Key files:
- `src/renderer/main.tsx` bootstraps React
- `src/renderer/components/` UI components
- `src/renderer/use-cases/` modular content and window configuration
- `src/renderer/use-cases/window-factory.ts` creates WinBox windows

## Use-Case System
- Renderer use-cases are registered in `src/renderer/use-cases/index.ts`
- Each use-case provides metadata, window configuration, and content
- Menu data is generated from use-cases and displayed in the UI

Main-process use-cases live alongside renderer use-cases in `*.main.ts` files.
They define IPC handlers but must be registered with `electronUseCaseRegistry` to activate.

## Build Outputs
- Renderer build: `dist/`
- Electron main build: `dist-electron/`
