import { Box } from "@chakra-ui/react";
import { useInView } from "framer-motion";
import { useEffect, useMemo, useRef } from "react";

import { useScrollControl } from "./ScrollControlContext";
import { ScrollSectionContext } from "./ScrollSectionContext";
import { useScrollView } from "./ScrollViewContext";

import type { ReactNode } from "react";

export type ScrollSectionProps = { children: ReactNode; index?: number };

export const ScrollSection = ({ children, index }: ScrollSectionProps) => {
  const ref = useRef(null);
  const context = useMemo(() => ({ ref }), []);
  const { currentSection } = useScrollControl();
  const { setCurrentView, inViewArray } = useScrollView();

  const inView = useInView(ref, { amount: "some", margin: "-300px 0px" });

  useEffect(() => {
    if (index === null || index === undefined) return;
    setCurrentView(inView, index);
  }, [index, inView, setCurrentView, inViewArray.length]);

  return (
    <ScrollSectionContext.Provider value={context}>
      <Box ref={ref} position="relative" overflow="hidden" data-scroll-section={index} data-active={currentSection === index}>
        {children}
      </Box>
    </ScrollSectionContext.Provider>
  );
};
