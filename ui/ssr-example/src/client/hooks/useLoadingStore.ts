import { createState, withActions } from "reactivity-store";

export const useLoading = createState(
  withActions(() => ({ loading: false }), {
    generateActions: (state) => ({
      setLoading: (s: boolean) => {
        state.loading = s;
      },
    }),
  }),
  {
    withNamespace: "useLoading",
    withDeepSelector: false,
  }
);
