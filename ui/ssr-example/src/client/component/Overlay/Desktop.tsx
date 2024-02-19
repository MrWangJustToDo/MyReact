import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useBreakpointValue } from "@chakra-ui/react";

import type { OverlayProps } from "@client/hooks";

export const Desktop = (props: OverlayProps) => {
  const { head, body, foot, showState, className, closeComplete, closeHandler } = props;

  const size = useBreakpointValue({ base: "full", lg: "3xl" });

  return (
    <Modal size={size} isOpen={showState} scrollBehavior="inside" onClose={closeHandler} onCloseComplete={closeComplete}>
      <ModalOverlay backdropFilter="blur(4px)" />
      <ModalContent className={className}>
        {head && <ModalHeader>{head}</ModalHeader>}
        <ModalCloseButton />
        <ModalBody id="modal-scroll-box" paddingTop="0">
          {body}
        </ModalBody>
        {foot && <ModalFooter>{foot}</ModalFooter>}
      </ModalContent>
    </Modal>
  );
};
