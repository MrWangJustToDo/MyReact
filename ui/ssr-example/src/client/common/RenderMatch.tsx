import { AnimatePresence, motion } from "framer-motion";
import { Fragment, Suspense } from "react";
import { useRoutes } from "react-router";

import { getIsAnimateRouter } from "@shared";

import { allRoutes } from "../router";

import { useLoadedLocation } from "./WrapperRoute";

export const RenderMatch = () => {
  const loaded = useLoadedLocation();
  const all = useRoutes(allRoutes, loaded?.location);

  return (
    <>
      {getIsAnimateRouter() ? (
        <AnimatePresence exitBeforeEnter>
          <Fragment key={loaded?.location.pathname}>
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
              <Suspense>{all}</Suspense>
            </motion.div>
          </Fragment>
        </AnimatePresence>
      ) : (
        <Suspense>{all}</Suspense>
      )}
    </>
  );
};
