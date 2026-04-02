# @my-react/react-server

React Server Components (RSC) support for MyReact.

## Install

```bash
pnpm add @my-react/react-server
```

## API

### Server

```ts
import { renderToFlightStream, createFlightServer } from "@my-react/react-server/server";
```

- `renderToFlightStream(element)` – serialize a React tree to a Flight stream
- `createFlightServer({ moduleLoader, resolveModuleId })` – decode Flight on the server

### Client

```ts
import { createFlightClient } from "@my-react/react-server/client";
```

- `createFlightClient({ moduleLoader, actionEndpoint })` – decode Flight on the client and call server actions

## SSR + RSC flow

1. Server renders Flight via `renderToFlightStream`.
2. SSR decodes Flight using `createFlightServer().createFromStream(...)`.
3. HTML is rendered from the decoded tree.
4. The same Flight stream is injected into HTML for hydration.

## Options

### `createFlightServer`

- `moduleLoader` – resolves client references
- `resolveModuleId` – map ids to original sources (e.g. append `?rsc-original` in Vite)

### `createFlightClient`

- `moduleLoader` – resolves client references
- `actionEndpoint` – server action endpoint URL

## Notes

- Client references are normalized to `lazy(...)` so they can be loaded on demand.
- Promise children are wrapped to support Suspense during hydration.
