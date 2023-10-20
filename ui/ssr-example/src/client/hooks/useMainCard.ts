import { createState } from "reactivity-store";

export const useMainCard = createState(() => ({ drag: false }), {
  withActions: (s) => ({ onDragStart: () => (s.drag = true), onDragEnd: () => (s.drag = false) }),
});
