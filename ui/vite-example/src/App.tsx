import { useState } from "react";

import reactLogo from "./assets/react.svg";
import "./App.css";

function App() {
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
      <h1>Vite + @my-react</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>count is {count}</button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">Click on the Vite and MyReact logos to learn more</p>
    </>
  );
}

export default App;
