import { Button, Fade, useDisclosure } from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";

const MyComponent = () => {
  const { isOpen, onToggle } = useDisclosure({ defaultIsOpen: true });
  return (
    <>
      <Button onClick={onToggle}>toggle</Button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ width: "200px", height: "300px", backgroundColor: "red" }}
          />
        )}
      </AnimatePresence>
      <Fade in={isOpen}>123</Fade>
    </>
  );
};

export default MyComponent;
