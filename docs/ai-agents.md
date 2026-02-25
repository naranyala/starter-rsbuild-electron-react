# AI Agent Guide

This repository is a production-oriented Electron + React starter using Rsbuild and a modular use-case system. This guide is optimized for automated contributors and code assistants.

## Goal

Help you move quickly without breaking the app. Follow the rules below when editing or extending features.

## Golden Paths

- UI and use-cases live in `src/renderer/`
- Main process logic and IPC handlers live in `src/main/`
- Preload is the only bridge to the renderer: `src/preload/preload.ts`
- Build outputs are in `dist/` and `dist-electron/` and should not be edited

## Safe Edits

- Do edit `src/`, `scripts/`, `rsbuild.config.ts`, and `package.json`
- Do not edit `dist/`, `dist-electron/`, or `node_modules/`
- Prefer TypeScript changes with clear types and minimal surface area

## Quick Commands

```bash
# Development
bun run dev                    # Start Rsbuild + Electron in dev mode
bun run start                  # Run from dist-electron/

# Building
bun run build                  # Build renderer + main
bun run build:web             # Build renderer only
bun run build:electron         # Build main only

# Packaging
bun run dist                  # Package with electron-builder

# Linting
bun run lint                  # Biome checks with fixes
bun run lint:frontend         # Frontend only
bun run lint:backend          # Backend only

# Type Checking
bun run type-check            # TypeScript validation

# Testing
bun test                      # All tests
bun test:watch               # Watch mode
```

## Architecture Summary

- **Main process**: Window creation, IPC, and app lifecycle in `src/main/`
- **Preload**: Secure, typed API surface in `src/preload/preload.ts`
- **Renderer**: React app, WinBox windows, and use-case registry in `src/renderer/`
- **Shared**: Types and utilities in `src/shared/`

## When Adding Features

- New UI or content module: Add component in `src/renderer/components/features/` and register in `menu-data.ts`
- New native functionality: Add IPC handler and expose via preload
- New window type: Use the WinBox factory in `src/renderer/use-cases/window-factory.ts`

## IPC Patterns

- All renderer access must go through `window.electronAPI` (preload)
- Add IPC handlers in appropriate service files
- Return structured responses with `success`, `data`, and `error`
- Validate all IPC inputs using validators in `src/main/lib/ipc-validators.ts`

## Adding IPC Channels

1. Define channel in `src/shared/types/ipc-channels.ts`
2. Add validator in `src/main/lib/ipc-validators.ts` (optional)
3. Add handler in appropriate service
4. Add to preload whitelist in `src/preload/preload.ts`

## Common Pitfalls

- Dev server uses a dynamic port, passed via `ELECTRON_START_URL`
- Main process entry is `src/main/main.ts` and outputs to `dist-electron/`
- Use integrated DevTools for debugging (press `Ctrl+Shift+D` or `F12`)

## Testing

- Run tests before submitting: `bun test`
- Add tests for new features in `tests/` directory
- Shared library tests: `tests/shared/`
- Backend tests: `tests/backend/`

## Security Considerations

- Never expose raw `ipcRenderer` to renderer
- Always validate IPC inputs
- Use channel whitelisting in preload
- Prevent path traversal in file operations

## Suggested First Read

- `docs/README.md`
- `docs/architecture.md`
- `docs/development.md`
- `docs/ipc.md`
- `docs/error-handling.md`
