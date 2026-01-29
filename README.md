# Electron + React Starter with Rsbuild

A modern boilerplate for building cross-platform desktop applications using Electron, React, and Rsbuild as the bundler.

## Features

- 🚀 **Fast Bundling**: Powered by Rsbuild for lightning-fast builds
- ⚛️ **React Integration**: Full React support with TypeScript
- 🖥️ **Electron Ready**: Pre-configured for desktop application development
- 📁 **Organized Structure**: Clean project structure with all sources in `./src`
- 🔧 **Modern Tooling**: Includes Biome for code formatting and linting
- 🎨 **Styling Support**: CSS modules and styled-components ready

## Project Structure

```
starter-rsbuild-electron-react/
├── src/                    # Source files
│   ├── assets/            # Static assets (icons, images)
│   ├── lib/               # Shared libraries for main/renderer processes
│   │   ├── main/          # Main process utilities
│   │   └── renderer/      # Renderer process utilities
│   ├── main/              # Electron main process code
│   ├── renderer/          # Renderer process code
│   ├── App.js             # Main React component
│   ├── App.tsx            # TypeScript version of main component
│   ├── index.html         # HTML template
│   ├── index.js           # React entry point
│   └── index.tsx          # TypeScript entry point
├── dist/                  # Build output directory
├── scripts/               # Build and development scripts
├── rsbuild.config.ts      # Rsbuild configuration
├── tsconfig.json          # TypeScript configuration
└── package.json           # Project dependencies and scripts
```

## Prerequisites

- Node.js >= 18.x
- Bun (recommended) or npm/yarn
- Git

## Getting Started

### Installation

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

### Development

To start the development server with hot reloading:

```bash
bun run dev
# or
npm run dev
```

This will:
1. Start the Rsbuild development server
2. Launch the Electron application
3. Automatically open DevTools for debugging

### Building

To create a production build:

```bash
bun run build
# or
npm run build
```

This will:
1. Bundle the React application
2. Copy necessary assets to the `dist/` directory
3. Prepare files for Electron packaging

### Packaging for Distribution

To package the application for distribution:

```bash
bun run electron-dist
# or
npm run electron-dist
```

This uses electron-builder to create distributable installers for Windows, macOS, and Linux.

## Scripts

| Script | Description |
|--------|-------------|
| `dev` | Start development server with auto-reload |
| `rsbuild-dev` | Start Rsbuild development server only |
| `electron-dev` | Launch Electron app in development mode |
| `start` | Launch Electron app in production mode |
| `build` | Build the application for production |
| `rsbuild-build` | Build using Rsbuild only |
| `type-check` | Check TypeScript compilation |
| `lint` | Lint and fix code with Biome |
| `lint-check` | Check code with Biome |
| `format` | Format code with Biome |
| `format-check` | Check code formatting with Biome |
| `electron-dist` | Package application for distribution |
| `dist` | Build and package application |

## Configuration

### Rsbuild Configuration

The `rsbuild.config.ts` file configures the bundling process:
- Aliases: `@` points to `./src`, `@/lib` points to `./src/lib`
- HTML template: Uses `./src/index.html`
- Output: Builds to `./dist`

### TypeScript Configuration

The `tsconfig.json` file sets up TypeScript with:
- Modern ES2020 target
- React JSX support
- Path aliases for easier imports
- Strict type checking

### Electron Configuration

The `package.json` includes electron-builder configuration for creating distributable packages:
- Supports Windows MSI, Linux AppImage/DEB
- Includes application metadata
- Configures build targets

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests (`bun run test` or `npm run test`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues, please open an issue on the GitHub repository with:
- Detailed description of the problem
- Steps to reproduce
- Environment information (OS, Node.js version, etc.)
- Error messages or screenshots if applicable