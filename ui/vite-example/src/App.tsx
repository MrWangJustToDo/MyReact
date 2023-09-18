import { useState } from "react";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);
  useState();
  // useState();

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
      <h1>Vite + @my-react</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>count is {count}</button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">Click on the Vite and React logos to learn more</p>
    </>
  );
}

export default App;
