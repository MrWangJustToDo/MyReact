/* eslint-disable import/no-unresolved */
import { useState } from "react";

import reactLogo from "./assets/react.svg";

import viteLogo from "/vite.svg";

// import { Exp } from "./components/AutoDispose";
import { Exp } from "./components/Simple";
// import { Exp } from "./components/ContextMenuOverride";
// import { Exp } from "./components/MultiMaterial";
// import { Exp } from "./components/MultiRender";
// import { Exp } from "./components/Pointcloud";
// import { Exp } from "./components/Reparenting";
// import { Exp } from "./components/SuspenseMaterial";

import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://github.com/MrWangJustToDo/MyReact" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + @my-react + three-fiber</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>count is {count}</button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">Click on the Vite and React logos to learn more</p>
      <Exp />
    </>
  );
}

export default App;
