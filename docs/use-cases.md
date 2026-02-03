# Use-Cases

The app uses a modular use-case system to define window content, metadata, and configuration. Each use-case maps to a WinBox window and a sidebar/menu entry.

## Renderer Use-Cases
Location: `src/renderer/use-cases/`

Each renderer use-case exports a `UseCase` with:
- `metadata` for search, category, and display
- `windowConfig` for WinBox configuration
- `generateContent` to render content sections

### Add a New Renderer Use-Case
1. Create `src/renderer/use-cases/<name>/index.ts` based on an existing use-case
2. Export a new `UseCase` with unique `metadata.id`
3. Register it in `src/renderer/use-cases/index.ts`

The menu is generated from registered use-cases in `src/renderer/data/menu-data.ts`.

## Main-Process Use-Cases
Location: `src/renderer/use-cases/*.main.ts`

These files define IPC handlers for native functionality. To activate them:
- Register them in `electronUseCaseRegistry` from `src/renderer/use-cases/registry.ts`
- Call `registerUseCaseIpcHandlers()` from the main process (already done in `src/main/main.ts`)

## Window Factory
The WinBox window factory lives in `src/renderer/use-cases/window-factory.ts`:
- `createWindowFromUseCase` for registered use-cases
- `createWindowFromMenuItem` for dynamic windows
- Utility helpers for minimize, focus, and window state
