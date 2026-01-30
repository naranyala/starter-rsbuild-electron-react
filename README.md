# Electron + React Starter with Rsbuild

A production-ready boilerplate for building cross-platform desktop applications using Electron, React 19, and Rsbuild. Features a modular architecture for scalable development and optimized performance.

## Key Features

- **High-Performance Bundling**: Powered by Rsbuild for lightning-fast builds and HMR
- **Modern Tech Stack**: React 19 with TypeScript, Electron 40, and contemporary tooling
- **Modular Architecture**: Scalable use-case system for organized code structure
- **Cross-Platform**: Deploy to Windows, macOS, and Linux with a single codebase
- **Developer Experience**: Integrated linting, formatting, and path aliases
- **Window Management**: Built-in WinBox integration for advanced window controls
- **Automated IPC**: Streamlined inter-process communication with auto-registration
- **Production Ready**: Optimized configurations for distribution and packaging

## Quick Start

### Prerequisites
- Node.js >= 18.x
- Bun (recommended) or npm
- Git

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd starter-rsbuild-electron-react

# Install dependencies
bun install
# or
npm install
```

### Development
```bash
# Start development server with hot reloading
bun run dev
# or
npm run dev
```

### Production Build
```bash
# Create production build
bun run build

# Package for distribution
bun run dist
```

## Architecture Overview

This starter implements a modular use-case architecture that separates concerns between frontend components and backend services:

- **Frontend Use-Cases**: Self-contained window components with configurable layouts
- **Backend Use-Cases**: IPC handlers for main process operations
- **Registry System**: Centralized discovery and management of use-cases
- **Auto Registration**: Backend handlers automatically connect to IPC channels

## Project Structure
```
src/
├── electron-main/          # Electron main process
│   ├── use-cases/          # Backend use-case handlers
│   ├── lib/                # Main process utilities
│   └── main.ts             # Entry point
├── electron-preload/       # Preload scripts
├── renderer/               # React application
│   ├── use-cases/          # Frontend use-case modules
│   ├── components/         # React components
│   ├── styles/             # Global styles
│   └── index.tsx           # Application entry
└── assets/                 # Static assets
```

## Path Aliases

Clean imports with pre-configured aliases:
- `@` → `./src`
- `@renderer` → `./src/renderer`
- `@electron-main` → `./src/electron-main`
- `@assets` → `./src/assets`
- And more for streamlined development

## Scripts

| Command | Purpose |
|---------|---------|
| `dev` | Start development server |
| `build` | Create production build |
| `dist` | Package for distribution |
| `lint` | Code quality check |
| `type-check` | TypeScript validation |

## Benefits

- **Rapid Development**: Pre-configured tooling reduces setup time
- **Scalable Architecture**: Modular design supports growing applications
- **Optimized Performance**: Rsbuild delivers fast builds and efficient bundles
- **Maintainable Code**: Clear separation of concerns and consistent patterns
- **Professional Ready**: Production-focused configurations out of the box

## Technologies

- **Frontend**: React 19, TypeScript, Styled Components
- **Build Tool**: Rsbuild with React plugin
- **Desktop**: Electron 40 with secure IPC
- **Styling**: CSS-in-JS with component-based approach
- **Packaging**: electron-builder for cross-platform distribution
- **Quality**: Biome for linting and formatting

## License

MIT License - see the [LICENSE](LICENSE) file for details.