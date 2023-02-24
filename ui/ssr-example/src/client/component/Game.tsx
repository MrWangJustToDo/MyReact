import { Button, Flex, Modal, ModalBody, ModalCloseButton, ModalContent, ModalOverlay, useDisclosure } from "@chakra-ui/react";

import { useIsMobile, useIsMounted } from "@client/hooks";

export const Game = () => {
  const isMobile = useIsMobile();

  const isMounted = useIsMounted();

  const { isOpen, onOpen, onClose } = useDisclosure();

  if (!isMounted || isMobile) return null;

  return (
    <Flex alignItems="center" justifyContent="center">
      <Button onClick={onOpen}>open</Button>
      <Modal size="4xl" isOpen={isOpen} onClose={onClose} scrollBehavior="inside">
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody>
            <iframe title="example" src="https://mrwangjusttodo.github.io/MrWangJustToDo.io/" height="800px" width="1000px" />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Flex>
  );
};
