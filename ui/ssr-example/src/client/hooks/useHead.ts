import { createState } from "reactivity-store";

export const useHead = createState(() => ({ state: true }), {
  withActions: (s: { state: boolean; }) => ({ enable: () => (s.state = true), disable: () => (s.state = false) }),
  withNamespace: "useHead",
});
