import { useState, memo } from "react";

export const A = memo(() => {
  const [s, setS] = useState(0);
  return (
    <div>
      A component: {s} <br />
      <button onClick={() => setS(s + 1)}>add A</button>
    </div>
  );
});
