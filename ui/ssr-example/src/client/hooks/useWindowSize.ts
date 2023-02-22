import { isBrowser } from "framer-motion";
import { useEffect } from "react";

import { useDebouncedState } from "./useDebouncedState";

export const useWindowSize = () => {
  const [state, setState] = useDebouncedState({
    height: isBrowser ? window.innerHeight : 0,
    width: isBrowser ? window.innerHeight : 0,
  });

  useEffect(() => {
    const resize = () => setState({ height: window.innerHeight, width: window.innerWidth });

    resize();

    window.addEventListener("resize", resize, { passive: true });

    return window.removeEventListener("reset", resize);
  }, [setState]);

  return state;
};
