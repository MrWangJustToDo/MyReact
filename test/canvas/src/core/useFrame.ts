import { useContext, useEffect } from "react";

import { FrameLoopContext } from "./FrameLoop";

import type { FrameCallback } from "./FrameLoop";

export const useFrame = (callback: FrameCallback) => {
  const context = useContext(FrameLoopContext);

  useEffect(() => {
    if (!context) {
      throw new Error("useFrame must be used within a FrameLoopProvider");
    }
    context.subscribe(callback);
    return () => {
      context.unsubscribe(callback);
    };
  }, [callback, context]);
};
