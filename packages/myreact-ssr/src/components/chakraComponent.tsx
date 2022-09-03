import {
  Select,
  Button,
  Box,
  Fade,
  useDisclosure,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useColorMode,
  Text,
  Stack,
  Checkbox,
  HStack,
  PinInput,
  PinInputField,
  Modal,
  ModalContent,
  ModalCloseButton,
  ModalHeader,
  ModalOverlay,
  ModalFooter,
  ModalBody,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Input,
} from "@chakra-ui/react";
import { useRef } from "react";

export default function ChakraComponent() {
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onToggle } = useDisclosure();
  const { isOpen: _isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: __isOpen, onOpen: __onOpen, onClose: __onClose } = useDisclosure();
  const btnRef = useRef<HTMLButtonElement | null>(null);
  return (
    <>
      <h2>Chakra UI</h2>
      <Button onClick={toggleColorMode}>{colorMode}</Button>
      <Select placeholder="Select option">
        <option value="option1">Option 1</option>
        <option value="option2">Option 2</option>
        <option value="option3">Option 3</option>
      </Select>
      <Text color="text">color mode!! css variable</Text>
      <hr />
      <Button onClick={onToggle}>Click Me</Button>
      <Box width="100%" height="30px" transition="opacity .5s" opacity={isOpen ? 1 : 0} border="1px">
        123
      </Box>
      <Fade in={isOpen}>
        <Box p="40px" color="white" mt="4" bg="teal.500" rounded="md" shadow="md">
          Fade
        </Box>
      </Fade>

      <Button onClick={onOpen}>Open Modal</Button>

      <Modal isOpen={_isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modal Title</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quam odit ex quo nesciunt numquam architecto quaerat sunt est delectus porro.</p>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button variant="ghost">Secondary Action</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Button ref={btnRef} colorScheme="teal" onClick={__onOpen}>
        Open
      </Button>
      <Drawer isOpen={__isOpen} placement="right" onClose={__onClose} finalFocusRef={btnRef}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Create your account</DrawerHeader>

          <DrawerBody>
            <Input placeholder="Type here..." />
          </DrawerBody>

          <DrawerFooter>
            <Button variant="outline" mr={3} onClick={__onClose}>
              Cancel
            </Button>
            <Button colorScheme="blue">Save</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      <Stack spacing={5} direction="row">
        <Checkbox colorScheme="red" defaultChecked>
          Checkbox
        </Checkbox>
        <Checkbox colorScheme="green" defaultChecked>
          Checkbox
        </Checkbox>
      </Stack>

      <HStack>
        <PinInput>
          <PinInputField />
          <PinInputField />
          <PinInputField />
          <PinInputField />
        </PinInput>
      </HStack>

      <Menu>
        {({ isOpen }) => (
          <>
            <MenuButton
              px={4}
              py={2}
              transition="all 0.2s"
              borderRadius="md"
              borderWidth="1px"
              _hover={{ bg: "gray.100" }}
              _expanded={{ bg: "red.200" }}
              _focus={{ outline: 0, boxShadow: "outline" }}
              isActive={isOpen}
              as={Button}
              rightIcon={<span>{1234}</span>}
            >
              {isOpen ? "Close" : "Open"}
            </MenuButton>
            <MenuList border="1px">
              <MenuItem>Download</MenuItem>
              <MenuItem onClick={() => alert("Kagebunshin")}>Create a Copy</MenuItem>
            </MenuList>
          </>
        )}
      </Menu>
    </>
  );
}
