# Electron + React + Rsbuild Starter

A production-leaning Electron desktop app starter with a fast Rsbuild pipeline, a modular use-case system, and a clean process boundary. It is designed to get teams shipping quickly while keeping the main process, preload, and renderer responsibilities crisp and maintainable.

## Highlights
- Fast dev loop with Rsbuild and hot reloading
- Electron 40 + React 19 + TypeScript
- Secure preload bridge with a curated IPC surface
- Modular renderer use-cases that open WinBox windows
- Window manager utilities for multi-window workflows
- Electron-builder packaging for Windows, macOS, and Linux
- Opinionated code organization with clean path aliases

## What You Get
- A React renderer with a searchable use-case menu and WinBox windows
- A main process with IPC handlers for files, app actions, and window control
- A preload bridge that exposes a typed `window.electronAPI`
- Build scripts for icons, development, and packaging

## Quick Start
```bash
# Install dependencies
bun install
# or
npm install

# Start dev (rsbuild + Electron)
bun run dev

# Build renderer + main
bun run build

# Package for distribution
bun run dist
```

## Architecture At A Glance
- Main process: `src/main/` handles app lifecycle, windows, and IPC
- Preload: `src/preload/preload.ts` exposes safe APIs to the renderer
- Renderer: `src/renderer/` is the React app and use-case system

WinBox is used in the renderer to create windowed experiences inside the app UI.

## Project Structure
```
src/
├── main/                  # Electron main process
├── preload/               # Secure preload bridge
├── renderer/              # React UI
│   ├── components/        # UI components
│   ├── use-cases/          # Modular content + window configs
│   └── styles.ts          # Goober styling and theme
├── shared/                # Shared types/utilities
└── assets/                # Static assets
```

## Use-Case System
Renderer use-cases define content, metadata, and window configuration. Each use-case can open a WinBox window and appear in the searchable menu. Main-process use-cases can provide native IPC handlers when needed.

Key locations:
- Renderer use-cases: `src/renderer/use-cases/`
- Window factory: `src/renderer/use-cases/window-factory.ts`
- Menu generation: `src/renderer/data/menu-data.ts`

## IPC and Security
- IPC handlers live in `src/main/ipc/handlers.ts`
- Preload bridge lives in `src/preload/preload.ts`
- Defaults include `contextIsolation: true` and `nodeIntegration: false`

Add new channels by defining handlers in main and exposing them in preload. Avoid direct `ipcRenderer` access in the renderer.

## Scripts
| Command | Description |
| --- | --- |
| `dev` | Start rsbuild dev server and Electron |
| `dev:parcel` | Legacy Parcel dev flow |
| `build` | Build renderer and main process |
| `build:web` | Build renderer only |
| `build:electron` | Build main process only |
| `start` | Run Electron from `dist-electron/` |
| `dist` | Build and package with electron-builder |
| `lint` | Run Biome checks (with fixes) |
| `format` | Format with Biome |
| `type-check` | Run TypeScript with no emit |
| `check-electron` | Validate Electron installation |

## Configuration
- Rsbuild: `rsbuild.config.ts`
- Electron builder: `package.json` > `build`
- TypeScript: `tsconfig.json` and `tsconfig.electron.json`

## Docs
Start at `docs/README.md` for detailed guides, including AI-agent workflow, architecture, IPC, use-cases, packaging, and troubleshooting.

## License
MIT. See `LICENSE`.
