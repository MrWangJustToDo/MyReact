import { Tooltip } from "antd";
import { useEffect, useState } from "react";

export default function Home() {
  const [state, setState] = useState(new Date().toString());
  useEffect(() => {
    const id = setInterval(() => {
      setState(new Date().toString());
    }, 1000);
    return () => {
      clearInterval(id);
    };
  });

  return (
    <div>
      home page {state} ff
      <div style={{ color: "red" }}>test gggg fast refresh</div>
      <Tooltip title="prompt text">
        <span>Tooltip will show on mouse enter.</span>
      </Tooltip>
    </div>
  );
}
