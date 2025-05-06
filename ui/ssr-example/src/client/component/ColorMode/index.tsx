import { Button, Icon, useColorMode } from "@chakra-ui/react";
import { SunIcon, MoonIcon } from "lucide-react";

export const ColorMode = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <Button onClick={toggleColorMode} variant="ghost" size="sm">
      <Icon as={colorMode === "dark" ? MoonIcon : SunIcon} />
    </Button>
  );
};
