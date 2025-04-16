# MyReact -- a React like framework

[![Deploy](https://github.com/MrWangJustToDo/MyReact/actions/workflows/deploy.yml/badge.svg)](https://github.com/MrWangJustToDo/MyReact/actions/workflows/deploy.yml)
[![License](https://img.shields.io/npm/l/%40my-react%2Freact)](https://www.npmjs.com/search?q=%40my-react)

## Examples

Online `Next.js` example [https://mrwangjusttodo.github.io/MrWangJustToDo.io/](https://mrwangjusttodo.github.io/MrWangJustToDo.io/)

## Install

```bash
# install
pnpm add @my-react/react @my-react/react-dom
```

## start in Next.js

```bash
# quick start in next.js
pnpm add -D @my-react/react-refresh @my-react/react-refresh-tools

# next.config.js
const withNext = require("@my-react/react-refresh-tools/withNext");

modules.export = withNext(nextConfig);
```

## start in Vite

```bash
# quick start in vite
pnpm add -D @my-react/react-refresh @my-react/react-vite

# vite.config.ts
import react from "@my-react/react-vite";

export default defineConfig({
  plugins: [react()],
});
```

---

## Packages

| Package                                                           | Version                                                                                                                                      |
| :---------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------- |
| [`@my-react/react`](packages/myreact)                             | [![npm (scoped)](https://img.shields.io/npm/v/%40my-react/react)](https://www.npmjs.com/package/@my-react/react)                             |
| [`@my-react/react-dom`](packages/myreact-dom)                     | [![npm (scoped)](https://img.shields.io/npm/v/%40my-react/react-dom)](https://www.npmjs.com/package/@my-react/react-dom)                     |
| **refresh**                                                       |                                                                                                                                              |
| [`@my-react/react-refresh`](packages/myreact-refresh)             | [![npm (scoped)](https://img.shields.io/npm/v/%40my-react/react-refresh)](https://www.npmjs.com/package/@my-react/react-refresh)             |
| [`@my-react/react-refresh-tools`](packages/myreact-refresh-tools) | [![npm (scoped)](https://img.shields.io/npm/v/%40my-react/react-refresh-tools)](https://www.npmjs.com/package/@my-react/react-refresh-tools) |
| [`@my-react/react-vite`](packages/myreact-vite)                   | [![npm (scoped)](https://img.shields.io/npm/v/%40my-react/react-vite)](https://www.npmjs.com/package/@my-react/react-vite)                   |
| **internal**                                                      |                                                                                                                                              |
| [`@my-react/react-jsx`](packages/myreact-jsx)                     | [![npm (scoped)](https://img.shields.io/npm/v/%40my-react/react-jsx)](https://www.npmjs.com/package/@my-react/react-jsx)                     |
| [`@my-react/react-shared`](packages/myreact-shared)               | [![npm (scoped)](https://img.shields.io/npm/v/%40my-react/react-shared)](https://www.npmjs.com/package/@my-react/react-shared)               |
| [`@my-react/react-reconciler`](packages/myreact-reconciler)       | [![npm (scoped)](https://img.shields.io/npm/v/%40my-react/react-reconciler)](https://www.npmjs.com/package/@my-react/react-reconciler)       |
| **experimental**                                                  |                                                                                                                                              |
| [`@my-react/react-reactive`](packages/myreact-reactivity)         | [![npm (scoped)](https://img.shields.io/npm/v/%40my-react/react-reactive)](https://www.npmjs.com/package/@my-react/react-reactive)           |

## Development

- [node@18.x](https://nodejs.org/en)
- [pnpm@8.x](https://pnpm.io/installation)

```bash
clone this project

pnpm install

pnpm gen:gql

pnpm build

pnpm dev:ssr / dev:csr / dev:next / dev:vite
```

---

## Api

| @my-react/react | @my-react/react-dom          | @my-react/react-reactive | @my-react/react (hook)     | @my-react/react-refresh | @my-react/react-refresh-tools | @my-react/react-vite | @my-react/react-rspack |
| --------------- | ---------------------------- | ------------------------ | -------------------------- | ----------------------- | ----------------------------- | -------------------- | ---------------------- |
| createELement   | render                       | createReactive           | useState                   | babel plugin            | webpack plugin                | vite plugin          | rspack plugin          |
| cloneElement    | renderToString               | reactive                 | useEffect                  | refresh runtime         | next.js plugin                |
| isValidElement  | findDOMNode                  | ref                      | useLayoutEffect            |                         | webpack loader                |
| Children        | hydrate                      | computed                 | useRef                     |
| lazy            | createPortal                 | watch                    | useMemo                    |
| forwardRef      | unmountComponentAtNode       | onBeforeMount            | useReducer                 |
| createContext   | createRoot (new)             | onBeforeUnmount          | useCallback                |
| createRef       | hydrateRoot (new)            | onBeforeUpdate           | useContext                 |
| memo            | renderToNodeStream           | onMounted                | useImperativeHandle        |
| Component       | renderToStaticMarkup         | onUnmounted              | useDebugValue              |
| PureComponent   | renderToStaticNodeStream     | onUpdated                | useSignal                  |
| StrictMode      | renderToPipeableStream (new) |                          | useDeferredValue (new)     |
| Fragment        | renderToReadableStream (new) |                          | useId (new)                |
| Suspense        |                              |                          | useInsertionEffect (new)   |
| startTransition |                              |                          | useSyncExternalStore (new) |
|                 |                              |                          | useTransition (new)        |

## DevTool

- [MyReact DevTool (wip)](https://github.com/MrWangJustToDo/myreact-devtools)

## License

MIT
