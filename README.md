# Electron + React Starter with Rsbuild

A modern boilerplate for building cross-platform desktop applications using Electron, React 19, and Rsbuild as the bundler. Features a modular use-case architecture for organized window management and IPC communication.

## Features

- **Fast Bundling**: Powered by Rsbuild for optimized build performance
- **React 19**: Latest React with TypeScript support
- **Electron 40**: Modern Electron for desktop application development
- **Modular Use-Case Architecture**: Self-contained window components with registry-based discovery
- **Organized Structure**: Clean separation between frontend and backend use-cases
- **Path Aliases**: Configured aliases for cleaner imports
- **Code Quality**: Biome for linting and formatting
- **Styled Components**: CSS-in-JS support included
- **WinBox Integration**: Window management library pre-configured
- **Auto IPC Registration**: Backend use-cases automatically register IPC handlers

## Project Structure

```
starter-rsbuild-electron-react/
├── src/                              # Source files
│   ├── assets/                        # Static assets (icons, images, favicon)
│   │   └── images/
│   ├── electron-main/                 # Electron main process
│   │   ├── lib/                        # Main process utilities
│   │   │   ├── fs-utils.ts
│   │   │   ├── ipc-handlers.ts
│   │   │   ├── ipc-utils.ts
│   │   │   └── window-utils.ts
│   │   ├── use-cases/                # Backend use-case handlers
│   │   │   ├── types.ts              # Use-case type definitions
│   │   │   ├── registry.ts           # Use-case registry management
│   │   │   ├── ipc-integration.ts   # Auto IPC handler registration
│   │   │   ├── index.ts              # Barrel export and registration
│   │   │   ├── electron-intro.ts
│   │   │   ├── electron-architecture.ts
│   │   │   ├── electron-security.ts
│   │   │   ├── electron-packaging.ts
│   │   │   ├── electron-native-apis.ts
│   │   │   ├── electron-performance.ts
│   │   │   ├── electron-development.ts
│   │   │   └── electron-versions.ts
│   │   ├── config.ts             # Main process configuration
│   │   ├── main.ts               # Main entry point
│   │   └── main.dev.cjs          # Development main entry
│   ├── electron-preload/              # Preload scripts
│   │   └── preload.ts            # Preload script entry
│   ├── renderer/                      # Renderer process (React)
│   │   ├── components/           # React components
│   │   │   ├── Main/
│   │   │   └── ui/Card/
│   │   ├── data/                # Data files
│   │   │   └── menu-data.ts
│   │   ├── hooks/               # Custom React hooks
│   │   ├── lib/                 # Renderer utilities
│   │   │   └── window-generator.ts
│   │   ├── types/               # TypeScript types
│   │   │   └── index.ts
│   │   ├── utils/               # Utility functions
│   │   │   ├── common-utils.ts
│   │   │   ├── data-utils.ts
│   │   │   └── ipc-utils.ts
│   │   ├── use-cases/           # Frontend use-case modules
│   │   │   ├── types.ts          # Use-case type definitions
│   │   │   ├── registry.ts       # Use-case registry with search
│   │   │   ├── window-factory.ts # WinBox window factory
│   │   │   ├── index.ts          # Barrel export and registration
│   │   │   ├── electron-intro/         # Use-case: What is Electron?
│   │   │   ├── electron-architecture/    # Use-case: Architecture
│   │   │   ├── electron-security/         # Use-case: Security
│   │   │   ├── electron-packaging/        # Use-case: Packaging
│   │   │   ├── electron-native-apis/       # Use-case: Native APIs
│   │   │   ├── electron-performance/        # Use-case: Performance
│   │   │   ├── electron-development/       # Use-case: Development
│   │   │   └── electron-versions/         # Use-case: Version Management
│   │   ├── styles/              # Global styles
│   │   │   ├── components/
│   │   │   │   └── App.css
│   │   │   └── global/
│   │   │       ├── index.css
│   │   │       └── reset.css
│   │   ├── types/               # Global type definitions
│   │   │   └── winbox.d.ts
│   │   ├── index.html            # HTML template
│   │   └── index.tsx            # React application entry
├── scripts/                          # Build and development scripts
│   ├── build-icons.js               # Icon generation script
│   ├── check-electron.sh            # Electron checker
│   ├── start-dev.js                  # Development starter
│   └── start-dev-rsbuild.cjs       # Rsbuild dev server starter
├── dist/                             # Web build output
├── dist-electron/                     # Electron build output
├── rsbuild.config.ts                  # Rsbuild configuration
├── tsconfig.json                      # TypeScript configuration
├── tsconfig.electron.json             # Electron TypeScript config
├── biome.json                         # Biome linting configuration
└── package.json                       # Project dependencies
```

## Prerequisites

- Node.js >= 18.x
- Bun (recommended) or npm
- Git

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd starter-rsbuild-electron-react
   ```

2. Install dependencies:
   ```bash
   bun install
   # or
   npm install
   ```

## Development

Start the development server with hot reloading:

```bash
bun run dev
# or
npm run dev
```

This command:
1. Starts the Rsbuild development server
2. Compiles Electron main process with TypeScript
3. Registers all use-case IPC handlers
4. Launches the Electron application

## Building

Create a production build:

```bash
bun run build
# or
npm run build
```

This command:
1. Builds the React application using Rsbuild
2. Compiles Electron main process
3. Outputs to `dist/` and `dist-electron/`

## Packaging for Distribution

Create distributable packages:

```bash
bun run dist
# or
npm run dist
```

Uses electron-builder to create installers for:
- Windows (MSI)
- Linux (AppImage, DEB)
- macOS (DMG)

## Modular Use-Case System

The project features a modular use-case architecture that organizes window components and their corresponding backend handlers.

### Architecture Overview

The use-case system provides:

1. **Frontend Use-Cases**: Window configuration and content generation
2. **Backend Use-Cases**: IPC handlers for main process operations
3. **Registry Pattern**: Centralized discovery and management
4. **Window Factory**: Dynamic window creation from use-cases

### Creating a New Use-Case

To add a new use-case, follow these steps:

#### Frontend Use-Case

1. Create a folder in `src/renderer/use-cases/<use-case-name>/`
2. Create an `index.ts` file with:

```typescript
import type { ContentSection, UseCase, WindowTheme } from '../types';

const metadata = {
  id: 'unique-id',
  title: 'Your Title',
  description: 'Description for search',
  category: 'category-name',
  tags: ['tag1', 'tag2'],
  searchableTerms: ['search', 'terms'],
};

const windowConfig = {
  id: 'unique-id',
  title: 'Your Title',
  dimensions: {
    width: '550px',
    height: '450px',
  },
  theme: {
    name: 'blue',
    bg: '#4a6cf7',
    color: 'white',
  },
  className: 'modern',
  border: 4,
};

function generateContent(): ContentSection[] {
  return [
    {
      type: 'paragraph',
      content: 'Your content here',
    },
    {
      type: 'list',
      content: 'Section Title',
      items: ['item1', 'item2'],
    },
  ];
}

export const yourUseCase: UseCase = {
  metadata,
  windowConfig,
  generateContent,
};

export default yourUseCase;
```

3. Import and register in `src/renderer/use-cases/index.ts`

#### Backend Use-Case

1. Create a file in `src/electron-main/use-cases/<use-case-name>.ts`
2. Define handlers:

```typescript
import type { ElectronUseCase, IpcResponse, UseCaseHandlerContext } from './types';

const metadata = {
  id: 'unique-id',
  title: 'Your Title',
  category: 'category-name',
};

const handlers = {
  'usecase:unique-id:methodName': async (
    context: UseCaseHandlerContext,
    ...args: unknown[]
  ): Promise<IpcResponse> => {
    try {
      const { window } = context;
      // Your logic here
      return { success: true, data: result };
    } catch (error) {
      return {
        success: false,
        error: `Error: ${(error as Error).message}`,
      };
    }
  },
};

export const yourMainUseCase: ElectronUseCase = {
  id: 'unique-id',
  metadata,
  handlers,
};

export default yourMainUseCase;
```

3. Import and register in `src/electron-main/use-cases/index.ts`

4. Backend handlers are automatically registered to IPC through `ipc-integration.ts`

### Use-Case Registry

The registry provides the following capabilities:

- **Registration**: Register use-cases with `useCaseRegistry.register()`
- **Retrieval**: Get use-cases by ID with `useCaseRegistry.get(id)`
- **Search**: Fuzzy search with `useCaseRegistry.search(query)`
- **Filter by Category**: Get use-cases by category
- **List All**: Retrieve all registered use-cases

### Content Sections

Use-cases support structured content sections:

- `paragraph`: Standard text paragraphs
- `heading`: Section headers (supports levels h1-h6)
- `list`: Bullet lists with items
- `custom`: Any HTML content

## Available Scripts

| Script | Description |
|--------|-------------|
| `dev` | Start development with hot reload |
| `build` | Build for production (web + electron) |
| `build:web` | Build web assets only |
| `build:electron` | Compile Electron main process |
| `start` | Launch built application |
| `dist` | Build and package for distribution |
| `type-check` | Run TypeScript type checking |
| `lint` | Lint and auto-fix code with Biome |
| `format` | Format code with Biome |

## Path Aliases

The project includes pre-configured path aliases for cleaner imports:

| Alias | Points To |
|-------|-----------|
| `@` | `./src` |
| `@assets` | `./src/assets` |
| `@renderer` | `./src/renderer` |
| `@renderer/components` | `./src/renderer/components` |
| `@renderer/types` | `./src/renderer/types` |
| `@renderer/utils` | `./src/renderer/utils` |
| `@renderer/lib` | `./src/renderer/lib` |
| `@renderer/hooks` | `./src/renderer/hooks` |
| `@renderer/data` | `./src/renderer/data` |
| `@renderer/use-cases` | `./src/renderer/use-cases` |
| `@styles` | `./src/styles` |
| `@utils` | `./src/utils` |
| `@lib` | `./src/lib` |
| `@electron-main` | `./src/electron-main` |
| `@electron-main/lib` | `./src/electron-main/lib` |
| `@electron-main/use-cases` | `./src/electron-main/use-cases` |
| `@electron-preload` | `./src/electron-preload` |

Example usage:
```typescript
import { Main } from '@renderer/components/Main';
import { ipcHandlers } from '@electron-main/lib/ipc-handlers';
import { createWindowFromUseCase } from '@renderer/use-cases';
import { useCaseRegistry } from '@renderer/use-cases';
```

## Configuration

### Rsbuild

Configured in `rsbuild.config.ts`:
- HTML template: `src/index.html`
- Output directory: `dist/`
- React plugin enabled
- Path aliases for cleaner imports

### TypeScript

Two configurations provided:
- `tsconfig.json`: Renderer process (React)
- `tsconfig.electron.json`: Main and preload processes

### Electron Builder

Configured in `package.json` under `build`:
- App ID: `com.some.electron.quickstart`
- Windows: MSI installer
- Linux: AppImage and DEB packages
- macOS: DMG with Applications shortcut

## Dependencies

### Production
- React 19.2.4
- React DOM 19.2.4
- Styled Components 6.3.8
- WinBox 0.2.82
- get-port 7.1.0

### Development
- Rsbuild 1.7.2 with React plugin
- Electron 40.0.0
- electron-builder 26.4.0
- TypeScript 5.9.3
- Biome (linting and formatting)

## IPC Communication

The application uses a structured IPC pattern:

1. **General IPC Handlers**: Located in `src/electron-main/lib/ipc-handlers.ts`
   - File system operations
   - Window management
   - Application lifecycle

2. **Use-Case IPC Handlers**: Auto-registered in `src/electron-main/use-cases/ipc-integration.ts`
   - Each use-case defines its own handlers
   - Channels follow pattern: `usecase:<id>:<action>`

3. **Context Handling**: Handlers receive context with window reference and event

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/description`
3. Make changes following existing code style
4. Run linting: `bun run lint`
5. Run type checking: `bun run type-check`
6. Commit changes: `git commit -m 'description'`
7. Push to branch: `git push origin feature/description`
8. Open a Pull Request

## Support

Report issues on GitHub with:
- Clear problem description
- Steps to reproduce
- Environment details (OS, Node.js version, Bun version)
- Error messages or logs
