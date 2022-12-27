import { Box, Icon } from "@chakra-ui/react";

// import { smoothScroll } from "@client/utils/scroll";

import { Arrow } from "../Arrow";

import { useScrollControl } from "./ScrollControlContext";

export const ScrollToTop = () => {
  const { currentSection } = useScrollControl();
  return (
    <Box
      fontSize="20px"
      position="fixed"
      right="10px"
      bottom="20px"
      width="20px"
      height="20px"
      color="orangeSand"
      textAlign="center"
      verticalAlign="middle"
      borderRadius="999999px"
      zIndex="sticky"
      display={{ base: currentSection > 0 ? "flex" : "none", md: "none" }}
      alignItems="center"
      justifyContent="center"
      onClick={() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }}
    >
      <Icon as={Arrow} width="20px" height="20px" />
    </Box>
  );
};
