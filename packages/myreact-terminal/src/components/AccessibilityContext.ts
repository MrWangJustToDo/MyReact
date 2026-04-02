import { createContext } from "react";

export const accessibilityContext = createContext({
  isScreenReaderEnabled: false,
  instance: null,
});
