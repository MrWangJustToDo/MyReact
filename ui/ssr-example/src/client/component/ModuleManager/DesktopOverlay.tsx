import { useOverlayArray } from "@client/hooks";

import { Desktop } from "../Overlay";

export const DesktopOverlay = () => {
  const { desktop: overlays } = useOverlayArray();

  return (
    <>
      {overlays.map((p) => (
        <Desktop key={p.key} {...p} />
      ))}
    </>
  );
};
