# MyReact -- a tiny library just like React 17, used to learn/debug the internal of react

# React api, see `@my-react/react` package

## React.createElement

## React.cloneElement

## React.isValidElement

## React.Children (just like React)

## React.component

## React.PureComponent

## React.Fragment

## React.lazy

## React.Suspense

## React.createRef

## React.forwardRef

## React.createContext

## React.StrictMode

#

# Hook api

## useRef

## useMemo

## useState

## useEffect

## useReducer

## useContext

## useCallback

## useDebugValue

## useLayoutEffect

## useImperativeHandle

#

# ReactDOM api, see `@my-react/react-dom` package

## ReactDOM.render

## ReactDOM.hydrate

## ReactDOM.findDOMNode

## ReactDOM.createPortal

## ReactDOM.renderToString

## ReactDOM.unmountComponentAtNode

#

# install and test

```shell
pnpm install
pnpm run dev:ssr or pnpm run dev:csr
```

you can see the `.env` file to learn how to switch render formwork `myreact or react`

#

# more ...

## Redux

## ReactRedux

## thunkMiddleware

## Build tools

## zustand

## ReduxToolKit

## more

## KeepLive component

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