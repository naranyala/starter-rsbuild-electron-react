# Packaging

This project packages Electron apps using electron-builder.

## Build Outputs
- Renderer build: `dist/`
- Main process build: `dist-electron/`

## Package Command
- `bun run dist` runs `bun run build` and then `electron-builder`

## Electron Builder Config
The configuration lives in `package.json` under `build` and defines:
- `appId`
- Windows target (MSI)
- Linux targets (AppImage, deb)
- macOS DMG layout
- Packaged files: `dist/**/*`

## Icons
Icon generation is handled by scripts:
- `scripts/build-icons-new.ts`
- `scripts/build-icons.ts`

The build hooks `prebuild` and `postbuild` run these scripts automatically.
