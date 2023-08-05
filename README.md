# MyReact -- a React like framework

[![Deploy](https://github.com/MrWangJustToDo/MyReact/actions/workflows/deploy.yml/badge.svg)](https://github.com/MrWangJustToDo/MyReact/actions/workflows/deploy.yml)
[![License](https://img.shields.io/npm/l/%40my-react%2Freact)](https://www.npmjs.com/search?q=%40my-react)

## Examples

Online `Next.js` example [https://mrwangjusttodo.github.io/MrWangJustToDo.io/](https://mrwangjusttodo.github.io/MrWangJustToDo.io/)

## Install

```bash
# install
pnpm add @my-react/react @my-react/react-dom

pnpm add -D @my-react/react-refresh @my-react/react-refresh-tools

# quick start in next.js (<= 12 version)
# next.config.js

const withNext = require('@my-react/react-refresh-tools/withNext');

modules.export = withNext(nextConfig);
```

---

## Packages

| Package| Version |
| :----------------------------- | :-------------------------------------------------------|
| [`@my-react/react`](packages/myreact) | ![npm (scoped)](https://img.shields.io/npm/v/%40my-react/react)   |
| [`@my-react/react-dom`](packages/myreact-dom) | ![npm (scoped)](https://img.shields.io/npm/v/%40my-react/react-dom)  |
| **refresh**  |    |
| [`@my-react/react-refresh`](packages/myreact-refresh) | ![npm (scoped)](https://img.shields.io/npm/v/%40my-react/react-refresh)  |
| [`@my-react/react-refresh-tools`](packages/myreact-refresh-tools) | ![npm (scoped)](https://img.shields.io/npm/v/%40my-react/react-refresh-tools)  |
| **internal** |     |
| [`@my-react/react-jsx`](packages/myreact-jsx) | ![npm (scoped)](https://img.shields.io/npm/v/%40my-react/react-jsx)  |
| [`@my-react/react-shared`](packages/myreact-shred) | ![npm (scoped)](https://img.shields.io/npm/v/%40my-react/react-shared)  |
| [`@my-react/react-reconciler`](packages/myreact-reconciler) | ![npm (scoped)](https://img.shields.io/npm/v/%40my-react/react-reconciler)  |
| **experimental** |  |
| [`@my-react/react-reactive`](packages/myreact-reactivity) | ![npm (scoped)](https://img.shields.io/npm/v/%40my-react/react-reactive)  |

## Development

- [node@18.x](https://nodejs.org/en)
- [pnpm@8.x](https://pnpm.io/installation)

```bash
clone this project

pnpm install

pnpm gen:gql

pnpm build

pnpm dev:ssr / dev:csr / dev:next
```

---

## Api

| @my-react/react | @my-react/react-dom    | @my-react/react-reactive | @my-react/react (hook)     |
| --------------- | ---------------------- | ------------------------ | -------------------------- |
| createELement   | render                 | createReactive           | useState                   |
| cloneElement    | renderToString         | reactive                 | useEffect                  |
| isValidElement  | findDOMNode            | ref                      | useLayoutEffect            |
| Children        | hydrate                | computed                 | useRef                     |
| lazy            | createPortal           | watch                    | useMemo                    |
| forwardRef      | unmountComponentAtNode | onBeforeMount            | useReducer                 |
| createContext   | createRoot (new)       | onBeforeUnmount          | useCallback                |
| createRef       | hydrateRoot (new)      | onBeforeUpdate           | useContext                 |
| memo            | renderToNodeStream     | onMounted                | useImperativeHandle        |
| Component       |                        | onUnmounted              | useDebugValue              |
| PureComponent   |                        | onUpdated                | useSignal                  |
| StrictMode      |                        |                          | useDeferredValue (new)     |
| Fragment        |                        |                          | useId (new)                |
| Suspense        |                        |                          | useInsertionEffect (new)   |
| startTransition |                        |                          | useSyncExternalStore (new) |
|                 |                        |                          | useTransition (new)        |

## Vue like reactive api

```tsx
import { reactive, createReactive, onMounted, onUnmounted } from "@my-react/react-reactive";

const useReactiveApi_Position = () => {
  const position = reactive({ x: 0, y: 0 });
  let id = null;
  const action = (e) => ((position.x = e.clientX), (position.y = e.clientY));
  onMounted(() => {
    window.addEventListener("mousemove", action);
  });

  onUnmounted(() => {
    window.removeEventListener("mousemove", action);
  });

  return position;
};

const Reactive1 = createReactive({
  setup(props, context) {
    const position = useReactiveApi_Position();
    const data = reactive({ a: 1 });
    const click = () => data.a++;

    return { data, click, position };
  },
  // or add a render function
  // render: (state, props, context) => xxx
});

const App = () => {
  return (
    <Reactive1 title="hello">
      {({ data, click, position, title }) => (
        <>
          <p>{data.a}</p>
          <button onClick={click}>click</button>
          <p>
            {position.x} {position.y}
          </p>
          {title}
        </>
      )}
    </Reactive1>
  );
};
```
## License

MIT