import { useState } from "react";

import reactLogo from "./assets/react.svg";
import "./App.css";

/**
 * Minimal Vite SSR demo — same surface as the official react-vite template,
 * plus hydrateRoot / renderToString in entry-client / entry-server.
 */
export function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank" rel="noreferrer">
          <img src="/vite.svg" className="logo" alt="Vite logo" />
        </a>
        <a href="https://github.com/MrWangJustToDo/MyReact" target="_blank" rel="noreferrer">
          <img src={reactLogo} className="logo react" alt="MyReact logo" />
        </a>
      </div>
      <h1>Vite SSR + @my-react</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>count is {count}</button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">Server-rendered shell, then client hydrate</p>
    </>
  );
}
