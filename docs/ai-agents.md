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
- `bun run dev` starts rsbuild + Electron in dev mode
- `bun run build` builds both renderer and main process
- `bun run dist` packages the app with electron-builder
- `bun run lint` runs Biome checks and fixes
- `bun run type-check` runs TypeScript with no emit

## Architecture Summary
- Main process: window creation, IPC, and app lifecycle in `src/main/`
- Preload: secure, typed API surface in `src/preload/preload.ts`
- Renderer: React app, WinBox windows, and use-case registry in `src/renderer/`

## When Adding Features
- New UI or content module: add a renderer use-case and register it
- New native functionality: add a main IPC handler and expose it via preload
- New window type: use the WinBox factory in `src/renderer/use-cases/window-factory.ts`

## Use-Case Expansion Checklist
1. Add a new use-case file in `src/renderer/use-cases/<name>/index.ts`
2. Register it in `src/renderer/use-cases/index.ts`
3. Update metadata tags for search and filtering
4. If native access is needed, add handlers in a `*.main.ts` file and register them in the main registry

## IPC Patterns
- All renderer access must go through `window.electronAPI` (preload)
- Add IPC handlers in `src/main/ipc/handlers.ts`
- Return structured responses with `success`, `data`, and `error`

## Common Pitfalls
- Dev server uses a dynamic port, passed via `ELECTRON_START_URL`
- Main process entry is `src/main/main.ts` and outputs to `dist-electron/`
- Dev script currently points to `src/electron-main/main.ts`; align paths if you refactor

## Suggested First Read
- `docs/architecture.md`
- `docs/development.md`
- `docs/use-cases.md`
