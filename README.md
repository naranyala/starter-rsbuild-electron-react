# Electron + React + Rsbuild Starter

A production-leaning Electron desktop app starter with a fast Rsbuild pipeline, modular use-case system, dependency injection, event bus, and clean process boundary.

## Highlights

- Fast dev loop with Rsbuild and hot reloading
- Electron 40 + React 19 + TypeScript
- Dependency Injection (DI) container for main and renderer
- Event Bus system for cross-process communication
- Error boundary with modal fallback UI
- Secure preload bridge with typed IPC surface
- Comprehensive security testing suite

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
| `dev` | Start Rsbuild dev server + Electron |
| `build` | Build renderer + main process |
| `dist` | Package with electron-builder |
| `lint` | Run Biome checks |
| `type-check` | TypeScript validation |
| `test` | Run tests |
| `test:security` | Run security tests |

## Configuration

- **Rsbuild**: `rsbuild.config.ts`
- **Electron Builder**: `package.json` > `build`
- **TypeScript**: `tsconfig.json`, `tsconfig.electron.json`
- **Biome**: `biome.json`

## License

MIT. See `LICENSE`.
