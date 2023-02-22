import { forwardRef, Flex, Divider, Box } from "@chakra-ui/react";

import { DISABLE_DRAG_HANDLER_SELECTOR, DRAG_HANDLER_SELECTOR } from "@client/config/gridLayout";
import { cx } from "@client/utils/cx";

import { Card } from "../Card";

import type { BoxProps } from "@chakra-ui/react";

export const GridCard = forwardRef<BoxProps & { contentProps?: Omit<BoxProps, "children"> }, "div">(
  ({ children, className, contentProps, ...boxProps }, ref) => {
    return (
      <Card
        ref={ref}
        {...boxProps}
        className={cx(DRAG_HANDLER_SELECTOR, className)}
        backgroundColor={{ base: "mobileCardBackgroundColor", sm: "transparent" }}
        backdropFilter={{ base: "initial", sm: "blur(8px)" }}
      >
        <Flex justifyContent="center" cursor="move">
          <Box as="span" width="8" height="1" backgroundColor="gray.300" borderRadius="full" marginY="2" />
        </Flex>
        <Divider marginBottom="2" />
        <Box
          width="100%"
          height="calc(100% - var(--chakra-space-9))"
          sx={{
            scrollbarWidth: "none",
            scrollbarColor: "transparent",
          }}
          {...contentProps}
          className={DISABLE_DRAG_HANDLER_SELECTOR}
        >
          {children}
        </Box>
      </Card>
    );
  },
);
