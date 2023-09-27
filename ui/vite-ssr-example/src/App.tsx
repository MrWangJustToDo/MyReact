/* eslint-disable @typescript-eslint/ban-ts-comment */
import { createElement, useState } from "react";
import "./App.css";
import { useRoutes } from "react-router";

const pages = import.meta.glob("./page/*.tsx", { eager: true });

const routes = Object.keys(pages).map((path) => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
  const name = path.match(/\.\/page\/(.*)\.tsx$/)?.[1]!;
  return {
    name,
    path: name === "Home" ? "/" : `/${name.toLowerCase()}`,
    // @ts-ignore
    component: pages[path]!.default as React.ComponentType,
    // @ts-ignore
    element: createElement(pages[path]!.default),
  };
});

export function App() {
  const [count, setCount] = useState(0);

  const all = useRoutes(routes);

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          Vite
        </a>
        <div style={{ width: "50%" }}></div>
        <a href="https://github.com/MrWangJustToDo/MyReact" target="_blank">
          @my-react
        </a>
      </div>
      <h1>Vite + @my-react + ssr</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>count is {count}</button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      {all}
      <p className="read-the-docs">Click on the Vite and React logos to learn more</p>
    </>
  );
}
