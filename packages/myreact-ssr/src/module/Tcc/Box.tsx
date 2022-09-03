import { useState } from "react";

export const Box = () => {
  const [n, setN] = useState(10);

  return (
    <div>
      <p style={{ color: "red" }}>{n}</p>
      <button onClick={() => setN((i) => i + 1)}>增加</button>
      <button onClick={() => setN((i) => i - 1)}>减少</button>
    </div>
  );
};
