"use client";

/**
 * Counter - Client Component
 *
 * This component uses the "use client" directive to mark it as a client component.
 * It handles interactivity with useState and onClick handlers.
 */

import { useState } from "@my-react/react";

interface CounterProps {
  initialCount: number;
}

export default function Counter({ initialCount }: CounterProps) {
  const [count, setCount] = useState(initialCount);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <button onClick={() => setCount(count - 1)} style={{ marginLeft: "0.5rem" }}>
        Decrement
      </button>
    </div>
  );
}
