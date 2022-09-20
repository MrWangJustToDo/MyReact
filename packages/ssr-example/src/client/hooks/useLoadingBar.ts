import { useEffect, useRef } from "react";

import { cancel, delay } from "@client/utils";

type LoadingBarProps = {
  height?: number;
  present?: number;
  loading?: boolean;
};

const useLoadingBar = (props: LoadingBarProps = {}) => {
  const { height = 1.5, present = 0, loading } = props;

  const ref = useRef<HTMLDivElement>(null);

  const state = useRef<LoadingBarProps>({ present, height });

  useEffect(() => {
    if (!loading) {
      state.current.height = height;
      state.current.present = present;
    }
  }, [loading, height, present]);

  useEffect(() => {
    if (ref.current) {
      const ele = ref.current;
      if (loading) {
        let count = 2;
        let id: number;
        const start = (): void => {
          if (count > 0.33) {
            count -= 0.04;
          }
          let next = (state.current.present || 0) + count;
          next = next < 99.5 ? next : 99.5;
          ele.style.cssText =
            "z-index: 1;" +
            "top: 0;" +
            `height: ${state.current.height}px;` +
            `transform-origin: 0 0;` +
            `transform: scale(${next / 100}, 1);` +
            `filter: drop-shadow(2px 2px 2px rgba(200, 200, 200, .4))`;
          state.current.present = next;
          id = requestAnimationFrame(start);
        };
        id = requestAnimationFrame(start);
        return () => cancelAnimationFrame(id);
      } else {
        delay(40, () => (ele.style.transform = "scale(1)"), "loadingBar").then(() => delay(80, () => (ele.style.height = "0px"), "loadingBar"));
        return () => cancel("loadingBar");
      }
    }
  }, [loading]);

  return { ref };
};

export { useLoadingBar };
