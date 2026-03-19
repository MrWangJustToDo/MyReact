## 1. Package Setup

- [x] 1.1 Create `packages/myreact-server/` directory structure with `src/server/`, `src/client/`, `src/shared/`
- [x] 1.2 Create `packages/myreact-server/package.json` with dependencies on `@lazarv/rsc`, `@my-react/react`, `@my-react/react-shared`, `@my-react/react-reconciler`
- [x] 1.3 Create `packages/myreact-server/tsconfig.json` extending root config
- [x] 1.4 Update `pnpm-workspace.yaml` to include new package
- [x] 1.5 Add build configuration in `packages/myreact-server/package.json` buildOptions
- [x] 1.6 Run `pnpm install` to install `@lazarv/rsc` dependency

## 2. Shared Types and Fiber Type

- [x] 2.1 Add `__serverComponent__: 1 << 24` to `NODE_TYPE` in `packages/myreact-shared/src/type.ts`
- [x] 2.2 Create `packages/myreact-server/src/shared/types.ts` with RSC-specific types (ClientReferenceMetadata, ServerReferenceMetadata, ModuleResolver, ModuleLoader)
- [x] 2.3 Export shared types from `packages/myreact-server/src/shared/index.ts`

## 3. Server Component Dispatch

- [x] 3.1 Create `packages/myreact-server/src/server/ServerComponentDispatch.ts` extending `CustomRenderDispatch`
- [x] 3.2 Implement `processServerComponent()` method for async component execution
- [x] 3.3 Implement `getModuleResolver()` method returning resolver interface for `@lazarv/rsc`
- [x] 3.4 Add client reference map (`Map<string, ClientReferenceMetadata>`) to dispatch
- [x] 3.5 Add server reference map (`Map<string, Function>`) to dispatch

## 4. Flight Stream Rendering

- [x] 4.1 Create `packages/myreact-server/src/server/renderToFlightStream.ts`
- [x] 4.2 Implement `renderToFlightStream(element, options)` using `@lazarv/rsc` `renderToReadableStream`
- [x] 4.3 Implement server component resolution before Flight serialization
- [x] 4.4 Add error handling with digest propagation via `onError` callback
- [x] 4.5 Export `renderToFlightStream` from `packages/myreact-server/src/server/index.ts`

## 5. Client Reference Registration

- [x] 5.1 Create `packages/myreact-server/src/server/clientReferenceMap.ts`
- [x] 5.2 Implement `registerClientReference(proxy, moduleId, exportName)` function
- [x] 5.3 Implement client reference proxy with `$$typeof`, `$$id`, `$$name` properties
- [x] 5.4 Create `createClientModuleProxy(moduleId)` for full module proxies

## 6. Server Action Registration

- [x] 6.1 Create `packages/myreact-server/src/server/serverReferenceMap.ts`
- [x] 6.2 Implement `registerServerReference(fn, actionId, name)` function
- [x] 6.3 Create server action registry (`Map<string, Function>`)
- [x] 6.4 Implement `getServerAction(actionId)` lookup function

## 7. Server Action Execution

- [x] 7.1 Create `packages/myreact-server/src/server/actionHandler.ts`
- [x] 7.2 Implement `executeServerAction(actionId, body)` using `@lazarv/rsc` `decodeReply`
- [x] 7.3 Implement `handleServerAction(request)` HTTP handler for POST requests
- [x] 7.4 Add support for FormData decoding via `decodeAction`
- [x] 7.5 Implement action response encoding via `renderToFlightStream`
- [x] 7.6 Add error handling for unknown action IDs

## 8. Client Module Loader

- [x] 8.1 Create `packages/myreact-server/src/client/moduleLoader.ts`
- [x] 8.2 Implement `requireModule(metadata)` for synchronous module loading
- [x] 8.3 Implement `preloadModule(metadata)` for async chunk preloading
- [x] 8.4 Create `globalThis.__my_react_modules__` registry initialization

## 9. Flight Client Integration

- [x] 9.1 Create `packages/myreact-server/src/client/FlightClient.ts`
- [x] 9.2 Implement `createFlightClient(options)` factory function
- [x] 9.3 Implement `hydrate(container, flightStream)` method using `@lazarv/rsc` `createFromReadableStream`
- [x] 9.4 Implement `callServer(actionId, args)` method for server action invocation
- [x] 9.5 Implement `encodeReply` integration for action argument serialization

## 10. React 19 API Compatibility

- [x] 10.1 Add `use()` hook implementation in `packages/myreact/src/hook.ts` (already exists via `useFunc` in share/hook.ts)
- [x] 10.2 Add `cache()` function implementation in `packages/myreact/src/share.ts` (already exists in share/cache.ts)
- [x] 10.3 Export `use` and `cache` from `packages/myreact/src/index.ts` (already exported)
- [x] 10.4 Ensure `use()` works with Promises and Context (implemented via readPromise/readContext)

## 11. Reconciler Integration

- [x] 11.1 Update `dispatchFiber` in `packages/myreact-reconciler/src/dispatchFiber/feature.ts` to route `__serverComponent__` fibers (deferred - RSC uses Flight protocol not client reconciler)
- [x] 11.2 Create `packages/myreact-reconciler/src/processServerComponent/feature.ts` for server component processing (deferred - handled by ServerComponentDispatch)
- [x] 11.3 Add async component support to function component processing (already exists via Suspense/use())
- [x] 11.4 Export `processServerComponent` from reconciler (deferred - not needed for Flight-based RSC)

## 12. Vite Plugin - Directive Detection

- [x] 12.1 Create `packages/myreact-vite/src/rsc/index.ts` plugin entry
- [x] 12.2 Implement `detectUseClientDirective(code)` function
- [x] 12.3 Implement `detectUseServerDirective(code)` function
- [x] 12.4 Create directive detection Vite transform hook

## 13. Vite Plugin - Client Transform

- [x] 13.1 Implement `transformClientModule(code, id)` to generate client reference proxies
- [x] 13.2 Parse module exports (default and named) for proxy generation
- [x] 13.3 Generate unique module IDs for client references
- [x] 13.4 Track client modules for manifest generation

## 14. Vite Plugin - Server Transform

- [x] 14.1 Implement `transformServerModule(code, id)` for server action extraction
- [x] 14.2 Parse function declarations and arrow functions for "use server"
- [x] 14.3 Generate server action registration calls
- [x] 14.4 Track server actions for registry population

## 15. Vite Plugin - Build Configuration

- [x] 15.1 Implement server/client build splitting configuration
- [x] 15.2 Create client manifest generation in `generateBundle` hook
- [x] 15.3 Configure module resolution for RSC conditions
- [x] 15.4 Add `react({ rsc: true })` configuration option

## 16. Vite Plugin - Dev Server

- [x] 16.1 Add `/__rsc` endpoint for Flight stream requests in `configureServer`
- [x] 16.2 Add `/__rsc_action` endpoint for server action requests
- [ ] 16.3 Implement HMR support for server component changes (deferred for future)
- [x] 16.4 Add bootstrap script injection middleware

## 17. Package Exports and Types

- [x] 17.1 Create `packages/myreact-server/src/index.ts` with public exports
- [x] 17.2 Create `packages/myreact-server/src/server/index.ts` with server exports
- [x] 17.3 Create `packages/myreact-server/src/client/index.ts` with client exports
- [x] 17.4 Add TypeScript declaration generation in build config

## 18. Testing

- [x] 18.1 Create basic server component rendering test
- [x] 18.2 Create client reference serialization test
- [x] 18.3 Create server action execution test
- [ ] 18.4 Create Flight stream hydration test (requires full integration setup)
- [x] 18.5 Create Vite plugin directive detection test

## 19. Example Application

- [x] 19.1 Create `ui/rsc-example/` directory with basic RSC app
- [x] 19.2 Add example server component with async data fetching
- [x] 19.3 Add example client component with interactivity
- [x] 19.4 Add example server action with form
- [x] 19.5 Configure Vite with RSC plugin
- [x] 19.6 Add `dev:rsc` script to root package.json
