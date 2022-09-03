import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import { useRoutes } from "react-router";

import { allRoutes } from "router/routes";
import { getIsAnimateRouter } from "utils/env";

import { useLoadedLocation } from "./WrapperRoute";

export const RenderMatch = () => {
  const loaded = useLoadedLocation();
  const all = useRoutes(allRoutes, loaded?.location);

  return getIsAnimateRouter() ? (
    <AnimatePresence exitBeforeEnter>
      <React.Fragment key={loaded?.location.pathname}>
        <motion.div
          initial="initial"
          animate="in"
          exit="out"
          variants={{
            initial: {
              opacity: 0,
            },
            in: {
              opacity: 1,
            },
            out: {
              opacity: 0,
            },
          }}
          transition={{
            type: "spring",
            damping: 10,
            stiffness: 50,
          }}
        >
          {all}
        </motion.div>
      </React.Fragment>
    </AnimatePresence>
  ) : (
    all
  );
};
