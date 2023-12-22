import { createState } from "reactivity-store";

export const useFoot = createState(() => ({ state: true }), {
  withActions: (s: { state: boolean; }) => ({ enable: () => (s.state = true), disable: () => (s.state = false) }),
  withNamespace: "useFoot",
});
