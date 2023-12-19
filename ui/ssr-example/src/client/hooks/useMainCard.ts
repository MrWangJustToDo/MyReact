import { createState } from "reactivity-store";

export const useMainCard = createState(() => ({ drag: false }), {
  withActions: (s: { drag: boolean; }) => ({ onDragStart: () => (s.drag = true), onDragEnd: () => (s.drag = false) }),
  withNamespace: "useMainCard",
});
