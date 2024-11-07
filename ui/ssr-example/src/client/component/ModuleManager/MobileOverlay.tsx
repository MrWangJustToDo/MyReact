import { AnimatePresence } from "framer-motion";

import { useOverlayArray } from "@client/hooks";

import { Mobile } from "../Overlay";

export const MobileOverlay = () => {
  const { mobile: overlays } = useOverlayArray() || {};
  return (
    <>
      {/* currently the exit animation not work, look like it is a bug, SEE https://github.com/framer/motion/issues/1085, https://github.com/framer/motion/issues/1424 */}
      <AnimatePresence>{overlays?.map((p) => (p.showState ? <Mobile key={p.key} {...p} /> : null))}</AnimatePresence>
    </>
  );
};
