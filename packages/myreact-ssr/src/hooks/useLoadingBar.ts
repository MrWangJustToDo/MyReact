import { useCallback, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import create from "zustand";
import shallow from "zustand/shallow";

import { actionName } from "config/action";
import { setDataSuccess_client } from "store/reducer/client/share/action";
import { delay, cancel } from "utils/delay";

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
            `filter: drop-shadow(2px 2px 2px rgba(200, 200, 200, 0.4))`;
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

const useLoadingBarState = create<{ loading: boolean; start: () => void; end: () => void }>((set) => ({
  loading: false,
  start: () => set({ loading: true }),
  end: () => set({ loading: false }),
}));

const useChangeLoading = () => {
  const dispatch = useDispatch();
  const start = useCallback(() => dispatch(setDataSuccess_client({ name: actionName.currentLoading, data: true })), [dispatch]);
  const end = useCallback(() => dispatch(setDataSuccess_client({ name: actionName.currentLoading, data: false })), [dispatch]);

  return { start, end };
};

const useChangeLoadingWithoutRedux = () => {
  return useLoadingBarState(
    useCallback((s) => ({ start: s.start, end: s.end }), []),
    shallow
  );
};

export { useLoadingBar, useChangeLoading, useLoadingBarState, useChangeLoadingWithoutRedux };
