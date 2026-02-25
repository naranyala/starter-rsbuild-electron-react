# Project Structure

This document describes the complete project structure and file organization.

## Directory Overview

```
src/
├── main/                    # Electron main process
├── preload/                 # Secure preload bridge
├── renderer/                # React UI
├── shared/                  # Shared between processes
└── types/                   # Global type definitions
```

## Main Process (`src/main/`)

```
main/
├── config/
│   └── app-config.ts        # App configuration
├── ipc/
│   ├── channels.ts           # IPC channel definitions
│   ├── log-handlers.ts      # Logging IPC handlers
│   └── event-bus-handlers.ts # Event bus IPC handlers
├── lib/
│   ├── error-handlers.ts    # Global error handlers
│   ├── ipc-validators.ts    # IPC input validators
│   ├── logger.ts            # electron-log wrapper
│   ├── EventBus.ts          # Main process event bus
│   └── utils.ts             # Utilities
├── services/
│   ├── index.ts             # Service exports
│   ├── AppService.ts         # App lifecycle
│   ├── FileService.ts        # File operations
│   └── WindowService.ts      # Window management
├── use-cases/
├── windows/
│   └── window-manager.ts
├── interfaces.ts            # Service interfaces
└── main.ts                  # Entry point
```

## Preload (`src/preload/`)

```
preload/
└── preload.ts               # contextBridge API with channel whitelist
```

## Renderer (`src/renderer/`)

```
renderer/
├── components/
│   ├── DevTools/
│   │   ├── DevToolsBar.tsx  # Tiny bottom bar
│   │   └── DevToolsPanel.tsx # Full debugging panel
│   ├── features/
│   │   └── Main/
│   └── ui/
│       ├── Card/
│       └── TabFilter/
├── data/
│   └── menu-data.ts
├── lib/
│   ├── di.tsx               # React DI context
│   ├── error-boundary.tsx   # React error boundary
│   ├── EventBus.ts          # Renderer event bus
│   ├── logger.ts            # Logger
│   ├── styled.ts            # Goober styles
│   └── renderer-utils.ts    # Utilities
├── store/
│   └── window-store.ts      # Window state management
├── use-cases/
│   ├── renderer-registry.ts  # Use-case registry
│   ├── window-factory.ts     # WinBox window creation
│   ├── window-utils.ts      # Window utilities
│   └── window-state.ts      # Window state management
├── types/
└── main.tsx                 # Entry point
```

## Shared (`src/shared/`)

```
shared/
├── constants/
│   └── events.ts
├── lib/
│   ├── result.ts            # Result/Either type
│   ├── validation.ts        # Input validators
│   └── common.ts            # Common utilities
└── types/
    ├── event-bus.ts
    ├── ipc-channels.ts
    └── result.ts
```

## Tests (`tests/`)

```
tests/
├── backend/                 # Backend tests
│   ├── ipc-channels.test.ts
│   └── event-bus.test.ts
├── frontend/                # Frontend tests
├── shared/                 # Shared library tests
│   ├── result.test.ts
│   └── common.test.ts
└── security*.test.ts       # Security tests
```

## Key Files

### Entry Points

- `src/main/main.ts` - Electron main process entry
- `src/renderer/main.tsx` - React entry point
- `src/preload/preload.ts` - Preload script

### Configuration

- `rsbuild.config.ts` - Rsbuild configuration
- `tsconfig.json` - TypeScript config for renderer
- `tsconfig.electron.json` - TypeScript config for Electron
- `package.json` - Dependencies and scripts
- `biome.json` - Biome linter/formatter config

## Build Outputs

- Renderer: `dist/`
- Electron: `dist-electron/`
- Package: `release/`

## Potential Improvements

### 1. Consolidate Use-Cases

The `src/renderer/use-cases/` contains both content and IPC handlers. Consider separating them.

### 2. Feature-Based Architecture

Current: Organized by type (components/, utils/, services/)
Recommended: Organize by feature

```
src/renderer/features/
├── home/
├── settings/
└── [feature]/
    ├── components/
    ├── hooks/
    └── services/
```

### 3. Split Large Files

`src/renderer/lib/styled.ts` should be split into component-specific files.

### 4. Domain Layer

Create explicit domain modules:

```
src/main/domain/
├── security/
├── file-management/
└── system/
```

### 5. State Management

Evaluate adding a proper state solution (Zustand, Jotai) instead of ad-hoc stores.

### 6. Shared Types

Move more types to `src/shared/` for better cross-process type safety.
