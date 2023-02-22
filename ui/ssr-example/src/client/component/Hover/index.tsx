import { Box, forwardRef } from "@chakra-ui/react";

import type { BoxProps } from "@chakra-ui/react";

export const Hover = forwardRef<BoxProps, "div">(({ children, transform, ...props }, ref) => {
  return (
    <Box
      ref={ref}
      position="relative"
      transform={transform}
      transformOrigin="center"
      transition="transform 0.2s"
      _hover={{
        transform: `scale(1.2, 1.2) ${transform ? transform : ""}`,
        zIndex: "1",
      }}
      {...props}
    >
      {children}
    </Box>
  );
});
