"use client";

import { useState } from "@my-react/react";

interface CounterProps {
  initialCount: number;
}

export default function Counter({ initialCount }: CounterProps) {
  const [count, setCount] = useState(initialCount);

  return (
    <div className="widget">
      <p className="widget-label">Counter</p>
      <p className="widget-value">{count}</p>
      <div className="widget-actions">
        <button type="button" onClick={() => setCount(count + 1)}>
          +
        </button>
        <button type="button" className="btn-ghost" onClick={() => setCount(count - 1)}>
          −
        </button>
      </div>
    </div>
  );
}
