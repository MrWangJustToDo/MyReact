import { forwardRef, Flex, Divider, Box, useMergeRefs } from "@chakra-ui/react";
import { useRef, type RefObject } from "react";
import Draggable from "react-draggable";
import { Resizable } from "react-resizable";

import { DISABLE_DRAG_HANDLER_SELECTOR, DRAG_HANDLER_SELECTOR } from "@client/config/gridLayout";
import { useStaticDomSize } from "@client/hooks";
import { cx } from "@client/utils/cx";

import { Card } from "../Card";

import type { BoxProps } from "@chakra-ui/react";

export const GridCard = forwardRef<BoxProps & { contentProps?: Omit<BoxProps, "children">; enableBlur?: boolean }, "div">(
  ({ children, className, enableBlur = true, contentProps, ...boxProps }, ref) => {
    return (
      <Card
        ref={ref}
        {...boxProps}
        className={cx(DRAG_HANDLER_SELECTOR, className)}
        backgroundColor={{ base: "mobileCardBackgroundColor", sm: "transparent" }}
        backdropFilter={{ base: "initial", sm: enableBlur ? "blur(8px)" : "initial" }}
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
  }
);

GridCard.displayName = "GridCard";

export const ResizeAbleGridCard = forwardRef<BoxProps & { contentProps?: Omit<BoxProps, "children">; enableBlur?: boolean }, "div">(
  ({ children, className, enableBlur = true, contentProps, ...boxProps }, ref: RefObject<HTMLElement>) => {
    const cardRef = useRef<HTMLDivElement>();

    const { size, setSize } = useStaticDomSize({ ref: cardRef });

    const fRef = useMergeRefs(ref, cardRef);

    const Ele = (
      <Card
        ref={fRef}
        {...boxProps}
        className={cx(DRAG_HANDLER_SELECTOR, className)}
        backgroundColor={{ base: "mobileCardBackgroundColor", sm: "transparent" }}
        backdropFilter={{ base: "initial", sm: enableBlur ? "blur(8px)" : "initial" }}
        width={size.width || boxProps.width || undefined}
        height={size.height || boxProps.height || undefined}
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

    if (size.width && size.height) {
      return (
        <Draggable handle={"." + DRAG_HANDLER_SELECTOR} cancel={"." + DISABLE_DRAG_HANDLER_SELECTOR + ",.react-resizable-handle"} nodeRef={cardRef}>
          <Resizable width={size.width} height={size.height} onResize={(_, { size }) => setSize((l) => ({ ...l, ...size }))}>
            {Ele}
          </Resizable>
        </Draggable>
      );
    } else {
      return Ele;
    }
  }
);

ResizeAbleGridCard.displayName = "ResizeAbleGridCard";
