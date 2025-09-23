// FrameLimiter component restricts the rendering FPS to the specified value
// to prevent unnecessary power usage on mobile devices.

import { useThree } from "@react-three/fiber";
import { useLayoutEffect } from "react";

function FrameLimiter({ fps = 60 }) {
  const { advance, set, frameloop: initFrameloop } = useThree();

  useLayoutEffect(() => {
    let elapsed = 0;
    let then = 0;
    let raf = null;
    const interval = 1000 / fps;

    function tick(t) {
      raf = requestAnimationFrame(tick);
      elapsed = t - then;
      if (elapsed > interval) {
        advance();
        then = t - (elapsed % interval);
      }
    }

    set({ frameloop: "never" });

    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      set({ frameloop: initFrameloop });
    };
  }, [fps]);

  return null;
}

export default FrameLimiter;
