import { createContext, useContext } from "react";

export const ScrollViewContext = createContext({
  inViewArray: [] as boolean[],
  setCurrentView: (_inView: boolean, _index: number): void => void 0,
});

export const useScrollView = () => useContext(ScrollViewContext);
