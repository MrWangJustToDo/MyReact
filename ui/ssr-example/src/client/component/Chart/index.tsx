import { AspectRatio, Box, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalOverlay, useDisclosure } from "@chakra-ui/react";
import GitHubCalendar from "react-github-calendar";
import usePinch from "use-pinch-ref";

import type { BoxProps } from "@chakra-ui/react";

export const Chart = (props: Omit<BoxProps, "children">) => {
  const { pinchRef, coverRef } = usePinch<HTMLImageElement, HTMLDivElement>();

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box ref={coverRef} {...props}>
      <AspectRatio ratio={220 / 35} onClick={onOpen} cursor="pointer">
        <Image ref={pinchRef} src="https://ghchart.rshah.org/MrWangJustToDo" alt="chart" cursor="zoom-in" objectFit="cover" />
      </AspectRatio>
      <Modal size="4xl" isOpen={isOpen} onClose={onClose} scrollBehavior="inside">
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody>
            <Box marginTop="4em" />
            <GitHubCalendar username="MrWangJustToDo" year="last" />
            <Box marginBottom="4em" />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};
