import { useBreakpointValue } from "@chakra-ui/react";

export const useIsMobile = () => {
  return useBreakpointValue({ base: true, lg: false });
};
