import { Box, Flex, useCallbackRef, Wrap, WrapItem } from "@chakra-ui/react";
import { useMemo } from "react";

import { useScrollControl } from "./ScrollControlContext";

import type { ReactElement } from "react";

export const ScrollControlTool = ({
  render,
}: {
  render?: ({ index, isSelect, onClick }: { index: number; isSelect: boolean; onClick: () => void }) => ReactElement;
}) => {
  const { totalSection, currentSection } = useScrollControl();

  const clickHandler = useCallbackRef((index: number) => {
    const targetElement = document.querySelector(`[data-scroll-section="${index}"]`);
    if (targetElement) {
      const rect = targetElement.getBoundingClientRect();
      const top = (document.scrollingElement?.scrollTop || 0) + rect.top;
      window.scrollTo({ top, behavior: "smooth" });
    }
  });

  const array = useMemo(() => Array(totalSection).fill(0) as number[], [totalSection]);

  return (
    <Flex
      height="100vh"
      position="fixed"
      width="30px"
      display={{ base: "none", md: "flex" }}
      flexDirection="column"
      top="0"
      right="100px"
      alignItems="center"
      justifyContent="center"
      zIndex="dropdown"
      data-scroll-tool
    >
      {currentSection <= totalSection - 1 && (
        <Wrap spacing="6">
          {array.map((_, i) => (
            <WrapItem key={i}>
              {render ? (
                render({ index: i, isSelect: currentSection === i, onClick: () => clickHandler(i) })
              ) : (
                <Box
                  width="10px"
                  height="10px"
                  cursor="pointer"
                  borderRadius="full"
                  sx={{
                    backgroundColor: currentSection === i ? "red" : "initial",
                    border: currentSection === i ? "none" : "1px solid #e2e2e2",
                  }}
                  onClick={() => clickHandler(i)}
                />
              )}
            </WrapItem>
          ))}
        </Wrap>
      )}
    </Flex>
  );
};
