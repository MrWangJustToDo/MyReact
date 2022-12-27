import { createContext, useContext } from "react";

import type { RefObject } from "react";

export const ScrollSectionContext = createContext<{ ref: RefObject<HTMLElement> }>({ ref: { current: null } });

export const useScrollSection = () => useContext(ScrollSectionContext);
