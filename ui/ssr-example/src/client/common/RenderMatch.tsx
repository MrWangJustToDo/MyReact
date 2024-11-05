import { AnimatePresence, motion } from "framer-motion";
import { Fragment, Suspense } from "react";
import { useRoutes } from "react-router";

import { useIsMounted } from "@client/hooks";
import { getIsAnimateRouter } from "@shared";

import { allRoutes } from "../router";

import { useLoadedLocation } from "./WrapperRoute";

export const RenderMatch = () => {
  const loaded = useLoadedLocation();
  const all = useRoutes(allRoutes, loaded?.location);

  const isMounted = useIsMounted();

  return (
    <>
      {getIsAnimateRouter() ? (
        <AnimatePresence mode='wait'>
          <Fragment key={loaded?.location.pathname}>
            <motion.div
              initial={isMounted ? "initial" : "in"}
              animate="in"
              exit="out"
              style={{ height: "fit-content" }}
              variants={{
                initial: {
                  opacity: 0.2,
                  translateY: -100,
                  transformOrigin: "center top",
                  scale: 0.8,
                  borderRadius: 6,
                  boxShadow: "1px 1px 2px 3px rgba(0, 0, 0, 0.2), 1px -1px 2px 4px rgba(0, 0, 0, 0.2)",
                },
                in: {
                  opacity: 1,
                  translateY: 0,
                  scale: 1,
                  transformOrigin: "center top",
                  borderRadius: 0,
                  boxShadow: "0px 0px 0px 0px rgba(0, 0, 0, 0.1), 0px 0px 0px 0px rgba(0, 0, 0, 0.1)",
                },
                out: {
                  opacity: 0,
                  translateY: 200,
                  scale: 0.8,
                  transformOrigin: "center top",
                  borderRadius: 10,
                  boxShadow: "1px 1px 2px 3px rgba(0, 0, 0, 0.1), 1px -1px 2px 4px rgba(0, 0, 0, 0.1)",
                },
              }}
              transition={{
                type: "spring",
                damping: 10,
                stiffness: 50,
              }}
              data-animate-route
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
