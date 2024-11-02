import { motion } from "framer-motion";
import { useRef, type ReactNode } from "react";

import { IframeDevTool } from "@client/component/DevTool/Item";
import { GridCard } from "@client/component/GridCard";
import { useDevTool } from "@client/hooks/useDevTool";

export const WrapperDevTool = ({ children }: { children: ReactNode }) => {
  const isOpen = useDevTool.useShallowStableSelector((s) => s.open);

  const ref = useRef<HTMLDivElement>();

  return (
    <>
      {children}
      {isOpen && (
        <motion.div ref={ref} style={{ position: "absolute", width: "100vw", height: "100vh", top: "0", left: "0" }}>
          <motion.div drag dragConstraints={ref} style={{ position: "absolute", width: "70%", height: "80%", zIndex: 10000000 }}>
            <GridCard width="100%" height="100%">
              <IframeDevTool />
            </GridCard>
          </motion.div>
        </motion.div>
      )}
    </>
  );
};
