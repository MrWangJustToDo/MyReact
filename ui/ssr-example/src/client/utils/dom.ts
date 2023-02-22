const applyRootStyles = (rootId: string, p: number) => {
  const root = document.querySelector(`#${rootId}`) as HTMLDivElement;

  if (root) {
    const h = window.innerHeight;
    const s = (h - p) / h;
    root.style.overflow = "hidden";
    root.style.willChange = "transform";
    root.style.transition = "transform 200ms linear";
    root.style.transform = `translateY(calc(env(safe-area-inset-top) + ${p / 2}px)) scale(${s})`;
    root.style.filter = "blur(0.8px)";
  }
};

const cleanupRootStyles = (rootId: string) => {
  const root = document.getElementById(rootId) as HTMLDivElement;

  function onTransitionEnd() {
    root.style.removeProperty("overflow");
    root.style.removeProperty("will-change");
    root.style.removeProperty("transition");
  }

  if (root) {
    // Start animating back
    root.style.removeProperty("transform");
    root.style.removeProperty("filter");
    root.addEventListener("transitionend", onTransitionEnd, { once: true });
  }
};

export const applyOverlaysStyles = (ids: string[]) => {
  ids.reverse().forEach((id, index) => applyRootStyles(id, 18 + index * 2));
};

export const cleanupOverlaysStyles = (ids: string[]) => {
  ids.forEach(cleanupRootStyles);
};
