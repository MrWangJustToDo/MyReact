import { useEffect } from "react";

import { useDebouncedState } from "./useDebouncedState";

import type { RefObject } from "react";

type DOMRectType = {
  top: number;
  bottom: number;
  left: number;
  right: number;
  width: number;
  height: number;
  x: number;
  y: number;
};

const INITIAL_RECT: DOMRectType = {
  width: 0,
  height: 0,
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  x: 0,
  y: 0,
};

export function useDomSize({ ref, cssSelector }: { ref: RefObject<HTMLElement> | null; cssSelector?: string, deps?: any[] }): DOMRectType;
export function useDomSize({ ref, cssSelector }: { ref?: RefObject<HTMLElement>; cssSelector: string, deps?: any[] }): DOMRectType;
export function useDomSize({ ref, cssSelector, deps }: { ref?: RefObject<HTMLElement> | null; cssSelector?: string, deps?: any[] }) {
  const [rect, setRect] = useDebouncedState<DOMRectType>(INITIAL_RECT, 100);

  useEffect(() => {
    const domElement = ref ? ref.current : cssSelector ? document.querySelector(cssSelector) : null;
    if (domElement) {
      if (window.ResizeObserver) {
        const resizeObserver = new ResizeObserver(() => {
          setRect(domElement.getBoundingClientRect());
        });

        resizeObserver.observe(domElement);

        return () => resizeObserver.disconnect();
      } else {
        const handleResize = () => setRect(domElement.getBoundingClientRect());

        handleResize();

        window.addEventListener("resize", handleResize, { passive: true });

        return () => window.removeEventListener("resize", handleResize);
      }
    }
  }, [ref, cssSelector, setRect, ...(deps || [])]);

  return rect;
}
