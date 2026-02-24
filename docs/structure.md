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
│   ├── handlers.ts          # IPC handler registrations
│   ├── log-handlers.ts      # Logging IPC handlers
│   └── event-bus-handlers.ts # Event bus IPC handlers
├── lib/
│   ├── container.ts          # DI container
│   ├── tokens.ts            # Service tokens
│   ├── logger.ts            # electron-log wrapper
│   ├── EventBus.ts          # Main process event bus
│   └── *.ts                # Utilities
├── services/
│   ├── index.ts            # Service exports
│   ├── AppService.ts        # App lifecycle
│   ├── FileService.ts       # File operations
│   └── WindowService.ts     # Window management
├── use-cases/              # Domain use-cases
├── utils/
│   └── fs-utils.ts
├── windows/
│   └── window-manager.ts
└── main.ts                 # Entry point
```

## Preload (`src/preload/`)

```
preload/
└── preload.ts              # contextBridge API
```

## Renderer (`src/renderer/`)

```
renderer/
├── components/
│   ├── features/
│   │   └── Main/
│   └── ui/
│       ├── Card/
│       ├── TabFilter/
│       └── ErrorBoundary/
├── data/
│   └── menu-data.ts
├── hooks/
├── lib/
│   ├── di.tsx             # React DI context
│   ├── services.ts         # Service factory
│   ├── EventBus.ts         # Renderer event bus
│   ├── logger.ts           # Logger
│   ├── styled.ts           # Goober styles
│   └── *.ts
├── services/
├── store/
├── styles/
│   └── theme/
├── types/
├── use-cases/             # Content modules
├── utils/
├── index.html
└── main.tsx
```

## Shared (`src/shared/`)

```
shared/
├── constants/
│   └── events.ts
├── lib/
│   └── result.ts          # Result/Either type
└── types/
    └── winbox.d.ts
```

## Key Files

### Entry Points

- `src/main/main.ts` - Electron main process entry
- `src/renderer/main.tsx` - React entry point
- `src/preload/preload.ts` - Preload script

### Configuration

- `rsbuild.config.ts` - Rsbuild configuration
- `tsconfig.json` - TypeScript config
- `package.json` - Dependencies and scripts

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

`src/renderer/lib/styled.ts` (~1200 lines) should be split into component-specific files.

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
