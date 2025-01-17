import { ButtonGroup, Portal, Button } from "@chakra-ui/react";
import { useEffect } from "react";

import { useDevTool } from "@client/hooks/useDevTool";

import { loadScript, sourceSrc } from "./Item";

export const DevTool = () => {
  const { open, toggle } = useDevTool();

  useEffect(() => {
    const init = async () => {
      if (!window["__MY_REACT_DEVTOOL_RUNTIME__"] || typeof window["__MY_REACT_DEVTOOL_RUNTIME__"] !== "function") {
        await loadScript(`${sourceSrc}/bundle/hook.js`);
      }
    };

    init();
  }, []);

  return (
    <Portal>
      <ButtonGroup variant="solid" position="fixed" bottom="16" left="4" zIndex="1000000">
        <Button colorScheme="red" textTransform="capitalize" onClick={toggle}>
          {open ? "close" : "open"} DevTool
        </Button>
      </ButtonGroup>
    </Portal>
  );
};
