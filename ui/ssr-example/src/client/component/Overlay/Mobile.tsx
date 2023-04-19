import { Box, Divider, Portal, useCallbackRef } from "@chakra-ui/react";
import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { useCallback, useRef } from "react";
import { RemoveScroll } from "react-remove-scroll";

import { useEffectOnce, useWindowSize } from "@client/hooks";

import type { OverlayProps } from "@client/hooks";
import type { PanInfo } from "framer-motion";

export const Mobile = (props: OverlayProps) => {
  const { id, head, body, foot, height, className, closeComplete, closeHandler, applyOverlay, isFirst } = props;

  const isOpenRef = useRef(false);

  const modalRef = useRef<HTMLDivElement>(null);

  const allowDragElement = useRef<HTMLDivElement>(null);

  const allowDrag = useRef(false);

  const { height: windowHeight } = useWindowSize();

  const indicatorRotation = useMotionValue(0);

  const indicator1Transform = useTransform(indicatorRotation, (r) => `translateX(2px) rotate(${r}deg)`);

  const indicator2Transform = useTransform(indicatorRotation, (r) => `translateX(-2px) rotate(${-1 * r}deg)`);

  const y = useMotionValue(0);

  const handleDragStart = useCallback((e: PointerEvent) => {
    if (e.target) {
      const typedElement = e.target as HTMLElement;
      if (typedElement.contains(allowDragElement.current)) {
        allowDrag.current = true;
      } else {
        allowDrag.current = false;
      }
    } else {
      allowDrag.current = false;
    }
  }, []);

  const handleDrag = useCallback((_, { delta }: PanInfo) => {
    if (!allowDrag.current) return;
    // Update drag indicator rotation based on drag velocity
    const velocity = y.getVelocity();
    if (velocity > 0) indicatorRotation.set(10);
    if (velocity < 0) indicatorRotation.set(-10);
    // Make sure user cannot drag beyond the top of the sheet
    y.set(Math.max(y.get() + delta.y, 0));
  }, []); // eslint-disable-line

  const handleDragEnd = useCallback(
    (_, { velocity }: PanInfo) => {
      if (velocity.y > 500) {
        closeHandler && closeHandler();
      } else {
        const modal = modalRef.current as HTMLDivElement;
        const contentHeight = modal?.getBoundingClientRect()?.height;
        if (y.get() / contentHeight > 0.6) {
          closeHandler && closeHandler();
        } else {
          animate(y, 0, {
            type: "spring",
            ...{ stiffness: 300, damping: 30, mass: 0.2 },
          });
        }
        indicatorRotation.set(0);
      }
    },
    [indicatorRotation] // eslint-disable-line
  );

  const animationComplete = useCallbackRef(() => {
    if (!isOpenRef.current) {
      isOpenRef.current = true;
    } else if (isOpenRef.current && closeComplete) {
      closeComplete();
      applyOverlay(id, false);
    }
  });

  useEffectOnce(() => {
    applyOverlay(id, true);
    return () => {
      applyOverlay(id, false);
    };
  });

  return (
    <Portal>
      <Box position="fixed" left="0" right="0" top="0" bottom="0" overflow="hidden" zIndex="overlay" id={id}>
        <motion.div
          drag="y"
          dragElastic={0}
          onDrag={handleDrag}
          dragMomentum={false}
          onDragEnd={handleDragEnd}
          onDragStart={handleDragStart}
          dragConstraints={{ bottom: 0, top: 0 }}
          style={{ height: "100%", width: "100%", position: "absolute" }}
        >
          <Box position="absolute" width="100%" height="100%" left="0" right="0" onClick={closeHandler} />
          <motion.div
            ref={modalRef}
            style={{
              y,
              bottom: "0",
              width: "100%",
              display: "flex",
              overflow: "hidden",
              height: `${height}%`,
              position: "absolute",
              flexDirection: "column",
              borderRadius: "8px 8px 0 0",
              filter: "drop-shadow(0 0 0.75rem rgba(100, 100, 100, 0.35))",
              border: "1px solid var(--chakra-colors-cardBorderColor)",
            }}
            initial={{ y: windowHeight }}
            animate={{ y: 0, transition: { type: "tween" } }}
            exit={{ y: windowHeight, transition: { type: "tween" } }}
            className={className}
            onAnimationComplete={animationComplete}
          >
            <Box ref={allowDragElement} height="25px" display="flex" alignItems="center" justifyContent="center" backgroundColor="mobileModalColor">
              <motion.span
                style={{
                  width: "18px",
                  height: "4px",
                  borderRadius: "99px",
                  transform: indicator1Transform,
                  backgroundColor: "var(--chakra-colors-gray-300)",
                }}
              />
              <Box width="0.5" />
              <motion.span
                style={{
                  width: "18px",
                  height: "4px",
                  borderRadius: "99px",
                  transform: indicator2Transform,
                  backgroundColor: "var(--chakra-colors-gray-300)",
                }}
              />
            </Box>
            <Divider />
            <Box backgroundColor="mobileModalColor" paddingX="3.5" paddingY="1.5">
              {head}
            </Box>
            <Box
              flex="1"
              enabled={true}
              id="modal-scroll-box"
              paddingX="3.5"
              allowPinchZoom
              removeScrollBar={isFirst}
              marginTop="-1px"
              overflow="auto"
              position="relative"
              backgroundColor="mobileModalColor"
              as={RemoveScroll}
            >
              {body}
            </Box>
            <Box backgroundColor="mobileModalColor" padding="3.5" paddingY="1.5">
              {foot}
            </Box>
          </motion.div>
        </motion.div>
      </Box>
    </Portal>
  );
};
