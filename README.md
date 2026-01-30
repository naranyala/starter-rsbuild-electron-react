# Electron + React Starter with Rsbuild

A modern boilerplate for building cross-platform desktop applications using Electron, React 19, and Rsbuild as the bundler.

## Features

- **Fast Bundling**: Powered by Rsbuild for optimized build performance
- **React 19**: Latest React with TypeScript support
- **Electron 40**: Modern Electron for desktop application development
- **Organized Architecture**: Clean separation between main, renderer, and preload processes
- **Path Aliases**: Configured aliases for cleaner imports
- **Code Quality**: Biome for linting and formatting
- **Styled Components**: CSS-in-JS support included
- **Winbox Integration**: Window management library pre-configured

## Project Structure

```
starter-rsbuild-electron-react/
├── src/                           # Source files
│   ├── assets/                   # Static assets (icons, images, favicon)
│   │   └── images/
│   ├── electron-main/            # Electron main process
│   │   ├── lib/                  # Main process utilities
│   │   │   ├── fs-utils.ts
│   │   │   ├── ipc-handlers.ts
│   │   │   ├── ipc-utils.ts
│   │   │   └── window-utils.ts
│   │   ├── config.ts             # Main process configuration
│   │   ├── main.ts               # Main entry point
│   │   └── main.dev.cjs          # Development main entry
│   ├── electron-preload/         # Preload scripts
│   │   └── preload.ts            # Preload script entry
│   ├── renderer/                 # Renderer process (React)
│   │   ├── components/           # React components
│   │   │   ├── Main/
│   │   │   └── ui/Card/
│   │   ├── data/                 # Data files
│   │   │   └── menu-data.ts
│   │   ├── hooks/                # Custom React hooks
│   │   ├── lib/                  # Renderer utilities
│   │   │   └── window-generator.ts
│   │   ├── types/                # TypeScript types
│   │   │   └── index.ts
│   │   └── utils/                # Utility functions
│   │       ├── common-utils.ts
│   │       ├── data-utils.ts
│   │       └── ipc-utils.ts
│   ├── styles/                   # Global styles
│   │   ├── components/
│   │   │   └── App.css
│   │   └── global/
│   │       ├── index.css
│   │       └── reset.css
│   ├── types/                    # Global type definitions
│   │   └── winbox.d.ts
│   ├── index.html                # HTML template
│   └── index.tsx                 # React application entry
├── scripts/                       # Build and development scripts
│   ├── build-icons.js            # Icon generation script
│   ├── check-electron.sh         # Electron checker
│   ├── start-dev.js              # Development starter
│   └── start-dev-rsbuild.cjs     # Rsbuild dev server starter
├── dist/                          # Web build output
├── dist-electron/                 # Electron build output
├── rsbuild.config.ts              # Rsbuild configuration
├── tsconfig.json                  # TypeScript configuration
├── tsconfig.electron.json         # Electron TypeScript config
├── biome.json                     # Biome linting configuration
└── package.json                   # Project dependencies
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
3. Launches the Electron application

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
| `@styles` | `./src/styles` |
| `@utils` | `./src/utils` |
| `@lib` | `./src/lib` |
| `@electron-main` | `./src/electron-main` |
| `@electron-main/lib` | `./src/electron-main/lib` |
| `@electron-preload` | `./src/electron-preload` |

Example usage:
```typescript
import { Main } from '@renderer/components/Main';
import { ipcHandlers } from '@electron-main/lib/ipc-handlers';
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
- Winbox 0.2.82
- get-port 7.1.0

### Development
- Rsbuild 1.7.2 with React plugin
- Electron 40.0.0
- electron-builder 26.4.0
- TypeScript 5.9.3
- Biome (linting and formatting)

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/description`
3. Make changes following existing code style
4. Run linting: `bun run lint`
5. Run type checking: `bun run type-check`
6. Commit changes: `git commit -m 'description'`
7. Push to branch: `git push origin feature/description`
8. Open a Pull Request

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Support

Report issues on GitHub with:
- Clear problem description
- Steps to reproduce
- Environment details (OS, Node.js version, Bun version)
- Error messages or logs
