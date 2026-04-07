<div align="center">
  <h1>MyReact</h1>
  <p><strong>A lightweight, high-performance React-like framework</strong></p>
  <p>Fully compatible with React ecosystem, with built-in support for modern build tools</p>

[![Deploy](https://github.com/MrWangJustToDo/MyReact/actions/workflows/deploy.yml/badge.svg)](https://github.com/MrWangJustToDo/MyReact/actions/workflows/deploy.yml)
[![License](https://img.shields.io/npm/l/%40my-react%2Freact)](https://www.npmjs.com/search?q=%40my-react)
[![npm version](https://img.shields.io/npm/v/%40my-react/react)](https://www.npmjs.com/package/@my-react/react)
[![Downloads](https://img.shields.io/npm/dm/%40my-react/react)](https://www.npmjs.com/package/@my-react/react)

[Live Demo](https://mrwangjusttodo.github.io/MrWangJustToDo.io/) · [Documentation](#api) · [Examples](#examples)

</div>

---

## ✨ Features

- 🧬 **RSC Ready** - Experimental React Server Components with SSR + Flight streams
- 🚀 **React Compatible** - Drop-in replacement for React with the same API
- ⚡ **High Performance** - Optimized reconciler with minimal overhead
- 🔧 **Modern Tooling** - First-class support for Vite, Next.js, Rspack, and Webpack
- 🔄 **Fast Refresh** - Built-in HMR support for instant development feedback
- 🎨 **Multiple Renderers** - DOM, Terminal, and Three.js renderers out of the box
- 📦 **Tree Shakeable** - Optimized bundle size with ES modules
- 🧪 **Experimental Features** - Reactive programming model and more
- 🛠️ **DevTools** - Custom developer tools for debugging

## 🎯 Quick Start

### Installation

```bash
# Install core packages
pnpm add @my-react/react @my-react/react-dom
```

## 🔌 Framework Integration

### Next.js

```bash
pnpm add -D @my-react/react-refresh @my-react/react-refresh-tools
```

```js
// next.config.js
const withNext = require("@my-react/react-refresh-tools/withNext");

module.exports = withNext(nextConfig);
```

### Vite

```bash
pnpm add -D @my-react/react-refresh @my-react/react-vite
```

```ts
// vite.config.ts
import react from "@my-react/react-vite";

export default defineConfig({
  plugins: [
    react({
      // remix: true,  // Enable Remix framework support
      // router: true, // Enable React Router v7+ support
    }),
  ],
});
```

## 🧬 React Server Components Integration

MyReact is one of the first React-like frameworks to ship an end-to-end RSC pipeline in a non-React runtime. The integration includes:

- Flight stream serialization/deserialization powered by `@lazarv/rsc`
- Server Actions (`"use server"`) and client components (`"use client"`)
- Unified SSR + RSC flow (server renders HTML from the Flight stream)
- Vite dev server integration for RSC endpoints and SSR HTML

### RSC Flow (High Level)

1. Server renders Flight stream with `renderToFlightStream`.
2. SSR decodes the Flight stream with `createFlightServer().createFromStream(...)`.
3. HTML is rendered from the decoded tree.
4. The same Flight stream is injected into HTML for hydration.
5. Client hydrates using `createFlightClient()` and the injected stream.

### Example Entry Points

```
ui/rsc-example/src/entry-rsc.tsx    # Flight stream
ui/rsc-example/src/entry-ssr.tsx    # SSR HTML from Flight
ui/rsc-example/src/entry-client.tsx # Hydration
```

### Vite + RSC (Experimental)

```bash
pnpm add -D @my-react/react-vite
pnpm add @my-react/react-server
```

```ts
// vite.config.ts
import react from "@my-react/react-vite";

export default defineConfig({
  plugins: [
    react({
      rsc: true,
      rscEndpoint: "/__rsc",
      rscActionEndpoint: "/__rsc_action",
      ssr: {
        entryRsc: "/src/entry-rsc.tsx",
        entrySsr: "/src/entry-ssr.tsx",
      },
    }),
  ],
});
```

RSC example (SSR + RSC + hydration): `ui/rsc-example`

### Rspack

```bash
pnpm add -D @my-react/react-refresh @my-react/react-rspack
```

```ts
// rspack.config.ts
import { rspack } from "@rspack/core";
import RspackPlugin from "@my-react/react-rspack";

const config = {
  ...config,
  plugins: [...config.plugins, new RspackPlugin()],
};
```

## 🎮 Examples

<table>
  <tr>
    <td align="center">
      <a href="https://mrwangjusttodo.github.io/MrWangJustToDo.io/">
        <strong>Next.js Demo</strong>
      </a>
      <br />
      Full-featured SSR application
    </td>
    <td align="center">
      <strong>Vite</strong>
      <br />
      Fast development setup
    </td>
    <td align="center">
      <strong>RSC</strong>
      <br />
      Server Components example
    </td>
  </tr>
</table>

## 📦 Packages

### Core Packages

| Package                                                       | Version                                                                                                                         | Description                            |
| :------------------------------------------------------------ | :------------------------------------------------------------------------------------------------------------------------------ | :------------------------------------- |
| [`@my-react/react`](packages/myreact)                         | [![npm](https://img.shields.io/npm/v/%40my-react/react)](https://www.npmjs.com/package/@my-react/react)                         | Core library with hooks and components |
| [`@my-react/react-dom`](packages/myreact-dom)                 | [![npm](https://img.shields.io/npm/v/%40my-react/react-dom)](https://www.npmjs.com/package/@my-react/react-dom)                 | DOM renderer with SSR support          |
| [`@my-react/react-terminal`](packages/myreact-terminal)       | [![npm](https://img.shields.io/npm/v/%40my-react/react-terminal)](https://www.npmjs.com/package/@my-react/react-terminal)       | Terminal UI renderer                   |
| [`@my-react/react-three-fiber`](packages/myreact-three-fiber) | [![npm](https://img.shields.io/npm/v/%40my-react/react-three-fiber)](https://www.npmjs.com/package/@my-react/react-three-fiber) | Three.js renderer                      |

### Build Tool Integration

| Package                                                           | Version                                                                                                                             | Description              |
| :---------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------- | :----------------------- |
| [`@my-react/react-refresh`](packages/myreact-refresh)             | [![npm](https://img.shields.io/npm/v/%40my-react/react-refresh)](https://www.npmjs.com/package/@my-react/react-refresh)             | Fast refresh runtime     |
| [`@my-react/react-refresh-tools`](packages/myreact-refresh-tools) | [![npm](https://img.shields.io/npm/v/%40my-react/react-refresh-tools)](https://www.npmjs.com/package/@my-react/react-refresh-tools) | Webpack & Next.js plugin |
| [`@my-react/react-vite`](packages/myreact-vite)                   | [![npm](https://img.shields.io/npm/v/%40my-react/react-vite)](https://www.npmjs.com/package/@my-react/react-vite)                   | Vite plugin              |
| [`@my-react/react-rspack`](packages/myreact-rspack)               | [![npm](https://img.shields.io/npm/v/%40my-react/react-rspack)](https://www.npmjs.com/package/@my-react/react-rspack)               | Rspack plugin            |

### Internal Packages

| Package                                                                     | Version                                                                                                                                       | Description              |
| :-------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------- | :----------------------- |
| [`@my-react/react-jsx`](packages/myreact-jsx)                               | [![npm](https://img.shields.io/npm/v/%40my-react/react-jsx)](https://www.npmjs.com/package/@my-react/react-jsx)                               | JSX runtime              |
| [`@my-react/react-shared`](packages/myreact-shared)                         | [![npm](https://img.shields.io/npm/v/%40my-react/react-shared)](https://www.npmjs.com/package/@my-react/react-shared)                         | Shared utilities         |
| [`@my-react/react-reconciler`](packages/myreact-reconciler)                 | [![npm](https://img.shields.io/npm/v/%40my-react/react-reconciler)](https://www.npmjs.com/package/@my-react/react-reconciler)                 | Full-featured reconciler |
| [`@my-react/react-reconciler-compact`](packages/myreact-reconciler-compact) | [![npm](https://img.shields.io/npm/v/%40my-react/react-reconciler-compact)](https://www.npmjs.com/package/@my-react/react-reconciler-compact) | Compact reconciler       |

### Experimental

| Package                                                   | Version                                                                                                                   | Description                |
| :-------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------ | :------------------------- |
| [`@my-react/react-reactive`](packages/myreact-reactivity) | [![npm](https://img.shields.io/npm/v/%40my-react/react-reactive)](https://www.npmjs.com/package/@my-react/react-reactive) | Reactive programming model |

## 🚀 Development

### Prerequisites

- [Node.js 20.x+](https://nodejs.org/en)
- [pnpm 9.x+](https://pnpm.io/installation)

### Setup

```bash
# Clone the repository
git clone https://github.com/MrWangJustToDo/MyReact.git
cd MyReact

# Install dependencies
pnpm install

# Generate GraphQL types (if needed)
pnpm gen:gql

# Build all packages
pnpm build
```

### Development Commands

```bash
# Start development servers
pnpm dev:ssr      # SSR example
pnpm dev:csr      # CSR example
pnpm dev:next     # Next.js example
pnpm dev:vite     # Vite example
pnpm dev:remix    # Remix example
pnpm dev:rspack   # Rspack example

# Other commands
pnpm dev          # Watch mode for packages
pnpm test         # Run tests
pnpm lint         # Lint code
```

---

## 📚 API Reference

### Core API

<table>
<tr>
<td valign="top">

**@my-react/react**

- `createElement`
- `cloneElement`
- `isValidElement`
- `Children`
- `lazy`
- `forwardRef`
- `createContext`
- `createRef`
- `memo`
- `Component`
- `PureComponent`
- `StrictMode`
- `Fragment`
- `Suspense`
- `startTransition`

</td>
<td valign="top">

**@my-react/react-dom**

- `render`
- `renderToString`
- `findDOMNode`
- `hydrate`
- `createPortal`
- `unmountComponentAtNode`
- `createRoot` ⭐
- `hydrateRoot` ⭐
- `renderToNodeStream`
- `renderToStaticMarkup`
- `renderToStaticNodeStream`
- `renderToPipeableStream` ⭐
- `renderToReadableStream` ⭐

</td>
<td valign="top">

**Hooks**

- `useState`
- `useEffect`
- `useLayoutEffect`
- `useRef`
- `useMemo`
- `useReducer`
- `useCallback`
- `useContext`
- `useImperativeHandle`
- `useDebugValue`
- `useSignal`
- `useDeferredValue` ⭐
- `useId` ⭐
- `useInsertionEffect` ⭐
- `useSyncExternalStore` ⭐
- `useTransition` ⭐

</td>
<td valign="top">

**@my-react/react-reactive**

- `createReactive`
- `reactive`
- `ref`
- `computed`
- `watch`
- `onBeforeMount`
- `onBeforeUnmount`
- `onBeforeUpdate`
- `onMounted`
- `onUnmounted`
- `onUpdated`

</td>
</tr>
</table>

### React Server Components API

**@my-react/react-server/server**

- `renderToFlightStream(element)`
- `createFlightServer({ moduleLoader, resolveModuleId })`
- `registerClientReference(...)`
- `registerServerReference(...)`

**@my-react/react-server/client**

- `createFlightClient({ moduleLoader, actionEndpoint })`
- `createServerActionReference(actionId, callServer?)`

⭐ = React 18+ features

## 🛠️ DevTools

MyReact comes with custom developer tools for debugging and inspecting your applications.

**[MyReact DevTools (Beta)](https://github.com/MrWangJustToDo/myreact-devtools)**

<div align="center">
  <img src="https://raw.githubusercontent.com/MrWangJustToDo/myreact-devtools/main/light.png" alt="DevTools Light Mode" width="45%" />
  <img src="https://raw.githubusercontent.com/MrWangJustToDo/myreact-devtools/main/dark.png" alt="DevTools Dark Mode" width="45%" />
</div>

### Features

- Component tree inspection
- Props and state debugging
- Performance profiling
- Hook debugging
- Light and dark theme support

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

MIT © [MrWangJustToDo](https://github.com/MrWangJustToDo)

---

<div align="center">
  <sub>Built with ❤️ by <a href="https://github.com/MrWangJustToDo">MrWangJustToDo</a></sub>
</div>
