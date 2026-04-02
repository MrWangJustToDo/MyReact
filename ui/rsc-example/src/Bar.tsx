"use client";

import { useState } from "react";

import { Baz } from "./Baz";

// run server and client, not rsc
export const Bar = () => {
  const [c, setC] = useState(0);

  console.log("Bar run");

  return (
    <div>
      Bar render {c} <button onClick={() => setC((i) => i + 1)}>add</button>
      <Baz />
    </div>
  );
};
