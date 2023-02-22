import { AspectRatio, Box, Image } from "@chakra-ui/react";
import usePinch from "use-pinch-ref";

// import { usePinch } from "@app/hooks/usePinch";

import type { BoxProps } from "@chakra-ui/react";

export const Chart = (props: Omit<BoxProps, "children">) => {
  const { pinchRef, coverRef } = usePinch<HTMLImageElement, HTMLDivElement>();
  return (
    <Box ref={coverRef} {...props}>
      <AspectRatio ratio={220 / 35}>
        <Image ref={pinchRef} src="https://ghchart.rshah.org/MrWangJustToDo" alt="chart" cursor="zoom-in" objectFit="cover" />
      </AspectRatio>
    </Box>
  );
};
