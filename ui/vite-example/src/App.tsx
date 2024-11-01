import { Button, Card, ScrollAreaAutosize, useMantineColorScheme } from "@mantine/core";
import { useState } from "react";
import "./App.css";
import "@mantine/core/styles.css";

import { Example } from "./Example";

function App() {
  const [count, setCount] = useState(0);

  const { colorScheme, toggleColorScheme } = useMantineColorScheme({ keepTransitions: true });

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank" rel="noreferrer">
          Vite
        </a>
        <div style={{ width: "50%" }}></div>
        <a href="https://github.com/MrWangJustToDo/MyReact" target="_blank" rel="noreferrer">
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
      <div style={{ marginBottom: "10px" }}>
        <Button onClick={toggleColorScheme}>{colorScheme}</Button>
      </div>
      <Card withBorder style={{ textAlign: "initial" }} padding={4}>
        <ScrollAreaAutosize mah={200}>
          <Example />
        </ScrollAreaAutosize>
      </Card>
      <p className="read-the-docs">Click on the Vite and React logos to learn more</p>
    </>
  );
}

export default App;
