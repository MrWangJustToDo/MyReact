import { Box, useColorModeValue } from "@chakra-ui/react";
import { useEffect, useState } from "react";

import { useDebouncedState, useFoot, useIsMounted } from "@client/hooks";
import { useHead } from "@client/hooks/useHead";

import type { GetInitialStateType } from "@client/types/common";
import type { Excalidraw as ExcalidrawPreview } from "@excalidraw/excalidraw";

const { enable, disable } = useFoot.getActions();

const { enable: _enable, disable: _disable } = useHead.getActions();

export default function Excalidraw({ isDarkMode }: { isDarkMode: boolean }) {
  const isMounted = useIsMounted();

  const [loading, setLoading] = useDebouncedState(true, 3000);

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const [Render, setRender] = useState<typeof ExcalidrawPreview>(() => () => null);

  const _isDarkMode = useColorModeValue(false, true);

  useEffect(() => {
    const fetch = async () => {
      // also have some error
      const { Excalidraw } = await import("@excalidraw/excalidraw");

      setRender(() => Excalidraw);

      setLoading(false);

      disable();

      _disable();
    };

    fetch();

    return () => {
      enable();

      _enable();
    };
  }, [setLoading]);

  const darkMode = isMounted ? _isDarkMode : isDarkMode;

  return (
    <Box height="100vh" width="100vw">
      {loading ? (
        <Box width="100%" height="100%" display="flex" alignItems="center" justifyContent="center">
          Loading ...
        </Box>
      ) : (
        <Render theme={darkMode ? "dark" : "light"} />
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
