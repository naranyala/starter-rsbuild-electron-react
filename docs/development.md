# Development

## Requirements

- Node.js 18+ (recommended)
- Bun or npm
- Git

## Key Commands

```bash
# Development
bun run dev                    # Start Rsbuild + Electron with HMR
bun run start                 # Run Electron from dist-electron/

# Building
bun run build                 # Build renderer + main
bun run build:web            # Build renderer only
bun run build:electron        # Build main process only

# Packaging
bun run dist                  # Build and package via electron-builder

# Linting and Formatting
bun run lint                  # Run Biome checks (fixes issues)
bun run lint:frontend        # Lint frontend only
bun run lint:backend         # Lint backend only
bun run format               # Format with Biome
bun run format:frontend      # Format frontend only
bun run format:backend      # Format backend only

# Type Checking
bun run type-check           # TypeScript validation
bun run check-electron       # Check Electron build

# Testing
bun test                     # Run all tests
bun test:watch             # Watch mode
bun test:coverage          # With coverage
bun test:shared            # Shared library tests
bun test:backend           # Backend tests
bun test:frontend          # Frontend tests

# Security
bun test:security          # Security tests
bun test:security:coverage # Security tests with coverage
```

## Dev Flow Details

The dev script starts Rsbuild on a random available port and passes it to Electron:

```bash
ELECTRON_START_URL=http://localhost:<port>
```

`src/main/main.ts` reads this environment variable and loads it in development mode.

## Environment Variables

- `ELECTRON_START_URL` - Dev server URL (default: http://localhost:35703)
- `ELECTRON_IS_DEV` - Set to 1 in development mode

## Paths and Aliases

Rsbuild and TypeScript path aliases are defined in:

- `rsbuild.config.ts`
- `tsconfig.json`
- `tsconfig.electron.json`

Common aliases:

- `@renderer/*` for renderer files (`src/renderer/*`)
- `@main/*` for main process files (`src/main/*`)
- `@preload/*` for preload files (`src/preload/*`)
- `@shared/*` for shared files (`src/shared/*`)

## Build Outputs

- Renderer artifacts: `dist/`
- Electron artifacts: `dist-electron/`
- Packaged app: `release/`

## Electron Builder

The `build` field in `package.json` configures packaging targets for Windows, macOS, and Linux.

## DevTools

The application includes an integrated DevTools panel:

- **Toggle**: Click the bottom bar, press `Ctrl+Shift+D`, or press `F12`
- **Bar**: Shows error/warn counts, last log message, memory usage
- **Panel**: Full logs, IPC messages, performance metrics, app state

## Debugging

1. Use the integrated DevTools panel for runtime debugging
2. Check logs in `logs/` directory (main process logs)
3. Use `console.log` in renderer - all logs appear in DevTools panel
4. Use `logger.info/warn/error` in main process
