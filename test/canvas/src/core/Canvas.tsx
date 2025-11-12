import { useRef, useEffect } from "react";

import { createRoot } from "./createRoot";
import { FrameLoopProvider } from "./FrameLoop";

interface CanvasProps {
  children?: React.ReactNode;
}

export const Canvas: React.FC<CanvasProps> = ({ children }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rootRef = useRef<ReturnType<typeof createRoot> | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas && !rootRef.current) {
      rootRef.current = createRoot(canvas);
      rootRef.current?.render(<FrameLoopProvider invalidate={rootRef.current.invalidate}>{children}</FrameLoopProvider>);
    }

    return () => {
      rootRef.current?.unmount();
    };
  }, []);

  useEffect(() => {
    rootRef.current?.render(<FrameLoopProvider invalidate={rootRef.current.invalidate}>{children}</FrameLoopProvider>);
  }, [children]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        display: "block",
        width: "100%",
        height: "100%",
      }}
    />
  );
};
