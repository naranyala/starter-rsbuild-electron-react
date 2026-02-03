# Troubleshooting

## Dev Server Loads Blank Window
- Confirm `ELECTRON_START_URL` is set
- Check that rsbuild started and is serving a port
- The default dev URL in `src/main/main.ts` is `http://localhost:35703`

## Electron Fails to Start in Dev
- Ensure `bun run dev` is running and rsbuild is ready
- The dev script launches Electron with `--start-dev`
- If you change main entry paths, update `scripts/start-dev-rsbuild-new.ts`

## IPC Calls Fail
- Verify the channel exists in `src/main/ipc/handlers.ts`
- Ensure the preload exports the method in `src/preload/preload.ts`
- Check that `contextIsolation` is enabled and the preload is loading

## Packaging Fails
- Run `bun run build` first to confirm both `dist/` and `dist-electron/` exist
- Verify icons exist in `dist/icon.png` for Linux/Windows targets
