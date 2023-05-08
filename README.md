# MyReact -- a React like project

[![Deploy](https://github.com/MrWangJustToDo/MyReact/actions/workflows/deploy.yml/badge.svg)](https://github.com/MrWangJustToDo/MyReact/actions/workflows/deploy.yml)

```shell
// install
pnpm add @my-react/react @my-react/react-dom

# currently i think it is a better way to use `alias` method/option to try this project what provide by build framework like `webpack`/`vite` and this project currently not ready for production env
```

This project provide a react like framework, for now contain `React17` & `React18` api by default 

---

### if you want to debug this project

```
clone this project

pnpm install

pnpm gen:gql

pnpm build

pnpm dev:ssr / dev:csr
```

---

## api

| @my-react/react | @my-react/react-dom    | @my-react/react-reactive | @my-react/react (hook) |
| --------------- | ---------------------- | ------------------------ | ---------------------- |
| createELement   | render                 | createReactive           | useState               |
| cloneElement    | renderToString         | reactive                 | useEffect              |
| isValidElement  | findDOMNode            | ref                      | useLayoutEffect        |
| Children        | hydrate                | computed                 | useRef                 |
| lazy            | createPortal           | watch                    | useMemo                |
| forwardRef      | unmountComponentAtNode | onBeforeMount            | useReducer             |
| createContext   | createRoot (new)       | onBeforeUnmount          | useCallback            |
| createRef       | hydrateRoot (new)      | onBeforeUpdate           | useContext             |
| memo            | renderToNodeStream     | onMounted                | useImperativeHandle    |
| Component       |                        | onUnmounted              | useDebugValue          |
| PureComponent   |                        | onUpdated                | useSignal              |
| StrictMode      |                        |                          | useDeferredValue (new) |
| Fragment        |                        |                          | useId (new)            |
| Suspense        |                        |                          | useInsertionEffect (new)   
| startTransition |                        |                          | useSyncExternalStore (new)
|                 |                        |                          | useTransition (new)

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
