import { Box, useColorModeValue } from "@chakra-ui/react";
import { useEffect, useState } from "react";

import { useFoot, useIsMounted } from "@client/hooks";
import { useHead } from "@client/hooks/useHead";

import type { GetInitialStateType } from "@client/types/common";
import type { Excalidraw as ExcalidrawPreview } from "@excalidraw/excalidraw";

const { enable, disable } = useFoot.getActions();

const { enable: _enable, disable: _disable } = useHead.getActions();

export default function Excalidraw({ isDarkMode, Component }: { isDarkMode: boolean, Component }) {
  const isMounted = useIsMounted();

  const [Render, setRender] = useState<typeof ExcalidrawPreview>(() => Component);

  const _isDarkMode = useColorModeValue(false, true);

  useEffect(() => {
    const fetch = async () => {
      const { Excalidraw } = await import("@excalidraw/excalidraw");

      setRender(() => Excalidraw);

      disable();

      _disable();
    };

    fetch();

    return () => {
      enable();

      _enable();
    };
  }, []);

  const darkMode = isMounted ? _isDarkMode : isDarkMode;

  return (
    <Box height="100vh" width="100vw">
      {!Render ? (
        <Box width="100%" height="100%" display="flex" alignItems="center" justifyContent="center">
          Loading ...
        </Box>
      ) : (
        <Render theme={darkMode ? "dark" : "light"} />
      )}
    </Box>
  );
}

export const getInitialState: GetInitialStateType = async () => {
  if (__CLIENT__) {
    const colorMode = localStorage.getItem("chakra-ui-color-mode");

    //preload excalidraw
    const { Excalidraw } = await import("@excalidraw/excalidraw");

    return { props: { isDarkMode: colorMode === "dark" ? true : false, Component: Excalidraw } };
  }
};

export const isStatic = true;
