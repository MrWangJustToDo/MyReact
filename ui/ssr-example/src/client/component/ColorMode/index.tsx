import { Button, Icon, useColorMode } from "@chakra-ui/react";
import { MdOutlineDarkMode, MdOutlineLightMode } from "react-icons/md";

export const ColorMode = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <Button onClick={toggleColorMode} variant="ghost" size="sm">
      <Icon as={colorMode === "dark" ? MdOutlineDarkMode : MdOutlineLightMode} />
    </Button>
  );
};
