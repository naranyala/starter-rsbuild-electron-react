# Documentation

These docs are written for both humans and AI agents working in this repo. Start here, then dive into the specific guides below.

## Index

- [Architecture](architecture.md) - System architecture and process boundaries
- [Project Structure](structure.md) - File organization and directory layout
- [Dependency Injection](di.md) - DI container in backend and frontend
- [Event Bus](event-bus.md) - Cross-process event communication
- [Error Handling](error-handling.md) - Result type and error patterns
- [IPC](ipc.md) - Inter-process communication channels and patterns
- [Use Cases](use-cases.md) - Modular content system
- [Development](development.md) - Local development, scripts, environment
- [Packaging](packaging.md) - Build outputs and electron-builder
- [AI Agents](ai-agents.md) - Operating guide for AI agents
- [Troubleshooting](troubleshooting.md) - Common issues and solutions

## Quick Facts

- Main process entry: `src/main/main.ts`
- Preload entry: `src/preload/preload.ts`
- Renderer entry: `src/renderer/main.tsx`
- Rsbuild entry: `rsbuild.config.ts`
- Electron build output: `dist-electron/`
- Renderer build output: `dist/`
- Dev command: `bun run dev`
- Package command: `bun run dist`
- Test command: `bun test`

## Key Directories

```
src/
├── main/           # Electron main process
│   ├── lib/        # Utilities (logger, error-handlers, EventBus)
│   ├── services/   # AppService, FileService, WindowService
│   ├── ipc/        # IPC handlers
│   └── config/     # App configuration
├── renderer/       # React frontend
│   ├── components/ # React components
│   ├── use-cases/ # Use-case system, window-factory
│   ├── store/     # Window state management
│   └── lib/       # Utilities, styled components
├── preload/        # Preload scripts (IPC bridge)
└── shared/        # Shared types and utilities
    ├── types/     # TypeScript types
    └── lib/       # Result, validation, common utilities
```

## Common Tasks

### Adding a new IPC handler

1. Define channel in `src/shared/types/ipc-channels.ts`
2. Add validator in `src/main/lib/ipc-validators.ts` (optional)
3. Register handler in appropriate service
4. Expose API in `src/preload/preload.ts`

### Adding a new use-case

1. Create component in `src/renderer/components/features/`
2. Add entry in `src/renderer/data/menu-data.ts`
3. Register in use-case registry if needed

### Running tests

```bash
bun test              # All tests
bun test:shared      # Shared library tests
bun test:backend     # Backend tests
bun test:watch       # Watch mode
```

### Debugging

Use the integrated DevTools:
- Click the bottom bar
- Press `Ctrl+Shift+D` or `F12`
- View console logs, IPC messages, performance metrics
