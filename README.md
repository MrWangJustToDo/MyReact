# MyReact -- a React like project


``` shell
// install
pnpm add @my-react/react @my-react/react-dom
```
This project provider a react like formwork to build site, you can see this project github page which build by @my-react package

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
|@my-react/react|@my-react/react-dom|
|---------------|-------------------|
|createELement  |render             |
|cloneElement   |renderToString     |
|isValidElement |findDOMNode        |
|Children       |hydrate            |
|lazy           |createPortal       |
|forwardRef     |unmountComponentAtNode|
|createContext  ||
|createRef||
|memo||
|Component||
|PureComponent||
|StrictMode||
|Fragment||
|Suspense||

## hook api
|@my-react/react|
|---------------|
|useState|
|useEffect|
|useLayoutEffect|
|useRef|
|useMemo|
|useReducer|
|useCallback|
|useContext|
|useImperativeHandle|
|useDebugValue|
|useSignal (new)|

---

## Vue like reactive api

```tsx
import { reactive } from "@my-react/react-reactive";
import { createReactive, __my_react_reactive__ } from "@my-react/react";

const { onMounted, onUnmounted } = __my_react_reactive__;

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
  contextType: null,
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
      {({ data, click, position }, { title }) => (
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