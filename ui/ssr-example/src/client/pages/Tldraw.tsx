import { Box, useColorModeValue } from "@chakra-ui/react";
import { useEffect, useState } from "react";

import { useDomSize, useIsMounted } from "@client/hooks";

import type { GetInitialStateType } from "@client/types/common";
import type { Tldraw as TldrawProview } from "@tldraw/tldraw";

export default function Tldraw({ isDarkMode }: { isDarkMode: boolean }) {
  const { height } = useDomSize({ cssSelector: ".site-header" });

  const isMounted = useIsMounted();

  const [loading, setLoading] = useState(true);

  const [Render, setRender] = useState<typeof TldrawProview>(() => () => null);

  const _isDarkMode = useColorModeValue(false, true);

  useEffect(() => {
    const fetch = async () => {
      // also have some error
      const { Tldraw } = await import("@tldraw/tldraw");

      setRender(() => Tldraw);

      setLoading(false);
    };

    fetch();
  }, []);

  const darkMode = isMounted ? _isDarkMode : isDarkMode;

  return (
    <Box height={`calc(100vh - ${height}px)`} position={loading ? "relative" : "fixed"} top={height + "px"} width="100vw">
      {loading ? (
        <Box width="100%" height="100%" display="flex" alignItems="center" justifyContent="center">
          Loading ...
        </Box>
      ) : (
        <Render darkMode={darkMode} showMenu showTools showUI showZoom />
      )}
    </Box>
  );
}

export const getInitialState: GetInitialStateType = () => {
  if (__CLIENT__) {
    const colorMode = localStorage.getItem("chakra-ui-color-mode");

    return { props: { isDarkMode: colorMode === "dark" ? true : false } };
  }
};

export const isStatic = true;
