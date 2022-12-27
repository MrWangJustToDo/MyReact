import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect } from "react";

import { useIsMounted } from "@client/hooks";

import { useScrollSection } from "./ScrollControl";

import type { ReactNode } from "react";

export const _Section = ({ children }: { children: ReactNode }) => {
  const { ref } = useScrollSection();
  const { scrollYProgress } = useScroll({ target: ref, axis: "y", offset: ["0 0.45", "1 0.6"] });
  const opacity = useTransform(scrollYProgress, [1, 0.5, 0], [0, 1, 0]);
  const y = useTransform(scrollYProgress, [1, 0.5, 0], [-150, 0, 150]);

  useEffect(() => {
    scrollYProgress.onChange(console.log);
    return () => scrollYProgress.clearListeners();
  }, [scrollYProgress]);

  return <motion.div style={{ opacity, y }}>{children}</motion.div>;
};

export const Section = ({ children }: { children: ReactNode }) => {
  const isMounted = useIsMounted();

  if (isMounted) {
    return <_Section key="1">{children}</_Section>;
  } else {
    return <_Section key="2">{children}</_Section>;
  }
};
