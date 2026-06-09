import { AspectRatio, Box, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalOverlay, useDisclosure } from "@chakra-ui/react";
import { lazy, Suspense } from "react";
import usePinch from "use-pinch-ref";

import type { BoxProps } from "@chakra-ui/react";

const Calendar = lazy(() => import("react-github-calendar").then((module) => ({ default: module.GitHubCalendar })));

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
            <Suspense fallback={<Box>Loading...</Box>}>
              <Calendar username="MrWangJustToDo" year="last" />
            </Suspense>
            <Box marginBottom="4em" />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};
