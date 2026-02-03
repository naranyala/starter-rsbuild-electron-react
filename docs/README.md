# Docs

These docs are written for both humans and AI agents working in this repo. Start here, then dive into the specific guides below.

## Index
- `docs/ai-agents.md` - Operating guide for AI agents (paths, commands, safe edits, workflow)
- `docs/architecture.md` - System architecture and process boundaries
- `docs/development.md` - Local development, scripts, environment, and build flow
- `docs/use-cases.md` - Renderer use-case system and how to add new ones
- `docs/ipc.md` - IPC channels, preload API, and patterns
- `docs/packaging.md` - Build outputs and electron-builder packaging
- `docs/troubleshooting.md` - Common issues and diagnostics

## Quick Facts
- Main process entry: `src/main/main.ts`
- Preload entry: `src/preload/preload.ts`
- Renderer entry: `src/renderer/main.tsx`
- Rsbuild entry: `rsbuild.config.ts`
- Electron build output: `dist-electron/`
- Renderer build output: `dist/`
- Dev command: `bun run dev`
- Package command: `bun run dist`
