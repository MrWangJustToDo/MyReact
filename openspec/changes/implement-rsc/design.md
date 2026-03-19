## Context

MyReact is a lightweight React-compatible framework with a custom fiber-based reconciler (`@my-react/react-reconciler`) and multiple renderers (DOM, Terminal, Three.js). The reconciler uses `CustomRenderDispatch` as the central orchestrator with `MyReactFiberNode` representing units of work.

Current SSR implementation in `@my-react/react-dom` supports:

- `renderToString()` - Synchronous string rendering
- `renderToPipeableStream()` - Streaming HTML with Suspense support
- Hydration via `hydrateRoot()`

The existing architecture provides extension points:

- `CustomRenderDispatch` can be extended for new render targets
- `NODE_TYPE` bitmask system allows adding new fiber types
- `dispatchFiber()` routes fibers to type-specific processors

**Key Constraint**: Use `@lazarv/rsc` for Flight protocol - it's bundler-agnostic and handles the complex serialization/deserialization, allowing us to focus on MyReact integration.

## Goals / Non-Goals

**Goals:**

- Enable server components that render only on the server with zero client JS
- Support "use client" and "use server" directives
- Implement Server Actions for mutations with form integration
- Provide React 19 API compatibility (`use()`, `cache()`, async components)
- Integrate seamlessly with existing MyReact SSR infrastructure
- Support Vite as the initial build tool

**Non-Goals:**

- Next.js/Rspack/Webpack plugin support (future phases)
- File-system based routing (framework responsibility)
- Edge runtime support (requires additional work)
- Partial pre-rendering / PPR (advanced feature for later)

## Decisions

### Decision 1: Use `@lazarv/rsc` for Flight Protocol

**Choice**: Depend on `@lazarv/rsc` rather than implementing Flight from scratch or using `react-server-dom-webpack`.

**Alternatives Considered**:

1. **`react-server-dom-webpack`**: Tightly coupled to Webpack, requires manifests
2. **Custom Flight implementation**: Massive undertaking, error-prone
3. **`@lazarv/rsc`**: Bundler-agnostic, well-tested, Web Platform APIs only

**Rationale**: `@lazarv/rsc` provides full Flight protocol parity with abstract `moduleResolver`/`moduleLoader` interfaces. We provide MyReact-specific implementations of these interfaces.

### Decision 2: New Package `@my-react/react-server`

**Choice**: Create a dedicated package rather than adding RSC to existing packages.

**Rationale**:

- Clear separation of server-only code
- Enables tree-shaking (client bundles exclude server code)
- Follows React's `react-server-dom-*` pattern
- Allows independent versioning

**Package Structure**:

```
packages/myreact-server/
├── src/
│   ├── server/           # Server-side rendering
│   │   ├── ServerComponentDispatch.ts
│   │   ├── renderToFlightStream.ts
│   │   ├── clientReferenceMap.ts
│   │   └── serverReferenceMap.ts
│   ├── client/           # Client-side hydration
│   │   ├── FlightClient.ts
│   │   └── moduleLoader.ts
│   └── shared/           # Shared types
```

### Decision 3: Extend `CustomRenderDispatch` for Server Components

**Choice**: Create `ServerComponentDispatch` extending `CustomRenderDispatch`.

**Alternatives Considered**:

1. **Modify base class**: Pollutes reconciler with server-specific logic
2. **Separate renderer**: Duplicates reconciliation logic
3. **Extension class**: Clean inheritance, reuses existing fiber processing

**Key Implementation**:

```typescript
class ServerComponentDispatch extends CustomRenderDispatch {
  async processServerComponent(fiber: MyReactFiberNode): Promise<void> {
    const component = fiber.elementType;
    const result = await component(fiber.pendingProps);
    this.transformChildrenFiber(fiber, result);
  }
}
```

### Decision 4: Add `NODE_TYPE.__serverComponent__` Fiber Type

**Choice**: Use the existing bitmask system to add a new fiber type.

**Rationale**: Consistent with existing architecture. Server components need distinct handling:

- Allow async execution
- Skip client-side effects
- Serialize to Flight format

**Implementation**: Add to `packages/myreact-shared/src/type.ts`:

```typescript
export const NODE_TYPE = {
  // ... existing
  __serverComponent__: 1 << 24,
} as const;
```

### Decision 5: Module Resolution Architecture

**Choice**: Abstract module loader interface with Vite-specific implementation.

**Server Side (moduleResolver)**:

```typescript
{
  resolveClientReference(ref) {
    return { id: ref.$$id, name: ref.$$name, chunks: [] };
  },
  resolveServerReference(ref) {
    return { id: ref.$$id, name: ref.$$name };
  }
}
```

**Client Side (moduleLoader)**:

```typescript
{
  requireModule(meta) {
    return globalThis.__my_react_modules__.get(meta.id)?.[meta.name];
  },
  preloadModule(meta) {
    return import(meta.id);
  }
}
```

### Decision 6: Vite Plugin RSC Transform

**Choice**: Enhance `@my-react/react-vite` with RSC-aware transforms.

**Transform Flow**:

1. Detect "use client" → Generate client reference proxy for server
2. Detect "use server" → Extract server actions, register references
3. Build client manifest → Map module IDs to chunks
4. Inject bootstrap → Client hydration script

## Risks / Trade-offs

### Risk 1: @lazarv/rsc Dependency Stability

**Risk**: External dependency may have breaking changes or become unmaintained.
**Mitigation**: Pin version, maintain fork capability, @lazarv/rsc is actively maintained as part of @lazarv/react-server.

### Risk 2: React 19 API Compatibility

**Risk**: MyReact internal APIs may not fully support `use()` hook semantics.
**Mitigation**: Implement `use()` hook in `@my-react/react`, leverage existing Suspense infrastructure.

### Risk 3: Build Tool Complexity

**Risk**: RSC requires coordinated server/client builds with manifest generation.
**Mitigation**: Start with Vite only (mature plugin ecosystem), document build requirements clearly.

### Risk 4: Performance Overhead

**Risk**: Flight serialization adds latency compared to direct HTML streaming.
**Mitigation**: Support direct HTML rendering for simple cases, optimize serialization paths.

### Trade-off: Bundler Abstraction vs. Deep Integration

**Trade-off**: Using `@lazarv/rsc`'s abstract interfaces means less bundler-specific optimization but more portability.
**Decision**: Accept this trade-off for initial implementation. Can add bundler-specific optimizations later.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        SERVER                                │
├─────────────────────────────────────────────────────────────┤
│  App.tsx (Server Component)                                 │
│       │                                                     │
│       ▼                                                     │
│  ┌─────────────────────┐    ┌──────────────────────┐       │
│  │ ServerComponent     │───▶│ @lazarv/rsc/server   │       │
│  │ Dispatch            │    │ renderToReadable     │       │
│  │ (extends Custom     │    │ Stream()             │       │
│  │  RenderDispatch)    │    └──────────────────────┘       │
│  └─────────────────────┘              │                     │
│           │                           │                     │
│           ▼                           ▼                     │
│  ┌─────────────────────┐    ┌──────────────────────┐       │
│  │ Client Reference    │    │ Flight Stream        │       │
│  │ Registry            │    │ (text/x-component)   │       │
│  └─────────────────────┘    └──────────────────────┘       │
└─────────────────────────────────────────────────────────────┘
                                    │
                                    │ HTTP Response
                                    ▼
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT                                │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────────┐    ┌──────────────────────┐       │
│  │ Flight Stream       │───▶│ @lazarv/rsc/client   │       │
│  │                     │    │ createFromReadable   │       │
│  └─────────────────────┘    │ Stream()             │       │
│                             └──────────────────────┘       │
│                                       │                     │
│                                       ▼                     │
│                             ┌──────────────────────┐       │
│                             │ Module Loader        │       │
│                             │ (load client         │       │
│                             │  components)         │       │
│                             └──────────────────────┘       │
│                                       │                     │
│                                       ▼                     │
│                             ┌──────────────────────┐       │
│                             │ @my-react/react-dom  │       │
│                             │ hydrateRoot()        │       │
│                             └──────────────────────┘       │
└─────────────────────────────────────────────────────────────┘
```

## File Changes Summary

| Package                | Files to Create/Modify     | Purpose                   |
| ---------------------- | -------------------------- | ------------------------- |
| `myreact-server` (new) | `src/**/*`                 | Core RSC implementation   |
| `myreact-shared`       | `src/type.ts`              | Add `__serverComponent__` |
| `myreact-reconciler`   | `dispatchFiber/feature.ts` | Route server components   |
| `myreact`              | `src/hook.ts`              | Add `use()` hook          |
| `myreact-vite`         | `src/rsc.ts`               | RSC transforms            |
| Root                   | `pnpm-workspace.yaml`      | Add new package           |
