import { Button, Flex, Modal, ModalBody, ModalCloseButton, ModalContent, ModalOverlay, useDisclosure } from "@chakra-ui/react";
import { useEffect } from "react";

import { useIsMobile, useIsMounted } from "@client/hooks";

export const Game = () => {
  const isMobile = useIsMobile();

  const isMounted = useIsMounted();

  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    if (isMobile) {
      onClose();
    }
  }, [isMobile, onClose]);

  if (!isMounted || isMobile) return null;

  return (
    <Flex alignItems="center" justifyContent="center">
      <Button onClick={onOpen} margin="10px">
        open
      </Button>
      <Modal size="4xl" isOpen={isOpen} onClose={onClose} scrollBehavior="inside">
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody>
            {/* <iframe title="example" src="https://mrwangjusttodo.github.io/MrWangJustToDo.io/" height="800px" width="1000px" /> */}
            <iframe
              title="example"
              srcDoc={`
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.css" integrity="sha512-5A8nwdMOWrSz20fDsjczgUidUBR8liPYU+WymTZP1lmY9G6Oc7HlZv156XqnsgNUzTyMefFTcsFH/tnJE/+xBg==" crossorigin="anonymous" referrerpolicy="no-referrer" />
                <link rel="stylesheet" href="./mine.css" />
              </head>
              <body>
              <div class="container">
                <div class="head">
                <select class="select">
                  <option selected disabled hidden>请选择</option>
                  <option value="1">简单</option>
                  <option value="2">中等</option>
                  <option value="3">困难</option>
                </select>
                <nav class="tool">
                  <div class="flag">
                    <span></span>
                    <span>00</span>
                  </div>
                  <div class="time">
                    <span></span>
                    <span>0000</span>
                  </div>
                </nav>
                <nav class="close">
                  <button><i class="fa fa-close"></i></button>
                </nav>
                </div>
              </div>
              <script src="./mine.js"></script>
              </body>
            </html>
            `}
              height="800px"
              width="800px"
            ></iframe>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Flex>
  );
};
