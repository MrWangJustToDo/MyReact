import { motion, useScroll, useTransform } from "framer-motion";

import { useIsMounted } from "../hooks";

import { useScrollSection } from "./ScrollControl";

import type { ReactNode } from "react";

export const InternalSection = ({ children }: { children: ReactNode }) => {
  const { ref } = useScrollSection();

  const { scrollYProgress } = useScroll({ target: ref, axis: "y", offset: ["-0.5", "0.5"] });

  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.65, 1], [0.3, 1, 1, 0.5]);

  const y = useTransform(scrollYProgress, [0, 0.3, 0.65, 1], [100, 0, 0, -120]);

  return <motion.div style={{ opacity, y }}>{children}</motion.div>;
};

export const Section = ({ children }: { children: ReactNode }) => {
  const isMounted = useIsMounted();

  if (isMounted) return <InternalSection>{children}</InternalSection>;

  return children;
};
