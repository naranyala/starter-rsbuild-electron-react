# Development

## Requirements
- Node.js 18+ (recommended)
- Bun or npm
- Git

## Key Commands
- `bun run dev` starts rsbuild + Electron with HMR
- `bun run dev:parcel` starts the legacy parcel dev flow
- `bun run build` builds renderer and main process
- `bun run build:web` builds the renderer only
- `bun run build:electron` builds the Electron main process only
- `bun run start` runs Electron from `dist-electron/`
- `bun run dist` builds and packages via electron-builder
- `bun run lint` runs Biome checks (with fixes)
- `bun run format` formats with Biome
- `bun run type-check` runs TypeScript with no emit

## Dev Flow Details
The dev script starts rsbuild on a random available port and passes it to Electron as:
- `ELECTRON_START_URL=http://localhost:<port>`

`src/main/main.ts` reads this environment variable and loads it in development mode.

## Paths and Aliases
Rsbuild and TS path aliases are defined in:
- `rsbuild.config.ts`
- `tsconfig.json`
- `tsconfig.electron.json`

Common aliases:
- `@renderer/*` for renderer files
- `@main/*` for main process files
- `@preload/*` for preload

## Build Outputs
- Renderer artifacts: `dist/`
- Electron artifacts: `dist-electron/`

## Electron Builder
The `build` field in `package.json` configures packaging targets for Windows, macOS, and Linux.
