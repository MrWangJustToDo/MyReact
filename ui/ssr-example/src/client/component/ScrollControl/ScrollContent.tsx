import { useCallbackRef, useSafeLayoutEffect } from "@chakra-ui/react";
import { useScroll } from "framer-motion";
import { throttle } from "lodash-es";
import { Children, cloneElement, isValidElement, useEffect, useMemo, useState } from "react";

import { useScrollControl } from "./ScrollControlContext";
import { ScrollSection } from "./ScrollSection";
import { ScrollViewContext } from "./ScrollViewContext";

import type { ScrollSectionProps } from "./ScrollSection";
import type { ReactElement } from "react";

export const ScrollContent = ({ children }: { children: ReactElement | ReactElement[] }) => {
  const validElement: ReactElement<ScrollSectionProps>[] = [];

  const { scrollY } = useScroll();

  // filter all the valid `ScrollSection` element
  Children.forEach(children, (element) => {
    if (isValidElement<ScrollSectionProps>(element) && element.type === ScrollSection) {
      validElement.push(element);
    }
  });

  const count = validElement.length;

  const [inViewArray, setInViewArray] = useState<boolean[]>(() => Array<boolean>(count).fill(false));

  useEffect(() => {
    setInViewArray(Array(count).fill(false));
  }, [count]);

  const setCurrentView = useCallbackRef((inView: boolean, index: number) => {
    setInViewArray((last) => {
      if (last[index] !== inView) {
        const newInViewArray = [...last];
        newInViewArray[index] = inView;
        return newInViewArray;
      } else {
        return last;
      }
    });
  });

  const context = useMemo(() => ({ inViewArray, setCurrentView }), [inViewArray, setCurrentView]);

  const { setTotalSection, setCurrentSection, currentSection } = useScrollControl();

  const setCurrentSectionRef = useCallbackRef((prev: boolean) => {
    if (prev) {
      if (inViewArray[currentSection - 1]) {
        setCurrentSection(currentSection - 1);
      }
    } else {
      if (inViewArray[currentSection + 1]) {
        setCurrentSection(currentSection + 1);
      }
    }
  });

  useEffect(() => {
    let last = 0;
    const handler = throttle(
      (l: number) => {
        if (l > last) {
          setCurrentSectionRef(false);
        } else {
          setCurrentSectionRef(true);
        }
        last = l;
      },
      100,
      { leading: true, trailing: true }
    );
    scrollY.onChange(handler);
    return () => scrollY.clearListeners();
  }, [setCurrentSectionRef, scrollY]);

  useSafeLayoutEffect(() => {
    setTotalSection(count);
    setCurrentSection(0);
  }, [count, setTotalSection, setCurrentSection]);

  return (
    <ScrollViewContext.Provider value={context}>
      {Children.map(validElement, (element, index) => cloneElement(element, { index: index }))}
    </ScrollViewContext.Provider>
  );
};
