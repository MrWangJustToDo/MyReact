# AGENTS.md - Guidelines for AI Coding Agents

Guidelines for AI agents working in MyReact, a lightweight React-compatible framework with multiple renderers.

## Build System

**Package Manager:** pnpm 9.12.0 | **Node.js:** 16+ (20.x+ recommended)

### Essential Commands

```bash
pnpm install          # Install dependencies
pnpm build            # Build all packages
pnpm dev              # Development watch mode
pnpm lint && pnpm lint:fix   # Lint code
pnpm prettier         # Format code
pnpm clean            # Clean build artifacts
```

### Running Tests

```bash
pnpm test:terminal           # Terminal renderer tests
pnpm test:terminal-inspect   # Terminal tests with inspector
pnpm test:opentui            # OpenTUI tests (requires Bun)
pnpm test:three              # Three.js fiber tests
pnpm test:canvas             # Canvas tests
```

**Browser tests:** Open HTML files in `__tests__/` directory (e.g., `__tests__/testHook.html`).

### Development Servers

```bash
pnpm dev:ssr     # SSR example     pnpm dev:vite    # Vite example
pnpm dev:csr     # CSR example     pnpm dev:remix   # Remix example
pnpm dev:next    # Next.js example pnpm dev:rspack  # Rspack example
```

## Code Style Guidelines

### Formatting (Prettier)

- Semi: true | Trailing comma: es5 | Single quote: false
- Tab width: 2 | Print width: 160

### TypeScript

- Strict mode enabled | Target/Module: ESNext | Resolution: Node
- Path aliases in `tsconfig.json` for internal packages

### Import Style

```typescript
// Package imports (named)
import { HOOK_TYPE, ListTree } from "@my-react/react-shared";

// Relative imports within packages
import { resolveDispatcher } from "../share";

// Type-only imports - use 'import type'
import type { CustomRenderDispatch } from "../renderDispatch";

// Barrel exports in index.ts
export * from "./dispatchContext";
```

### Naming Conventions

| Element           | Convention                  | Example                                 |
| ----------------- | --------------------------- | --------------------------------------- |
| Files             | camelCase                   | `processHook.ts`, `feature.ts`          |
| Directories       | kebab-case                  | `myreact-dom`, `react-refresh`          |
| Classes           | PascalCase + MyReact prefix | `MyReactComponent`                      |
| Interfaces/Types  | PascalCase + suffix         | `ContextObjectType`, `RenderHookParams` |
| Functions         | camelCase                   | `resolveDispatcher`, `createHookNode`   |
| Constants (enums) | UPPER_SNAKE_CASE            | `HOOK_TYPE`, `EFFECT_TYPE`              |

### Error Handling

Always prefix errors with package name and provide helpful context:

```typescript
throw new Error("[@my-react/react] can not use hook outside of component");
throw new Error(
  `[@my-react/react] current hook statement have been invoke in a invalid environment, you may: 
   1. using hook in a wrong way 
   2. current environment have multiple "@my-react/react" package 
   3. current environment not have a valid "Platform" package`
);
```

### Documentation

Use JSDoc with visibility tags (`@public`, `@internal`, `@beta`):

```typescript
/**
 * @public
 */
export const useState = <T>(initial: T | (() => T)) => {
  /* ... */
};
```

### Global Variables

Use `__DEV__` for development-only code, `__VERSION__` for version info.

## Project Structure

```
MyReact/
├── packages/       # Core packages (@my-react/react, @my-react/react-dom, etc.)
├── ui/             # Example apps (ssr-example, csr-example, next-example, etc.)
├── test/           # Test applications
├── __tests__/      # Browser-based HTML tests
├── scripts/        # Build scripts (TypeScript)
└── site/           # Site packages
```

## Key Patterns

### Dispatcher Pattern for Hooks

```typescript
export const useState = <T>(initial: T | (() => T)) => {
  const dispatcher = resolveDispatcher();
  return dispatcher.useState(initial);
};
```

### Build Configuration

Each package has `buildOptions` in `package.json` for Rollup. Build scripts in `/scripts/`.

### Pre-commit Hook

Runs `clean:type` via Husky before commits.

## Tips for Agents

1. Use **pnpm** for all package operations
2. Run `pnpm lint:fix` after code changes
3. Check existing patterns in similar files before implementing
4. Follow error message format with `[@my-react/package-name]` prefix
5. Use `import type` for type-only imports
6. Path aliases available for cross-package imports during development
7. Test changes with relevant dev server or test command
