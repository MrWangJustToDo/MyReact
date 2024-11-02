import { createState } from "reactivity-store";

export const useDevTool = createState(() => ({ open: false }), { withActions: (s) => ({ toggle: () => (s.open = !s.open) }) });
