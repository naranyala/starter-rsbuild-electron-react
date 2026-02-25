# Packaging

This project packages Electron apps using electron-builder.

## Build Outputs

- Renderer build: `dist/`
- Main process build: `dist-electron/`
- Packaged app: `release/`

## Build Commands

```bash
# Build everything
bun run build

# Build renderer only
bun run build:web

# Build main process only
bun run build:electron

# Package for distribution
bun run dist
```

## Electron Builder Config

The configuration lives in `package.json` under `build`:

```json
{
  "build": {
    "appId": "com.your.app",
    "productName": "Your App",
    "directories": {
      "output": "release"
    },
    "files": [
      "dist/**/*",
      "dist-electron/**/*"
    ],
    "win": {
      "target": ["nsis", "msi"]
    },
    "mac": {
      "target": ["dmg"]
    },
    "linux": {
      "target": ["AppImage", "deb"]
    }
  }
}
```

## Build Process

1. `bun run build:web` - Rsbuild compiles renderer to `dist/`
2. `bun run build:electron` - TypeScript compiles main process to `dist-electron/`
3. `electron-builder` - Packages into `release/`

## Icons

Icon generation is handled by scripts:
- `scripts/build-icons-new.ts`
- `scripts/build-icons.ts`

The build hooks `prebuild` and `postbuild` run these scripts automatically.

## Output Artifacts

After running `bun run dist`:

```
release/
├── win-unpacked/           # Unpacked Windows app
├── Your-App-Setup.exe      # NSIS installer
├── Your-App.msi           # MSI installer
├── mac/
│   └── Your-App.dmg       # macOS DMG
└── linux/
    ├── Your-App.AppImage  # AppImage
    └── Your-App.deb       # Debian package
```
