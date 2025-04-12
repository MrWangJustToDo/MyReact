import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

const variants = {
  initial: {
    opacity: 0.2,
    translateY: -14,
  },
  in: {
    opacity: 1,
    translateY: 0,
  },
  out: {
    opacity: 0.2,
    translateY: 14,
  },
};

export const B = () => {
  const [f, setF] = useState(0);

  return (
    <>
      <br />
      <AnimatePresence mode="wait">
        <motion.div
          key={f}
          initial="initial"
          animate="in"
          exit="out"
          variants={variants}
          transition={{
            type: "tween",
            duration: 0.12,
          }}
        >
          {f}
        </motion.div>
      </AnimatePresence>
      <br />
      <button onClick={() => setF((i) => i + 1)}>update</button>
    </>
  );
};
