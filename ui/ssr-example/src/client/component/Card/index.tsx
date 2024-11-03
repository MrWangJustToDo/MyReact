import { forwardRef, Box } from "@chakra-ui/react";

import type { BoxProps } from "@chakra-ui/react";

export const Card = forwardRef<BoxProps, "div">(({ children, ...boxProps }, ref) => {
  return (
    <Box ref={ref} border="1px" boxShadow="md" borderRadius="md" borderColor="cardBorderColor" backgroundColor="cardBackgroundColor" {...boxProps}>
      {children}
    </Box>
  );
});

Card.displayName = "Card";
