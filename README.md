# MyReact -- a React like project

[![Deploy](https://github.com/MrWangJustToDo/MyReact/actions/workflows/deploy.yml/badge.svg)](https://github.com/MrWangJustToDo/MyReact/actions/workflows/deploy.yml)

```shell
// install
pnpm add @my-react/react @my-react/react-dom
```

This project provide a react like framework to build site, you can see this project github page which build by @my-react package

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

| @my-react/react | @my-react/react-dom    | @my-react/react-reactive |
| --------------- | ---------------------- | ------------------------ |
| createELement   | render                 | createReactive           |
| cloneElement    | renderToString         | reactive                 |
| isValidElement  | findDOMNode            | ref                      |
| Children        | hydrate                | computed                 |
| lazy            | createPortal           | watch                    |
| forwardRef      | unmountComponentAtNode | onBeforeMount            |
| createContext   |                        | onBeforeUnmount          |
| createRef       |                        | onBeforeUpdate           |
| memo            |                        | onMounted                |
| Component       |                        | onUnmounted              |
| PureComponent   |                        | onUpdated                |
| StrictMode      |                        |
| Fragment        |                        |
| Suspense        |                        |

## hook api

| @my-react/react     |
| ------------------- |
| useState            |
| useEffect           |
| useLayoutEffect     |
| useRef              |
| useMemo             |
| useReducer          |
| useCallback         |
| useContext          |
| useImperativeHandle |
| useDebugValue       |
| useSignal (new)     |

---

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
