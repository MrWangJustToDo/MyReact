import { createContext, useContext } from "react";

export const ScrollControlContext = createContext({
  totalSection: 0,
  currentSection: 0,
  setTotalSection: (_length: number): void => void 0,
  setCurrentSection: (_index: number): void => void 0,
  onNextSection: (): void => void 0,
  onPrevSection: (): void => void 0,
});

export const useScrollControl = () => useContext(ScrollControlContext);
