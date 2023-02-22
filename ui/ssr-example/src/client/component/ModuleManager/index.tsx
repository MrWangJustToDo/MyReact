import { Portal } from "@chakra-ui/react";

import { OverlayArrayContext, OverlayCloseContext, OverlayOpenContext, useOverlaysProps } from "@client/hooks";

import { DesktopOverlay } from "./DesktopOverlay";
import { MobileOverlay } from "./MobileOverlay";

export const ModuleManager = ({ children }: { children: JSX.Element | JSX.Element[] }) => {
  const { overlays, open, close } = useOverlaysProps();
  // const overlaysObj = useBreakpointValue(
  //   useMemo(
  //     () => ({
  //       base: { mobile: overlays, desktop: [] },
  //       md: { mobile: [], desktop: overlays },
  //     }),
  //     [overlays],
  //   ),
  // );
  return (
    <OverlayArrayContext.Provider value={{ mobile: [], desktop: overlays }}>
      <OverlayCloseContext.Provider value={close}>
        <OverlayOpenContext.Provider value={open}>
          {children}
          <Portal>
            <MobileOverlay />
            <DesktopOverlay />
          </Portal>
        </OverlayOpenContext.Provider>
      </OverlayCloseContext.Provider>
    </OverlayArrayContext.Provider>
  );
};
