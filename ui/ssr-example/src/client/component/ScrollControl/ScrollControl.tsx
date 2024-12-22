import { useCallbackRef, usePrevious } from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";

import { ScrollControlContext } from "./ScrollControlContext";

import type { ReactNode } from "react";

type ScrollControlProps = {
  initialSectionLength?: number;
  onSectionIndexChange?: (currentIndex: number, prevIndex: number) => void;
  children: ReactNode;
};

export const ScrollControl = ({ onSectionIndexChange, children, initialSectionLength }: ScrollControlProps) => {
  const [currentSection, setCurrentSection] = useState(0);

  const [totalSection, setTotalSection] = useState(initialSectionLength || 0);

  const prevSection = usePrevious(currentSection);

  const onSectionIndexChangeRef = useCallbackRef(onSectionIndexChange);

  const onNextSection = useCallbackRef(() => {
    if (currentSection === totalSection - 1) {
      setCurrentSection(0);
    } else {
      setCurrentSection((i) => i + 1);
    }
  });

  const onPrevSection = useCallbackRef(() => {
    if (currentSection === 0) {
      setCurrentSection(totalSection - 1);
    } else {
      setCurrentSection((i) => i - 1);
    }
  });

  useEffect(() => {
    onSectionIndexChangeRef(currentSection, prevSection);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSection, onSectionIndexChangeRef]);

  const context = useMemo(
    () => ({ totalSection, currentSection, onNextSection, onPrevSection, setCurrentSection, setTotalSection }),
    [currentSection, onNextSection, onPrevSection, totalSection]
  );

  return <ScrollControlContext.Provider value={context}>{children}</ScrollControlContext.Provider>;
};
