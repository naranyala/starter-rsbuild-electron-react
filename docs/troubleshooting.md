# Troubleshooting

## Dev Server Loads Blank Window

- Confirm `ELECTRON_START_URL` is set
- Check that Rsbuild started and is serving a port
- The default dev URL in `src/main/main.ts` is `http://localhost:35703`
- Check browser console for errors

## Electron Fails to Start in Dev

- Ensure `bun run dev` is running and Rsbuild is ready
- The dev script launches Electron with `--start-dev`
- If you change main entry paths, update `scripts/start-dev-rsbuild-new.ts`
- Check terminal output for error messages

## IPC Calls Fail

- Verify the channel exists in `src/shared/types/ipc-channels.ts`
- Ensure the preload exports the method in `src/preload/preload.ts`
- Check that `contextIsolation` is enabled and the preload is loading
- Check DevTools panel for error messages

## Packaging Fails

- Run `bun run build` first to confirm both `dist/` and `dist-electron/` exist
- Verify icons exist in `dist/icon.png` for Linux/Windows targets

## TypeScript Errors

- Run `bun run type-check` to see all TypeScript errors
- Ensure `tsconfig.json` and `tsconfig.electron.json` are properly configured

## Linting Errors

- Run `bun run lint` to fix auto-fixable issues
- Check `biome.json` for linting rules

## Tests Fail

- Run `bun test` to see test output
- Ensure dependencies are installed: `bun install`

## DevTools Panel Not Showing

- Press `Ctrl+Shift+D` or `F12` to toggle
- Click the bottom bar to open full panel
- Check browser console for errors

## Log Files

Main process logs are written to:
- Development: `logs-dev/main.log`
- Production: `logs/main.log`

## Performance Issues

- Check DevTools panel performance tab
- Monitor memory usage in bottom bar
- Check for memory leaks in console
