# Electron + React + Rsbuild Starter

A production-leaning Electron desktop application starter with a fast Rsbuild pipeline, modular use-case system, dependency injection, event bus, and clean process boundary.

## Highlights

- Fast dev loop with Rsbuild and hot reloading
- Electron 40 + React 19 + TypeScript
- Dependency Injection (DI) container for main and renderer
- Event Bus system for cross-process communication
- Error boundary with modal fallback UI
- Secure preload bridge with typed IPC surface
- Comprehensive security testing suite
- Integrated DevTools bottom panel for debugging

## Quick Start

```bash
# Install dependencies
bun install

# Start dev server (Rsbuild + Electron)
bun run dev

# Build renderer + main
bun run build

# Package for distribution
bun run dist
```

## Documentation

- [Architecture](docs/architecture.md) - System architecture overview
- [Project Structure](docs/structure.md) - File organization and directory layout
- [Dependency Injection](docs/di.md) - DI container in backend and frontend
- [Event Bus](docs/event-bus.md) - Cross-process event communication
- [Error Handling](docs/error-handling.md) - Result type and error patterns
- [IPC](docs/ipc.md) - Inter-process communication
- [Use Cases](docs/use-cases.md) - Modular content system
- [Development](docs/development.md) - Development workflows
- [Packaging](docs/packaging.md) - Building and distribution
- [AI Agents](docs/ai-agents.md) - AI agent workflows
- [Troubleshooting](docs/troubleshooting.md) - Common issues and solutions

## Scripts

| Command | Description |
|---------|-------------|
| `bun run dev` | Start Rsbuild dev server + Electron |
| `bun run build` | Build renderer + main process |
| `bun run dist` | Package with electron-builder |
| `bun run lint` | Run Biome checks |
| `bun run lint:frontend` | Lint frontend code |
| `bun run lint:backend` | Lint backend code |
| `bun run type-check` | TypeScript validation |
| `bun test` | Run all tests |
| `bun test:shared` | Run shared library tests |
| `bun test:backend` | Run backend tests |
| `bun test:frontend` | Run frontend tests |
| `bun test:watch` | Run tests in watch mode |
| `bun test:coverage` | Run tests with coverage |

## Testing

The project uses Bun's built-in test runner (`bun test`). Tests are organized in the `tests/` directory:

- `tests/shared/` - Shared library tests (Result type, common utilities)
- `tests/backend/` - Backend tests (IPC channels, event bus types)
- `tests/frontend/` - Frontend tests
- `tests/security*.test.ts` - Security validation tests

Run tests with:
```bash
bun test              # All tests
bun test:watch       # Watch mode
bun test:coverage    # With coverage report
```

## DevTools

The application includes an integrated DevTools bottom panel for debugging:

- **Toggle**: Click the bottom bar, press `Ctrl+Shift+D`, or press `F12`
- **Features**: Console logs, IPC messages, performance metrics, app state
- **Bar**: Shows error/warn counts, last log message, memory usage, DOM nodes

## Configuration

- **Rsbuild**: `rsbuild.config.ts`
- **Electron Builder**: `package.json` > `build`
- **TypeScript**: `tsconfig.json`, `tsconfig.electron.json`
- **Biome**: `biome.json`

## Error Handling

The project implements multi-layered error handling:

1. **Global handlers** (`src/main/lib/error-handlers.ts`): Catches uncaught exceptions, unhandled rejections, and process warnings
2. **Window handlers**: Monitors renderer process crashes and failed loads
3. **IPC validation**: Input validation on all IPC handlers using shared validators
4. **React ErrorBoundary**: Catches React component errors with fallback UI
5. **DevTools panel**: All errors logged to bottom panel for debugging

## IPC Security

The preload script implements channel whitelisting:

- `ALLOWED_INVOKE_CHANNELS`: Whitelisted channels for `ipcRenderer.invoke`
- `ALLOWED_SEND_CHANNELS`: Whitelisted channels for `ipcRenderer.send`
- `ALLOWED_ON_CHANNELS`: Whitelisted channels for event listeners

All IPC inputs are validated through `src/shared/lib/validation.ts` before reaching business logic.

## License

MIT. See `LICENSE`.
