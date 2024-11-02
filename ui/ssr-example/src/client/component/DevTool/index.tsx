import { ButtonGroup, Portal, Button } from "@chakra-ui/react";

import { useDevTool } from "@client/hooks/useDevTool";

export const DevTool = () => {
  const { open, toggle } = useDevTool();

  return (
    <Portal>
      <ButtonGroup variant="solid" position="fixed" bottom="4" left="4">
        <Button colorScheme="red" textTransform="capitalize" onClick={toggle}>
          {open ? "close" : "open"} DevTool
        </Button>
      </ButtonGroup>
    </Portal>
  );
};
