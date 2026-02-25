# Use-Cases

The app uses a modular use-case system to define window content, metadata, and configuration. Each use-case maps to a WinBox window and a sidebar/menu entry.

## Renderer Use-Cases

Location: `src/renderer/use-cases/`

Each renderer use-case exports a `UseCase` with:

- `metadata` for search, category, and display
- `windowConfig` for WinBox configuration
- `generateContent` to render content sections

### UseCase Interface

```typescript
interface UseCase {
  id: string;
  metadata: {
    title: string;
    description: string;
    category: string;
    keywords: string[];
    icon?: string;
  };
  windowConfig: WindowConfig;
  generateContent: () => ContentSection[] | string;
}
```

### Add a New Renderer Use-Case

1. Create a new component in `src/renderer/components/features/<Name>/`
2. Add entry in `src/renderer/data/menu-data.ts`
3. Optionally register in use-case registry if needed

The menu is generated from menu-data in `src/renderer/data/menu-data.ts`.

## Main-Process Use-Cases

Location: `src/main/use-cases/` and `src/renderer/use-cases/*.main.ts`

These files define IPC handlers for native functionality:

```typescript
// Example
const handlers = {
  'usecase:myfeature:doSomething': async (context) => {
    return { success: true, data: result };
  }
};
```

To activate them:
- Register them in `electronUseCaseRegistry` from `src/renderer/use-cases/renderer-registry.ts`
- Call `registerUseCaseIpcHandlers()` from the main process

## Window Factory

The WinBox window factory lives in `src/renderer/use-cases/window-factory.ts`:

- `createWindowFromUseCase` - Create window from registered use-case
- `createWindowFromMenuItem` - Create window from menu item
- `toggleWindow` - Toggle window visibility
- `minimizeWindow` - Minimize window
- `maximizeWindow` - Maximize window

### Window Utilities

Located in `src/renderer/use-cases/window-utils.ts`:

- `contentSectionsToHtml` - Convert content to HTML
- `generateDarkTheme` - Generate dark theme colors
- `generateLightTheme` - Generate light theme colors

### Window State

Located in `src/renderer/use-cases/window-state.ts`:

- `WindowStateManager` - Track window states
- `getState`, `setState`, `removeState` - State management

## Types

Located in `src/renderer/types/index.ts`:

```typescript
interface UseCase {
  id: string;
  metadata: UseCaseMetadata;
  windowConfig: WindowConfig;
  handlers: UseCaseHandlers;
  generateContent?: () => ContentSection[] | string;
}

interface UseCaseMetadata {
  title: string;
  description: string;
  category: string;
  keywords: string[];
  icon?: string;
}

interface ContentSection {
  type: 'heading' | 'paragraph' | 'list' | 'custom';
  content: string;
  level?: number;
  items?: string[];
}
```
