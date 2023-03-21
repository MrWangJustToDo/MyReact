import { findLast } from "lodash-es";
import { createContext, useCallback, useContext, useRef, useState } from "react";

import { delay } from "@client/utils";
import { applyOverlaysStyles, cleanupOverlaysStyles } from "@client/utils/dom";

import { useUpdate } from "./useUpdate";

import type React from "react";

const ROOT_BODY = "__content__";

const OVERLAY_TIMER = "__overlay_back";

export interface OverlayProps {
  id: string;
  key: string;
  head?: React.ReactNode;
  body: JSX.Element;
  foot?: React.ReactNode;
  height?: number;
  isFirst?: boolean;
  className?: string;
  showState?: boolean;
  applyOverlay?: (id: string, isOpen?: boolean) => void;
  closeHandler?: () => void;
  closeComplete?: () => void;
}

interface UseOverlayOpenType {
  (props: Omit<OverlayProps, "key" | "id">): void;
}

let count = 0;

export const OverlayOpenContext = createContext<UseOverlayOpenType>(() => void 0);

export const OverlayCloseContext = createContext<({ modalId, closeAll }?: { modalId?: string; closeAll?: boolean }) => void>(() => void 0);

export const OverlayArrayContext = createContext<{
  desktop: Array<OverlayProps>;
  mobile: Array<OverlayProps>;
}>({ desktop: [], mobile: [] });

export const useOverlaysProps = () => {
  const [overlays, setOverlays] = useState<OverlayProps[]>([]);
  const overlaysRef = useRef(overlays);
  const forceUpdate = useUpdate();
  overlaysRef.current = overlays;
  const applyOverlayStyle = useCallback((id: string, isOpen) => {
    delay(
      0,
      () => {
        const newAllOverlays = overlaysRef.current;
        const stillShow = newAllOverlays.filter((n) => {
          if (isOpen) {
            return n.showState || n.id === id;
          } else {
            return n.showState && n.id !== id;
          }
        });
        if (stillShow.length) {
          const allIds = stillShow.map((n) => n.id);
          const needReApplyIds = allIds.slice(0, -1);
          const needClearId = allIds[allIds.length - 1];
          applyOverlaysStyles([ROOT_BODY, ...needReApplyIds]);
          cleanupOverlaysStyles([needClearId]);
        } else {
          cleanupOverlaysStyles([ROOT_BODY]);
        }
      },
      OVERLAY_TIMER
    );
  }, []);
  const open = useCallback(
    (props: Omit<OverlayProps, "key">) => {
      const overlayProps = props as OverlayProps;
      const allOverlay = overlaysRef.current;
      const lastOpen = findLast(allOverlay, (n) => n.showState);
      overlayProps.key = `__overlay_${count++}`;
      overlayProps.id = `__overlay_${count++}`;
      overlayProps.height = lastOpen ? lastOpen.height - 6 : 92;
      overlayProps.isFirst = lastOpen ? false : true;
      overlayProps.showState = true;
      const closeHandler = overlayProps.closeHandler;
      const closeComplete = overlayProps.closeComplete;
      overlayProps.closeHandler = () => {
        overlayProps.showState = false;
        closeHandler && closeHandler();
        forceUpdate();
      };
      overlayProps.closeComplete = () => {
        closeComplete && closeComplete();
        setOverlays((last) => {
          const newAllOverlays = last.filter((n) => n !== overlayProps);
          if (newAllOverlays.length) {
            newAllOverlays.reduce((p, c) => {
              if (p.showState) {
                c.isFirst = false;
                return c;
              } else if (c.showState) {
                c.isFirst = true;
                return c;
              }
            });
          }
          return newAllOverlays;
        });
      };
      overlayProps.applyOverlay = applyOverlayStyle;
      setOverlays((last) => {
        const newAllOverlays = last.filter((n) => n.showState);
        return [...newAllOverlays, overlayProps];
      });
    },
    [forceUpdate, applyOverlayStyle]
  );
  const close = useCallback((props?: { modalId?: string; closeAll?: boolean }) => {
    const allOverlay = overlaysRef.current;
    const { modalId, closeAll } = props || {};
    if (modalId !== undefined) {
      const currentOverlay = allOverlay.find((n) => n.id === modalId);
      currentOverlay?.closeHandler();
    } else if (closeAll) {
      allOverlay.filter((n) => n.showState).forEach((n) => n?.closeHandler());
    } else {
      const currentTopOverlay = findLast(allOverlay, (n) => n.showState);
      currentTopOverlay?.closeHandler();
    }
  }, []);
  return { overlays, open, close };
};

export const useOverlaysOpen = () => useContext(OverlayOpenContext);

export const useOverlaysClose = () => useContext(OverlayCloseContext);

export const useOverlayArray = () => useContext(OverlayArrayContext);
